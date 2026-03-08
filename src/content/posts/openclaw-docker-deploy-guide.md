---
title: OpenClaw 汉化版 Docker 部署教程
published: 2026-03-07T16:03:54+08:00
description: 基于 OpenClawChineseTranslation 官方 Docker 部署指南整理的一篇实战教程，涵盖一键部署、手动部署、远程访问、Token 认证、Docker Compose 和更新命令。
image: "https://raw.githubusercontent.com/1186258278/OpenClawChineseTranslation/main/docs/image/5.png"
tags: [AI, 教程, OpenClaw, Docker]
category: AI
draft: false
pinned: false
sourceLink: "https://github.com/1186258278/OpenClawChineseTranslation"
---

![OpenClaw 汉化版官方截图](https://raw.githubusercontent.com/1186258278/OpenClawChineseTranslation/main/docs/image/5.png)

## 一、一键 Docker 部署

如果你想最快部署起来，官方 `DOCKER_GUIDE.md` 最推荐的方式就是直接运行一键脚本。

### Linux / macOS

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.sh | bash
```

### Windows PowerShell

```powershell
irm https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.ps1 | iex
```

官方文档说明，这个脚本会自动完成：

- 初始化配置
- 配置远程访问参数
- 启动容器

如果你不想交给脚本自动处理，可以继续看下面的手动部署方式。

---

## 二、镜像地址怎么选

官方 Docker 指南给了两个镜像源：

- `1186258278/openclaw-zh`：国内用户推荐，Docker Hub 拉取更方便
- `ghcr.io/1186258278/openclaw-zh`：海外用户或默认地址

官方文档里的命令默认使用：

```bash
ghcr.io/1186258278/openclaw-zh:latest
```

如果你在国内，只需要把它替换成：

```bash
1186258278/openclaw-zh:latest
```

---

## 三、本地快速启动

这一段适合你在本机运行，并通过 `localhost` 访问 Dashboard。

```bash
# 海外: ghcr.io/1186258278/openclaw-zh:latest
# 国内: 1186258278/openclaw-zh:latest
IMAGE=ghcr.io/1186258278/openclaw-zh:latest

# 1. 初始化配置（首次运行，需要交互式配置 AI 模型和 API 密钥）
docker run --rm -it -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw onboard

# 2. 配置网关模式（本地访问）
docker run --rm -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw config set gateway.mode local

# 3. 启动容器（守护进程模式）
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  $IMAGE \
  openclaw gateway run
```

启动后访问：

```text
http://localhost:18789
```

这组参数里最关键的是：

- `-v openclaw-data:/root/.openclaw`：把配置持久化到 Docker 数据卷
- `-p 18789:18789`：把网关端口映射出来
- `--restart unless-stopped`：除非你手动停掉，否则容器会自动保持运行

---

## 四、服务器远程部署

如果你准备部署到 VPS 或其他服务器，并且要从别的设备访问，就要按官方 Docker 指南多配置几步。

```bash
# 海外: ghcr.io/1186258278/openclaw-zh:latest
# 国内: 1186258278/openclaw-zh:latest
IMAGE=ghcr.io/1186258278/openclaw-zh:latest

# 1. 创建数据卷
docker volume create openclaw-data

# 2. 初始化配置（首次运行）
docker run --rm -it -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw onboard

# 3. 配置远程访问参数
docker run --rm -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw config set gateway.mode local

docker run --rm -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw config set gateway.bind lan

# 4. 设置访问令牌（推荐）
docker run --rm -v openclaw-data:/root/.openclaw \
  $IMAGE openclaw config set gateway.auth.token your-secure-token

# 5. 启动容器
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  $IMAGE \
  openclaw gateway run
```

部署完成后访问：

```text
http://服务器IP:18789
```

然后在 Dashboard 里输入你设置的：

```text
your-secure-token
```

---

## 五、远程访问与 Token 认证

这是官方 Docker 指南里专门强调的一点。

如果你通过 HTTP 从非 `localhost` 访问，浏览器会阻止设备身份验证，因为 `Web Crypto API` 需要更安全的上下文环境。

官方给出的最推荐解决方案就是：**设置 Token 认证**。

如果你容器已经跑起来了，也可以后补：

```bash
docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN
docker restart openclaw
```

然后在浏览器访问：

```text
http://服务器IP:18789/overview
```

在「网关令牌」输入框里填入：

```text
YOUR_TOKEN
```

官方文档里还列了几种替代方案：

- Token 认证：最简单，适合内网和普通远程访问
- SSH 端口转发：更安全
- Tailscale Serve：适合跨网络访问
- Nginx + HTTPS：适合生产环境

---

## 六、Nginx + HTTPS 反向代理

如果你准备用 Nginx 做反代，官方 Docker 指南特别提醒：要先配 `gateway.trustedProxies`，否则可能报：

```text
Proxy headers detected from untrusted address
```

Docker 环境下的官方命令：

```bash
docker exec openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
docker restart openclaw
```

如果 Nginx 和 OpenClaw 不在同一台机器上，就把上面的 `127.0.0.1` 替换成 Nginx 服务器的真实 IP。

---

## 七、Docker Compose 部署

官方项目已经提供了现成的 `docker-compose.yml`。

```bash
# 下载配置文件
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-compose.yml -o docker-compose.yml

# 启动（首次会自动初始化）
docker-compose up -d
```

如果你想手动写，也可以按官方 Docker 指南里的结构来：

```yaml
version: '3.8'
services:
  openclaw:
    image: ghcr.io/1186258278/openclaw-zh:latest
    container_name: openclaw
    ports:
      - "18789:18789"
    volumes:
      - openclaw-data:/root/.openclaw
    environment:
      - OPENCLAW_GATEWAY_TOKEN=your-secure-token
    restart: unless-stopped

volumes:
  openclaw-data:
```

如果你在国内，可以把镜像换成：

```yaml
1186258278/openclaw-zh:latest
```

---

## 八、常用 Docker 命令

部署完成后，这些命令最常用：

```bash
# 查看日志
docker logs -f openclaw

# 停止 / 启动 / 重启
docker stop openclaw
docker start openclaw
docker restart openclaw

# 进入容器
docker exec -it openclaw sh

# 查看 OpenClaw 状态
docker exec openclaw openclaw status

# 在容器里查看帮助
docker exec openclaw openclaw --help
```

如果你修改了网关配置，最常见的操作就是：

```bash
docker restart openclaw
```

---

## 九、更新 Docker 镜像

官方 Docker 指南给出的升级方法就是：拉新镜像、删旧容器、重新启动。

```bash
# 海外: ghcr.io/1186258278/openclaw-zh:latest
# 国内: 1186258278/openclaw-zh:latest
IMAGE=ghcr.io/1186258278/openclaw-zh:latest

# 1. 拉取最新镜像
docker pull $IMAGE

# 2. 停止并删除旧容器
docker stop openclaw && docker rm openclaw

# 3. 用新镜像重新启动
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  $IMAGE \
  openclaw gateway run
```

因为配置保存在 `openclaw-data` 这个数据卷里，所以升级镜像时你的原配置不会丢。

---

## 十、常见错误排查

### 1）容器能启动，但网页打不开

优先检查这几项：

- `docker ps` 里有没有 `openclaw`
- 端口 `18789` 有没有映射出来
- 服务器防火墙或安全组有没有放行 `18789`

可以先执行：

```bash
docker ps
docker logs -f openclaw
```

### 2）远程访问一直连不上

按官方 Docker 指南，优先检查是不是没设置 Token：

```bash
docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN
docker restart openclaw
```

### 3）Nginx 反代后报代理不可信

按官方文档补上：

```bash
docker exec openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
docker restart openclaw
```

---

## 官方来源

- 官方仓库：<https://github.com/1186258278/OpenClawChineseTranslation>
- 官方 Docker 部署指南：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/docs/DOCKER_GUIDE.md>
- 官方 README：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/README.md>

如果后续镜像地址、端口、部署命令有变化，以官方仓库里的最新 Docker 文档为准。
