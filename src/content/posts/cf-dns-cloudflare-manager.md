---
title: CF-dns：Cloudflare DNS 多域名管理面板
published: 2026-03-16T21:05:23+08:00
description: 这是一个 Cloudflare DNS 多域名管理面板，支持批量管理 DNS 记录、一键申请 Origin 证书、域名排序、手机端适配和 Docker 一键部署。
image: "https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1cZpksd8OwcAzj9yPbNyzx8ns8HqZiGY6_%E9%A6%96%E9%A1%B5.png"
tags: [Cloudflare, DNS, 工具]
category: 脚本
draft: false
sourceLink: "https://github.com/Assute/CF-dns"
---

最近整理了一个自己在用的项目：**CF-dns**。

它不是单纯查 DNS 记录的小工具，而是一个更偏实用方向的 **Cloudflare DNS 多域名管理面板**。  
核心目标很直接：**把 Cloudflare 域名、DNS 记录和证书管理这几件高频操作，集中到一个界面里完成。**

## 页面效果

### 登录界面

![CF-dns 登录界面](https://pic.sl.al/gdrive/pic/2026-03-16/fileid_17QAg5JWDyNjWINvx696MnYLofZ0VfG_L_%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.png)

### 首页

![CF-dns 首页](https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1cZpksd8OwcAzj9yPbNyzx8ns8HqZiGY6_%E9%A6%96%E9%A1%B5.png)

### 添加域名

![CF-dns 添加域名](https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1b9N5uNlfnsGw_GLtL7bgJLGn6aAnz6ff_%E6%B7%BB%E5%8A%A0%E5%9F%9F%E5%90%8D.png)

### 域名管理

![CF-dns 域名管理](https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1KVRy66nGjVdmbRuOUrDRji7BAlS-tzJD_%E5%9F%9F%E5%90%8D%E7%AE%A1%E7%90%86.png)

## 这个项目具体做什么？

CF-dns 主要解决的是 Cloudflare 多域名管理时比较碎、比较重复的问题。

平时最常见的几类操作基本都集中到了面板里：

- 添加并管理多个 Cloudflare 域名
- 查看、添加、编辑、删除 DNS 记录
- 批量修改解析记录的 IP 和代理状态
- 批量删除无用记录
- 一键申请和撤销 Cloudflare Origin 证书
- 下载证书和私钥文件
- 支持拖拽排序域名

如果域名一多，纯靠 Cloudflare 后台一个个点，效率其实挺低。  
这个项目做的事情，就是把这些操作整理成一个更直接的管理界面。

## 主要功能

- **多域名管理**：支持同时管理多个 Cloudflare 域名
- **Token 校验**：添加域名时会直接校验 Token 和 Zone 信息
- **DNS 记录管理**：支持 A、AAAA、CNAME、TXT 等常见记录类型
- **批量操作**：支持批量修改、批量删除、批量证书操作
- **证书管理**：一键申请 Origin Certificate，并支持下载 PEM / KEY
- **登录认证**：带独立登录页，支持修改用户名和密码
- **域名排序**：支持拖拽调整域名顺序
- **移动端适配**：手机和平板也能正常使用

## 技术栈

这个项目整体比较直接，没有走很重的前端框架路线，而是偏实用型组合：

- **Node.js + Express**：服务端和接口路由
- **express-session**：登录态和会话管理
- **Axios**：请求 Cloudflare API
- **node-forge**：生成私钥、CSR 和证书相关内容
- **原生 JavaScript + CSS**：前端界面
- **Docker / Docker Compose**：部署方式

## 运行方式

### 一键安装

国内服务器：

```bash
bash <(curl -fsSL https://gitee.com/Assute/CF-dns/raw/master/install.sh)
```

国外服务器：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Assute/CF-dns/main/install.sh)
```

安装完成后访问：

```text
http://你的服务器IP:3600
```

默认登录信息：

```text
用户名：admin
密码：admin123
```

第一次登录后建议立即修改密码。

## 使用前准备

在添加域名前，需要先准备好 Cloudflare API Token。

这个项目用到的核心权限主要是：

- `Zone - DNS - Edit`
- `Zone - SSL and Certificates - Edit`

面板里本身已经做了教程入口，登录后可以直接查看图文说明。

## 服务管理常用命令

如果是默认方式安装，常用命令基本就是下面这些：

```bash
# 查看日志
docker-compose -f /opt/CF-dns/docker-compose.yml logs -f

# 重启服务
docker-compose -f /opt/CF-dns/docker-compose.yml restart

# 停止服务
docker-compose -f /opt/CF-dns/docker-compose.yml down

# 查看容器状态
docker ps | grep cf-cdn-manager
```

如果你想彻底卸载：

```bash
docker-compose -f /opt/CF-dns/docker-compose.yml down
sudo rm -rf /opt/CF-dns
```

## 这个项目的几个实际价值

我自己做它，主要不是为了“做一个好看后台”，而是因为 Cloudflare 相关操作确实容易碎。

尤其是下面这些场景，会明显更省事：

- 手里有多个域名，需要频繁切换管理
- 经常改解析记录和代理开关
- 要批量申请证书
- 想在手机上也能随时处理域名解析

这些事情如果都回到 Cloudflare 原站后台去做，能做是能做，但不够顺手。  
CF-dns 更像是把这些高频动作重新收成了一个更适合自己使用习惯的面板。

## 项目结构

```text
CF-dns/
├─ public/
│  ├─ login.html
│  ├─ index.html
│  ├─ tutorial.html
│  ├─ app.js
│  └─ styles.css
├─ data/
├─ server.js
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
├─ install.sh
└─ README.md
```

## 总结

如果你本身就在用 Cloudflare，而且手里不止一个域名，那这种管理面板会比原始后台更适合日常高频操作。

CF-dns 现在的方向也很明确：

- 用简单直接的方式管理 Cloudflare 域名
- 保留一键安装能力
- 用最少的依赖完成核心功能
- 让桌面端和手机端都能正常使用

后面如果还继续补功能，我大概率也还是会围绕这条路线走：  
**多域名、高频操作、部署简单、界面直给。**

## 仓库地址

- GitHub：<https://github.com/Assute/CF-dns>
- Gitee：<https://gitee.com/Assute/CF-dns>
