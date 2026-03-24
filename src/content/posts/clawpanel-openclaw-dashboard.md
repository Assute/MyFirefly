---
title: ClawPanel 使用教程：给 OpenClaw 装上可视化管理面板
published: 2026-03-16T20:18:12+08:00
description: 这是一篇 ClawPanel 使用教程，整理了桌面端安装、Linux Web 部署、Docker 部署以及首次配置 OpenClaw 的完整流程，适合想把 OpenClaw 更顺手地管理起来的人。
image: "https://raw.githubusercontent.com/qingchencloud/clawpanel/main/docs/01.png"
tags: [AI, OpenClaw, 工具]
category: AI
draft: false
pinned: false
sourceLink: "https://github.com/qingchencloud/clawpanel"
---

![ClawPanel 官方界面截图](https://raw.githubusercontent.com/qingchencloud/clawpanel/main/docs/01.png)

如果你已经在用 **OpenClaw**，或者准备开始折腾 OpenClaw，那么 **ClawPanel** 这个工具基本值得直接装上。

它本质上是一个给 OpenClaw 准备的可视化管理面板，可以把很多原本要靠命令行完成的事情，整理成更顺手的界面操作。

这篇不写泛泛介绍，直接按**教程**来整理：

- 怎么安装
- 怎么部署
- 第一次打开后该做什么
- 常见问题怎么处理

## 一、ClawPanel 是什么

简单说，它就是一个 **OpenClaw 的管理面板**。

它能做的事情主要有这些：

- 查看服务状态
- 启动、停止、重启 Gateway
- 配置模型服务商
- 管理 Agent 和记忆文件
- 查看日志
- 做基础诊断和排障
- 在面板里直接聊天和测试

如果你觉得纯命令行管理 OpenClaw 有点碎，那这个面板确实能省不少事。

## 二、先选安装方式

先说结论，不同场景直接选不同方式：

- **Windows / macOS 本地使用**：直接下载桌面版安装包
- **Linux 服务器 / NAS / 无桌面环境**：用 Web 版
- **已经有 Docker 环境**：用 Docker 或 Compose

如果你只是自己电脑上用，我建议优先桌面版。  
如果你要远程管理服务器上的 OpenClaw，我建议直接用 Linux Web 版。

## 三、桌面端安装方法

这一种最简单，适合大多数普通用户。

### 1）打开下载页

下载地址：

- 官网：<https://claw.qt.cool/>
- Releases：<https://github.com/qingchencloud/clawpanel/releases/latest>

根据自己的系统选择安装包：

- **Windows**：优先下载 `exe` 安装器
- **macOS**：按芯片选择 Apple Silicon 或 Intel 版本
- **Linux**：如果你是桌面 Linux，优先看官方发布包；如果是服务器场景，建议直接用后面的 Web 版教程

### 2）安装后直接打开

首次打开时，ClawPanel 会自动带你做基础检查，比如：

- Node.js 是否可用
- Git 是否可用
- OpenClaw 是否已安装
- 当前环境是否能启动 Gateway

### 3）macOS 提示“已损坏”或“无法验证开发者”怎么办

官方给出的处理方式是：

```bash
sudo xattr -rd com.apple.quarantine /Applications/ClawPanel.app
```

如果你还没把应用拖进“应用程序”目录，就先拖进去再执行。

## 四、Linux Web 版部署教程

如果你是云服务器、NAS、HomeLab，或者本来就没有桌面环境，这一套更适合。

### 环境要求

- `Node.js` 18+，推荐 22 LTS
- `npm`
- `Git`
- 已安装的 `OpenClaw`

### 方式一：一键部署

这是官方最省事的方式：

```bash
curl -fsSL https://raw.githubusercontent.com/qingchencloud/clawpanel/main/scripts/linux-deploy.sh | bash
```

这个脚本会自动完成：

1. 检测系统
2. 安装 Node.js（如果缺少）
3. 安装 OpenClaw（如果缺少）
4. 克隆 ClawPanel 仓库
5. 安装依赖
6. 创建服务并启动

部署完成后，直接访问：

```text
http://服务器IP:1420
```

### 方式二：手动部署

如果你想自己掌控每一步，可以按官方文档手动部署。

#### 1）安装 Node.js

Ubuntu / Debian：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

验证：

```bash
node -v
npm -v
```

#### 2）安装 OpenClaw

```bash
npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com
openclaw init
```

#### 3）克隆并安装 ClawPanel

```bash
cd /opt
sudo git clone https://github.com/qingchencloud/clawpanel.git
sudo chown -R $(whoami) clawpanel
cd clawpanel
npm install
```

#### 4）构建并启动 Web 面板

```bash
npm run build
npm run serve
```

默认监听：

```text
0.0.0.0:1420
```

如果你想换端口：

```bash
npm run serve -- --port 8080
```

## 五、Docker 部署教程

如果你机器上已经有 Docker，这种方式也很直接。

### 快速启动

```bash
docker run -d \
  --name clawpanel \
  --restart unless-stopped \
  -p 1420:1420 \
  -v clawpanel-data:/root/.openclaw \
  node:22-slim \
  sh -c "\
    apt-get update && apt-get install -y git && \
    npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com && \
    openclaw init 2>/dev/null || true && \
    git clone https://github.com/qingchencloud/clawpanel.git /app && \
    cd /app && npm install && npm run build && \
    npm run serve"
```

启动后访问：

```text
http://服务器IP:1420
```

### Docker 方式要注意的点

- 数据目录要持久化到 `/root/.openclaw`
- 快速启动适合体验，不太适合长期生产使用
- 如果你准备长期跑，官方更推荐 Compose 或自定义镜像方案
- 如果要让面板去管理 Gateway，Docker 场景下要考虑网络和进程管理方式

## 六、第一次打开后怎么配置

这一步其实最重要。

建议你按下面顺序来：

### 1）先检查环境

先确认面板里这些项目都是正常的：

- Node.js
- Git
- OpenClaw
- Gateway 状态

如果这里有红色报错，先不要急着继续配模型，先把基础环境处理好。

### 2）配置模型服务商

进入模型配置页后，至少先添加一个可用模型。

比如常见的：

- DeepSeek
- OpenAI
- 阿里通义
- Ollama

填好 `Base URL` 和 `API Key` 之后，先做一次连接测试，确认能通再保存。

### 3）启动 Gateway

进入服务管理页面，启动 Gateway。  
如果状态能正常变绿，说明核心服务已经跑起来了。

### 4）去聊天页做一次测试

这一步不要省。

直接去实时聊天页面，发一句简单测试，例如：

```text
你好，请回复一句“连接正常”
```

如果能稳定返回，就说明这套流程已经打通了。

## 七、常见问题

### 1）提示 `openclaw.json` 不存在

说明 OpenClaw 还没有初始化。

执行：

```bash
openclaw init
```

### 2）1420 端口被占用

可以先看是谁占用了端口：

```bash
lsof -i :1420
```

如果不想处理占用，也可以直接换端口：

```bash
npm run serve -- --port 3000
```

### 3）反向代理后页面打不开或聊天不通

这种情况通常是 **WebSocket 没配好**。

如果你用 Nginx 反代，记得加上：

- `Upgrade`
- `Connection "upgrade"`

否则面板和 Gateway 的 WebSocket 通信可能会失败。

### 4）从外网访问不到

重点检查这几项：

- 服务器防火墙
- 云服务器安全组
- 端口 `1420`
- 如果 Gateway 也要外部访问，再看 `18789`

## 八、我更推荐哪种方式

如果你问我怎么选，我会这样建议：

- **本地自己用**：桌面版
- **远程服务器长期跑**：Linux Web 版
- **已经是 Docker 环境**：Docker / Compose

如果你只是想最快体验，桌面版最省事。  
如果你准备长期管理 OpenClaw，Linux Web 版会更像一个长期方案。

## 相关链接

- 官网：<https://claw.qt.cool/>
- 项目地址：<https://github.com/qingchencloud/clawpanel>
- Linux 部署文档：<https://github.com/qingchencloud/clawpanel/blob/main/docs/linux-deploy.md>
- Docker 部署文档：<https://github.com/qingchencloud/clawpanel/blob/main/docs/docker-deploy.md>
- OpenClaw 汉化版项目：<https://github.com/1186258278/OpenClawChineseTranslation>
