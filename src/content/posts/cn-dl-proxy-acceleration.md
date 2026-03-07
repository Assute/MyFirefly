---
title: 被屏蔽海外访问的国内服务器，如何用代理做加速
published: 2026-03-06T18:55:17+08:00
description: 一篇可直接落地的完整安装教程，教你通过 CN 中继和 DL 上游，让无法直连海外资源的国内服务器稳定访问 GitHub 等站点。
image: "https://pic.sl.al/gdrive/pic/2026-03-06/fileid_1IKMO3nCtGrAzi6G6Ktjl1TGAyk1AdGdP_image.png"
tags: [服务器, 脚本]
category: 脚本
draft: false
---

## 被屏蔽海外访问的国内服务器，如何用代理做加速

如果你的国内业务机无法稳定访问 GitHub、Raw 脚本或其他海外资源，更稳妥的做法不是在业务机上硬配代理，而是把访问链路拆成两层：

- 海外机器部署 `DL-Proxy`，负责真正访问目标站点
- 国内机器部署 `CN-Proxy`，负责把业务流量中继到 `DL-Proxy`
- 业务机只访问国内中继，不再直接碰海外地址

这种方式部署简单、链路清晰，也更适合长期维护。

### 一、整体架构

```text
A（业务机，海外访问受限）
  -> B（CN-Proxy，国内中继，端口 9010）
  -> C（DL-Proxy，海外上游，端口 9011）
  -> GitHub / 任意 HTTPS 目标站点
```

**A：**你的业务服务器，只访问 B。  
**B：**国内中继服务器，运行 `CN-Proxy`。  
**C：**海外服务器，运行 `DL-Proxy`，负责访问目标站点。

### 二、部署前准备

开始前请先确认：

- **C 服务器可以正常访问海外资源**，并且已经安装 `Docker`
- **B 服务器具备 root 权限**，`CN-Proxy` 脚本会自动安装并配置 `nginx`
- 安全组或防火墙已经放通 `B:9010` 和 `C:9011`

> 注意：`DL-Proxy` 的安装脚本会构建并启动 Docker 容器，但不会自动安装 Docker。

### 三、先部署 DL（海外服务器 C）

1. 登录海外服务器：

```bash
ssh root@C_IP
```

2. 执行一键安装脚本：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Assute/dl_proxy/main/dl_proxy.sh)
```

3. 安装完成后，确认服务已经启动：

```bash
docker ps --filter "name=dl_proxy"
curl -I "http://127.0.0.1:9011/https://github.com"
```

4. 如果返回正常，说明 `DL-Proxy` 已经可用。后面部署 `CN-Proxy` 时，脚本提示你填写的 **gh-proxy 地址**，实际上就是这里的 `DL` 服务地址，例如：

```text
http://C_IP:9011
```

DL 部署完成后的示例效果：

![DL 部署完成示例](https://pic.sl.al/gdrive/pic/2026-03-06/fileid_1IKMO3nCtGrAzi6G6Ktjl1TGAyk1AdGdP_image.png)

### 四、再部署 CN（国内服务器 B）

1. 登录国内服务器：

```bash
ssh root@B_IP
```

2. 执行一键安装脚本：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Assute/cn_proxy/main/cn_proxy.sh)
```

3. 脚本会提示你输入两项内容：

- **gh-proxy 地址：**填写上一步部署好的 `DL` 地址，例如 `http://C_IP:9011`
- **本机监听端口：**直接使用默认的 `9010` 即可

4. 部署完成后，验证 `CN-Proxy` 是否正常：

```bash
nginx -t
curl -I "http://127.0.0.1:9010/https://github.com"
```

CN 部署完成后的示例效果：

![CN 部署完成示例](https://pic.sl.al/gdrive/pic/2026-03-06/fileid_1IKMO3nCtGrAzi6G6Ktjl1TGAyk1AdGdP_image.png)

### 五、业务机 A 的使用方式

部署完成后，业务机只需要把目标地址拼接到 `CN-Proxy` 后面：

```text
http://B_IP:9010/https://目标地址
```

常见示例：

```bash
# 下载压缩包
wget "http://B_IP:9010/https://github.com/user/repo/archive/master.zip"

# 克隆仓库
git clone "http://B_IP:9010/https://github.com/user/repo.git"

# 下载并执行远程脚本
bash <(curl -fsSL "http://B_IP:9010/https://raw.githubusercontent.com/user/repo/main/install.sh")

# 代理访问任意 HTTPS 资源
curl "http://B_IP:9010/https://example.com/path/to/file"
```

`CN-Proxy` 会对常见脚本和配置文件里的 `https://` 链接做替换，因此像 `bash <(curl ...)` 这类场景通常也能更稳定地跑通。

### 六、常用运维命令

**DL（C 服务器）**

```bash
docker logs -f dl_proxy
docker restart dl_proxy
docker stop dl_proxy
docker rm -f dl_proxy
```

**CN（B 服务器）**

```bash
nginx -t
systemctl restart nginx
nginx -s reload
```

### 七、常见问题

**1）CN 返回 502**  
先在 B 服务器上检查能否访问 C：

```bash
curl -I "http://C_IP:9011/https://github.com"
```

如果这里不通，优先检查 `C:9011` 是否放行，以及 `dl_proxy` 容器是否正常运行。

**2）DL 脚本执行失败**  
优先确认 C 服务器已经安装 `Docker`，并且 `docker build`、`docker run` 可以正常执行。

**3）访问超时**  
检查安全组、防火墙和运营商网络限制，确认 `B:9010`、`C:9011` 都已放通。

**4）脚本拉下来后执行过程中又访问失败**  
优先通过 `CN-Proxy` 的代理地址去拉取脚本，这样脚本内的常见 `https://` 链接也会一起被改写为代理路径。

> 建议：如果要长期对外使用，请限制来源 IP，避免代理被公网滥用。

### 八、项目地址

**CN Proxy**

GitHub：<https://github.com/Assute/cn_proxy.git>  
Gitee：<https://gitee.com/Assute/cn_proxy.git>

**DL Proxy**

GitHub：<https://github.com/Assute/dl_proxy.git>  
Gitee：<https://gitee.com/Assute/dl_proxy.git>

