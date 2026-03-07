---
title: Apple ID 共享平台：基于 Node.js 的实时抓取与展示
published: 2026-03-07T01:07:45+08:00
description: 这是一个 Apple ID 共享平台项目，使用 Node.js + Express + Axios + Cheerio 实时抓取并展示账号信息，支持地区过滤与广告配置。
image: "https://pic.sl.al/gdrive/pic/2026-03-06/fileid_1pb6_Lhzq-D2JpI1Eu64tDCu87HELP8Iu_image.png"
tags: [网站]
category: 脚本
draft: false
sourceLink: "https://github.com/Assute/Apple_id"
---

最近把这个项目重新整理了一下，它不是通用信息面板，而是一个更明确的场景：**Apple ID 共享平台**。

核心目标就是一件事：
**访问页面时实时抓取最新账号数据，然后直接在页面展示。**

## 页面效果

![Apple ID 共享平台页面效果图](https://pic.sl.al/gdrive/pic/2026-03-06/fileid_1pb6_Lhzq-D2JpI1Eu64tDCu87HELP8Iu_image.png)

## 这个项目具体做什么？

它主要完成下面几步：

1. 从源站拉取最新页面内容
2. 解析出账号、密码、地区、状态、检测时间
3. 过滤不需要的地区（如中国大陆、香港、台湾）
4. 将数据直接嵌入 HTML 返回给前端
5. 前端直接渲染，无需额外再请求 API

这套方式的好处是：页面每次刷新都尽量是最新数据，结构也比较简单直接。

## 主要功能

- **实时抓取**：每次访问首页时都会重新抓取数据
- **账号解析**：自动提取邮箱、密码、地区、状态、时间
- **地区过滤**：自动排除指定地区的数据
- **数据脱敏展示**：邮箱在前端展示时做了脱敏处理
- **广告可配置**：通过 `config.json` 管理多个广告卡片
- **直接嵌入数据**：数据在服务端注入到 HTML 中，前端可直接读取

## 技术栈

- **Node.js + Express**：服务端与路由
- **Axios**：请求源站页面
- **Cheerio**：解析 HTML 并提取字段
- **原生 HTML/CSS/JS**：页面展示与交互

## 项目结构

```text
Apple_id/
├─ index.js
├─ index.html
├─ config.json
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
└─ README.md
```

## 运行方式

### 本地运行

```bash
npm install
node index.js
```

默认访问：

```text
http://localhost:8000
```

### Docker 运行

```bash
docker build -t apple-id .
docker run -d -p 8000:8000 --name apple-id apple-id
```

或：

```bash
docker-compose up -d
```

## 适合场景

- 需要把网页账号信息做统一展示
- 想要轻量、可快速部署的共享页
- 希望用最少依赖完成抓取 + 展示闭环

## 项目地址

- GitHub：<https://github.com/Assute/Apple_id>

如果你也是做这类轻量共享页，这种“实时抓取 + 服务端注入 + 前端直读”的写法会比较省事。