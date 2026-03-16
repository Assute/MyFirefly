---
title: OpenClaw 汉化版 npm 安装、卸载与升级教程
published: 2026-03-07T15:45:00+08:00
description: 基于 OpenClawChineseTranslation 官方 README 和安装指南整理的一篇详细图文教程，涵盖安装、初始化、Telegram 机器人配置、中文用户名问题修复、启动、重启、卸载和升级。
image: "https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1KaZ53YaT5E8Z3Ham7BkQkEjkmgJxJ2b8_%E5%88%9D%E5%A7%8B%E5%8C%96.png"
tags: [AI, 教程, OpenClaw, 图文教程]
category: AI
draft: false
pinned: false
sourceLink: "https://github.com/1186258278/OpenClawChineseTranslation"
---

![OpenClaw 汉化版官方截图](https://raw.githubusercontent.com/1186258278/OpenClawChineseTranslation/main/docs/image/5.png)

## 一、安装 Node.js

根据官方安装指南，`OpenClaw` 要求：

```text
Node.js >= 22.12.0
```

如果你还没有安装 Node.js，可以按你的系统选择下面一种方式。

### Windows

访问 [Node.js 官网下载页面](https://nodejs.org/zh-cn/download) 下载 LTS 版本安装包并安装。

![Node.js下载](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1ZwFYqdJGBI36tKozh3n7HQfzUKyTlHKv_image.png)

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

### 安装完成后检查版本

```bash
node -v
npm -v
```

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

![npm安装](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1qT29nHHnApuS1C9w7gsnOUAL0aXOO2bQ_npm%E5%AE%89%E8%A3%85.png)

---

## 三、初始化配置（图文详解）

运行初始化命令：

```bash
openclaw onboard --install-daemon
```

按照界面提示依次完成以下步骤：

**初始化配置选择 yes**

![初始化配置选择yes](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1KaZ53YaT5E8Z3Ham7BkQkEjkmgJxJ2b8_%E5%88%9D%E5%A7%8B%E5%8C%96.png)

**选择快速开始**

![选择快速开始](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1tKVfo9oPBi9D9lw8xjfq8-b_5zgk18PW_%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B.png)

**选择模型提供商（自建选择自定义）**

![选择模型提供商](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1H_za-Dv1Q-jSsOmWt0EYgDr4G37vN5ii_%E6%A8%A1%E5%9E%8B%E6%8F%90%E4%BE%9B%E5%95%86.png)

**输入 URL、选择密钥、输入令牌回车**

![输入URL、选择密钥、输入令牌](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1hC59lj2hzVG7pmpRrOdHzV8k0V0ELpcp_%E5%A1%AB%E5%86%99.png)

**再回车，输入模型名称（如 gpt-5.4）回车**

![输入模型名称](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_101pKwXyG75G7IqQ5tH9eG9blkN2J_sZ3_%E6%A8%A1%E5%9E%8B%E5%90%8D%E7%A7%B0.png)

**直接回车两次**

![直接回车两次](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_11SeWyYDNii9y1tA8V-oY8MSpdKwOVDU1_%E5%9B%9E%E8%BD%A62.png)

---

## 四、配置 Telegram 机器人（可选）

如果想通过 Telegram 使用 OpenClaw，需要先创建机器人。

**选择渠道（以 Telegram 为例）**

![选择渠道](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1BSnlp8EsxHM6Vawf-Wy9SaGKBXOsQKsy_%E6%B8%A0%E9%81%93.png)

**在 Telegram 中搜索 @BotFather**

![搜索BotFather](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1_2XCW7xPhOyqBduKp4lJm-jmYWoAdTPt_%E6%90%9C%E7%B4%A2.png)

**对话输入 /newbot，输入机器人名称，再输入机器人用户名，得到 token**

![创建机器人](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_14kjpayko-N3Mh8lr1JIImhQ7OKCx-Axc_%E5%88%9B%E5%BB%BA.png)

**回到电脑终端，输入 Telegram 机器人的 token**

![输入token](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1JZnPzTjhyB8vbo9khhd_j9DXSHRwJAxp_token.png)

---

## 五、完成配置

**技能先不配置，选择 no**

![技能配置](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1WV85l6Wl8Hq4V2UUBDPZje0yO86RdJT2_%E6%8A%80%E8%83%BD.png)

**Hooks 全部点击空格勾选，然后回车**

![启用Hooks](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1PYiQz5UIKy10btkbK2HH2sJz8oYuBpkF_Hooks.png)

**安装成功**

![安装成功](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1ozp2jQ-NyUOAA7H-u_fg2XEZZjCQXLxj_%E6%88%90%E5%8A%9F.png)

---

## 六、启动与访问

**启动 OpenClaw**

```bash
openclaw gateway
```

![启动Openclaw](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1FLG6s_d1GDDH41V7Dv8dPBX9PhsddY-Q_%E5%90%AF%E5%8A%A8.png)

**打开 Dashboard 控制台**

```bash
openclaw dashboard
```

或手动访问 `http://localhost:18789`

![Web界面](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_17yJUPqLfnB2p4giGS-dsDp-T7HF1FExa_Web.png)

---

## 七、修复无法打开浏览器问题

如果 OpenClaw 无法打开浏览器，需要修改配置文件。

**找到配置文件**

路径：`C:\Users\用户名\.openclaw\openclaw.json`

**修改 profile 为 full**

找到 `tools` 部分，将 `profile` 改为 `full`：

```json
"tools": {
    "profile": "full",
    "web": {
      "search": {
        "enabled": true
      },
      "fetch": {
        "enabled": true
      }
    }
  },
```

![修复配置](https://pic.sl.al/gdrive/pic/2026-03-08/fileid_1GVo_TDqCxWQIbYVqOkasN9QlQWwE3VoN_%E4%BF%AE%E5%A4%8D.png)

修改完成后重启 OpenClaw 服务即可。

---

## 八、常用管理命令

```bash
# 查看状态和诊断
openclaw status
openclaw doctor

# 重启服务
openclaw gateway restart

# 守护进程管理
openclaw daemon start
openclaw daemon stop
openclaw daemon restart
openclaw daemon status

# 其他常用命令
openclaw dashboard          # 打开网页控制台
openclaw config             # 查看/修改配置
openclaw skills             # 管理技能
openclaw --help             # 查看帮助
```

---

## 九、卸载教程

卸载 CLI：

```bash
npm uninstall -g @qingchencloud/openclaw-zh
```

删除配置（可选，不可恢复）：

```bash
rm -rf ~/.openclaw
```

卸载守护进程：

**macOS**
```bash
launchctl unload ~/Library/LaunchAgents/com.openclaw.plist
rm ~/Library/LaunchAgents/com.openclaw.plist
```

**Linux**
```bash
sudo systemctl stop openclaw
sudo systemctl disable openclaw
sudo rm /etc/systemd/system/openclaw.service
sudo systemctl daemon-reload
```

---

## 十、更新升级

升级到最新版：

```bash
npm update -g @qingchencloud/openclaw-zh
```

或使用 CLI 检查更新：

```bash
openclaw update
```

---

## 官方来源

- 官方仓库：<https://github.com/1186258278/OpenClawChineseTranslation>
- 官方安装指南：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/docs/INSTALL_GUIDE.md>
- 官方 README：<https://github.com/1186258278/OpenClawChineseTranslation/blob/main/README.md>

如果后续命令有变化，以官方仓库里的最新文档为准。
