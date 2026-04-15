---
title: 用 Go 写一个网站中转加速服务
published: 2026-03-23T15:34:31+08:00
description: 一个基于 Go 的网站中转加速服务，支持固定入口访问、配置文件部署，并直接提供 Alpine Linux 二进制。
image: "https://pic.sl.al/gdrive/pic/2026-03-23/fileid_17ptfLmAJx7puJKCu5dXtUs5rCj6bFF3R_image.png"
tags: [Go, 中转加速, 服务器]
category: GitHub
draft: false
---

最近把一个自用的网站中转加速服务整理成了一个独立项目，顺手开源出来，方便后面继续维护和部署。

项目地址：

- GitHub: <https://github.com/Assute/website-proxy>

项目截图：

![website-proxy 运行截图](https://pic.sl.al/gdrive/pic/2026-03-23/fileid_17ptfLmAJx7puJKCu5dXtUs5rCj6bFF3R_image.png)

## 这个项目是做什么的

`website-proxy` 是一个用 Go 写的网站中转加速服务。

它的核心思路很简单：

- 用自己的服务器作为统一入口
- 把目标网站的访问请求转发出去
- 再把返回内容做必要处理后交给用户

这样做的好处是：

- 可以把目标网站统一挂到一个固定入口下
- 可以隐藏目标网站的真实访问地址
- 页面、静态资源和部分接口请求都可以继续走当前中转地址
- 部署方式比较轻，适合放在 Alpine Linux 服务器上运行

## 为什么要单独做这个服务

很多时候，单纯做一个反向代理并不够。

因为真实页面在加载时，往往还会继续请求：

- JS
- CSS
- 图片
- JSON 配置
- 接口地址
- 跳转地址

如果这些内容不处理，页面虽然打开了，但后续资源可能还是会跳回原站，或者因为地址不一致导致访问异常。

所以这个项目不只是“转发请求”，而是多做了一层“中转适配”：

- 重写页面里的链接和资源地址
- 重写部分接口返回内容
- 处理跳转头
- 调整部分 Cookie 和响应头

这样目标网站在中转地址下会更容易正常工作。

## 目前已经支持的内容

现在这个项目主要包含这些能力：

- 固定入口访问，例如 `/go`
- 支持直接中转到指定目标地址
- 支持页面内容重写
- 支持部分静态资源和公共内容缓存
- 支持 `config.json` 配置
- 支持 OpenRC 启动方式
- 仓库里直接附带 Alpine Linux 二进制

## 怎么运行

这个项目当前主要面向 Alpine Linux 部署。

最快方式是一键安装，直接执行：

```sh
curl -fsSL https://raw.githubusercontent.com/Assute/website-proxy/main/install.sh | sh
```

如果你要强制覆盖已有 `config.json`：

```sh
curl -fsSL https://raw.githubusercontent.com/Assute/website-proxy/main/install.sh | OVERWRITE_CONFIG=1 sh
```

一键脚本会自动下载程序、安装 OpenRC 服务、设置开机自启并立即启动。

如果你想手动安装，可以继续按下面步骤执行。

仓库里已经包含：

- `website-proxy` 二进制
- `website-proxy.initd`
- `config.json`

把这些文件放到服务器后，执行下面这几步就能跑起来：

```sh
mkdir -p /opt/website-proxy
chmod +x /opt/website-proxy/website-proxy
cp /opt/website-proxy/website-proxy.initd /etc/init.d/website-proxy
chmod +x /etc/init.d/website-proxy
rm -f /run/website-proxy.pid
rc-update add website-proxy default
rc-service website-proxy start
rc-service website-proxy status
tail -n 50 /var/log/website-proxy.log
```

默认访问入口：

```text
http://your-server:16800/go
```

配置文件默认放在：

```text
/opt/website-proxy/config.json
```

示例配置：

```json
{
  "target_url": "https://example.com",
  "allowed_host_suffixes": [
    "example.com"
  ],
  "port": 16800,
  "upstream_proxy_on": false,
  "upstream_proxy_url": "",
  "access_log": false
}
```

如果只是更新程序，可以替换新的二进制后再重启：

```sh
rc-service website-proxy stop || true
rm -f /run/website-proxy.pid
chmod +x /opt/website-proxy/website-proxy
rc-service website-proxy start
```

## 为什么选择 Go

这个项目选 Go，主要还是因为这几个原因：

- 单文件二进制部署方便
- 处理 HTTP 服务很稳
- 性能和资源占用比较平衡
- 后续扩展缓存、重写逻辑、配置加载都比较顺手

对于这种偏实用型的小服务，Go 很合适。

## 项目地址

- GitHub: <https://github.com/Assute/website-proxy>

如果你也在做类似的网站中转、统一入口或者中转加速场景，这个项目应该能提供一点参考。
