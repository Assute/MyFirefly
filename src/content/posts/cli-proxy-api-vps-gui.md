---
title: CLI Proxy API VPS 一键安装与 GUI 启用指南（非 Docker）
published: 2026-03-07T14:45:00+08:00
description: 这篇文章记录如何在 Linux VPS 上通过一键安装脚本部署 CLI Proxy API，然后修改 config.yaml 启用 WebUI 管理页面，并通过重启让配置生效。
image: "https://img.072899.xyz/2025/10/37b12b67193ec67774e2f657e38eefc9.png"
tags: [AI, 教程]
category: AI
draft: false
pinned: true
sourceLink: "https://help.router-for.me/cn/hands-on/tutorial-6"
---

## 一、在 VPS 上一键安装 CLI Proxy API

先通过 SSH 登录你的 Linux VPS，然后直接执行官方推荐的一键安装命令：

```bash
curl -fsSL https://raw.githubusercontent.com/brokechubb/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
```

安装完成后，先检查服务状态：

```bash
systemctl --user status cli-proxy-api
```

如果你希望它开机自动启动，再执行：

```bash
systemctl --user enable cli-proxy-api
```

## 二、打开配置文件

默认配置文件一般在：

```bash
~/.cli-proxy-api/config.yaml
```

直接编辑它：

```bash
nano ~/.cli-proxy-api/config.yaml
```

如果你习惯用 `vi`，也可以这样：

```bash
vi ~/.cli-proxy-api/config.yaml
```

## 三、修改 config.yaml 启用 GUI

把配置文件改成类似下面这样，重点是 `remote-management` 这一段：

```yaml
port: 8317

auth-dir: "~/.cli-proxy-api"

request-retry: 3

quota-exceeded:
  switch-project: true
  switch-preview-model: true

api-keys:
  - "ABC-123456"

remote-management:
  allow-remote: true
  secret-key: "MGT-123456"
  disable-control-panel: false
```

这几项的作用分别是：

- `port: 8317`：服务监听端口
- `api-keys`：代理接口使用的访问密钥
- `remote-management.allow-remote: true`：允许远程访问 GUI
- `remote-management.secret-key`：GUI 登录密码
- `disable-control-panel: false`：启用内置控制面板

注意两点：

- `api-keys` 和 `remote-management.secret-key` 不是同一个东西
- 如果你的配置文件里已经有这些字段，直接修改原值，不要重复写两份同名配置

## 四、重启服务让配置生效

改完配置后，执行重启：

```bash
systemctl --user restart cli-proxy-api
```

然后再次确认服务状态：

```bash
systemctl --user status cli-proxy-api
```

如果你想实时看日志，可以执行：

```bash
journalctl --user -u cli-proxy-api -f
```

## 五、浏览器访问 GUI

服务重启完成后，在浏览器打开：

```text
http://你的服务器IP:8317/management.html
```

如果你已经绑定了域名，也可以这样访问：

```text
http://你的域名:8317/management.html
```

打开后输入你在配置文件里设置的管理密码，例如：

```text
MGT-123456
```

这样就可以进入 GUI 管理页面。

## 六、CLI Proxy API 的 GUI 图片

下面这张是官方 GUI 界面截图：

![CLI Proxy API GUI 界面](https://img.072899.xyz/2025/10/37b12b67193ec67774e2f657e38eefc9.png)

如果你是远程 VPS 访问场景，浏览器访问的就是主程序内置的：

```text
/management.html
```

## 七、常见问题

### 1）为什么打开不了管理页面？

优先检查下面几项：

- `remote-management.allow-remote` 是否为 `true`
- `disable-control-panel` 是否为 `false`
- 服务是否已经重启
- VPS 防火墙是否放行 `8317` 端口
- 云服务器安全组是否放行 `8317` 端口

如果你用的是 `ufw`，可以放行端口：

```bash
sudo ufw allow 8317/tcp
```

### 2）为什么输入密码后进不去？

检查你输入的是不是：

```yaml
remote-management:
  secret-key: "MGT-123456"
```

这里的 `secret-key` 是 GUI 登录密码，不是 `api-keys` 里的接口密钥。

### 3）为什么改了配置没生效？

最常见原因就是：**改完后没有重启服务**。

重新执行一次：

```bash
systemctl --user restart cli-proxy-api
```

## 八、最短操作版

如果你只想快速完成部署，直接按下面执行：

```bash
curl -fsSL https://raw.githubusercontent.com/brokechubb/cliproxyapi-installer/refs/heads/master/cliproxyapi-installer | bash
nano ~/.cli-proxy-api/config.yaml
systemctl --user restart cli-proxy-api
```

然后浏览器打开：

```text
http://你的服务器IP:8317/management.html
```

输入你设置的：

```text
MGT-123456
```

到这里就完成了：**VPS 一键安装 -> 修改配置启用 GUI -> 重启生效 -> 浏览器进入管理页面**。

## 参考资料

- 官方 GUI 教程：<https://help.router-for.me/cn/hands-on/tutorial-6>
- 配置选项文档：<https://help.router-for.me/cn/configuration/options>
- 基础配置文档：<https://help.router-for.me/cn/configuration/basic>
- GUI 仓库：<https://github.com/router-for-me/Cli-Proxy-API-Management-Center>
- 主程序仓库：<https://github.com/router-for-me/CLIProxyAPI>



