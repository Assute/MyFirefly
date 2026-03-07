---
title: OpenClaw 汉化版 npm 安装、卸载与升级教程
published: 2026-03-07T15:45:00+08:00
description: 基于 OpenClawChineseTranslation 官方 README 和安装指南整理的一篇 npm 教程，涵盖安装、初始化、启动、重启、卸载和升级。
image: "https://raw.githubusercontent.com/1186258278/OpenClawChineseTranslation/main/docs/image/5.png"
tags: [AI, 教程, OpenClaw]
category: AI
draft: false
pinned: true
sourceLink: "https://github.com/1186258278/OpenClawChineseTranslation"
---

![OpenClaw 汉化版官方截图](https://raw.githubusercontent.com/1186258278/OpenClawChineseTranslation/main/docs/image/5.png)

## 一、安装 Node.js

根据官方安装指南，`OpenClaw` 要求：

```text
Node.js >= 22.12.0
```

如果你还没有安装 Node.js，可以按你的系统选择下面一种方式。

### Ubuntu / Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### CentOS / RHEL

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

### 通用 nvm 方式

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 22
nvm use 22
```

### 安装完成后检查版本

```bash
node -v
npm -v
```

如果版本满足要求，就可以继续下一步。

---

## 二、安装 OpenClaw 汉化版

官方 npm 安装命令：

```bash
npm install -g @qingchencloud/openclaw-zh@latest
```

如果你在国内下载慢，可以直接使用官方文档里的镜像源：

```bash
npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com
```

安装完成后，先检查是否安装成功：

```bash
openclaw --version
openclaw --help
```

如果这里提示：

```text
openclaw: command not found
```

按官方安装指南处理：

```bash
npm prefix -g
export PATH="$(npm prefix -g)/bin:$PATH"
```

然后把这个路径写进你的 `~/.bashrc` 或 `~/.zshrc`。

---

## 三、初始化配置

### 方式一：交互式向导

第一次使用，最推荐直接运行：

```bash
openclaw onboard --install-daemon
```

这个命令会带你完成初始化流程，包括：

- 确认安全风险
- 选择 AI 模型提供商
- 输入 API Key
- 选择默认模型
- 配置网关
- 配置聊天通道
- 安装技能

如果你只想跑基础向导，也可以用：

```bash
openclaw onboard
```

### 方式二：手动设置

如果你已经知道自己要用什么模型，也可以直接按官方安装指南手动设置：

```bash
openclaw setup
openclaw config set gateway.mode local
openclaw config set agents.defaults.model anthropic/claude-sonnet-4-20250514
openclaw config set auth.anthropic.apiKey sk-ant-你的API密钥
openclaw config set gateway.auth.token 你设定的密码
```

---

## 四、启动 OpenClaw

### 前台运行

如果你想先调试，直接运行：

```bash
openclaw
```

这种方式会把日志直接输出在当前终端里，按 `Ctrl + C` 就会停止。

### 启动网关

按官方 README 的方式，也可以直接启动网关：

```bash
openclaw gateway
```

如果你在初始化时用过：

```bash
openclaw onboard --install-daemon
```

那后续更推荐使用下面这些网关管理命令。

---

## 五、打开 Dashboard 控制台

官方命令：

```bash
openclaw dashboard
```

如果浏览器没有自动打开，手动访问：

```text
http://localhost:18789
```

如果你第一次打开后页面不是中文，到 **Overview** 页面底部，把 **Language** 切换成 **简体中文（Simplified Chinese）**，然后刷新页面即可。

---

## 六、查看状态和诊断问题

官方常用命令：

```bash
openclaw status
openclaw doctor
```

- `openclaw status`：查看当前运行状态
- `openclaw doctor`：自动诊断常见问题

如果你改了配置，最常用的操作就是重启。

---

## 七、重启命令

```bash
# 推荐
openclaw gateway restart

# 先停再起
openclaw gateway stop
openclaw gateway start
```

如果你已经安装了守护进程，也可以用：

```bash
openclaw daemon start
openclaw daemon stop
openclaw daemon restart
openclaw daemon status
```

---

## 八、常用命令速查

```bash
openclaw                    # 启动 OpenClaw
openclaw onboard            # 初始化向导
openclaw dashboard          # 打开网页控制台
openclaw config             # 查看/修改配置
openclaw skills             # 管理技能
openclaw --help             # 查看帮助

openclaw gateway            # 启动网关
openclaw gateway run        # 前台运行（调试）
openclaw gateway start      # 后台守护进程
openclaw gateway stop       # 停止网关
openclaw gateway restart    # 重启网关
openclaw gateway status     # 查看网关状态
openclaw gateway install    # 安装为系统服务

openclaw update             # 检查并更新 CLI
openclaw doctor             # 自动诊断问题
```

> 官方 README 提醒：如果 Windows 下 `gateway install` 失败，比如提示 `schtasks` 不可用，可以先改用 `openclaw gateway start`。

---

## 九、卸载教程

### 卸载 CLI

```bash
npm uninstall -g @qingchencloud/openclaw-zh
```

如果你之前装过原版，官方 README 还给了这一条：

```bash
npm uninstall -g openclaw
```

### 删除本地配置（可选）

> 注意：这一步会删除你的本地配置，不可恢复。

```bash
rm -rf ~/.openclaw
```

### 卸载守护进程

**macOS**

```bash
launchctl unload ~/Library/LaunchAgents/com.openclaw.plist
rm ~/Library/LaunchAgents/com.openclaw.plist
```

**Linux（systemd）**

```bash
sudo systemctl stop openclaw
sudo systemctl disable openclaw
sudo rm /etc/systemd/system/openclaw.service
sudo systemctl daemon-reload
```

---

## 十、更新升级命令

### 升级稳定版

官方 README 给出的升级命令：

```bash
npm update -g @qingchencloud/openclaw-zh
```

升级后检查版本：

```bash
openclaw --version
```

### 切换到 nightly 版本

如果你想体验更快同步上游的新版本，可以用：

```bash
npm install -g @qingchencloud/openclaw-zh@nightly
```

### 用 CLI 检查更新

```bash
openclaw update
```

---

## 官方来源

- 官方仓库：<https://github.com/1186258278/OpenClawChineseTranslation>
- 官方安装指南：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/docs/INSTALL_GUIDE.md>
- 官方 README：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/README.md>

如果后续命令有变化，以官方仓库里的最新文档为准。