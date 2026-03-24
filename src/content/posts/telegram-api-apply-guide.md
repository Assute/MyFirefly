---
title: Telegram API 申请与部署教程（图文）
published: 2026-03-23T21:07:21+08:00
description: 这篇文章记录如何通过家宽代理申请 Telegram API，并在申请成功后使用 Docker 部署本地 TGAPI，方便后续面板和机器人接入。
image: "https://pic.sl.al/gdrive/pic/2026-03-23/fileid_1IrqHgbd-exTZwzr5tJ5KAlSIydUz26UP_PixPin_2026-03-23_20-20-09.png"
tags: [Telegram, API, 教程]
category: AI
draft: false
pinned: false
sourceLink: "https://my.telegram.org/apps"
---

最近在接 Telegram 相关工具时，第一步就是先申请自己的 `api_id` 和 `api_hash`。  
这个流程本身不复杂，但有一个重点一定要先记住：**先准备家宽代理，不然很容易申请不成功。**

## 一、先准备家宽代理

申请 `Telegram API` 之前，先找一个可用的**家宽代理**。

这一点很关键：

- 一定要用家宽代理
- 不要直接用普通机房代理去申请
- 如果一直提交失败，先优先检查代理环境

简单来说，先把代理准备好，再去登录官方页面申请，成功率会高很多。

## 二、打开申请页面并登录

打开 Telegram 官方申请地址：

<https://my.telegram.org/apps>

进入页面后，直接使用 Telegram 账号登录。

登录完成后，就会进入应用申请页面。

## 三、填写资料并提交

进入申请页面后，资料可以按正常格式直接填写，提交即可，不需要写得太复杂。

可按实际用途简单填写应用名称和说明，能正常提交即可。

下面这张图就是填写资料的页面示例：

![Telegram API 申请资料填写示例](https://pic.sl.al/gdrive/pic/2026-03-23/fileid_1IrqHgbd-exTZwzr5tJ5KAlSIydUz26UP_PixPin_2026-03-23_20-20-09.png)

提交完成后，系统会直接生成应用信息。

## 四、保存 App api_id 和 App api_hash

申请成功后，页面会显示：

- `App api_id`
- `App api_hash`

这两个参数后面接 Telegram 相关程序、面板、脚本时都会用到，所以**一定要马上保存好**。

下面这张图就是申请成功后的页面示例：

![Telegram API 申请成功示例](https://pic.sl.al/gdrive/pic/2026-03-23/fileid_15TsWZJyIOrw3Gd8kH3AjoFDJhheK7Zdg_PixPin_2026-03-23_21-00-26.png)

建议把这两个值保存到：

- 本地记事本
- 密码管理器
- 自己的配置文件

只要后面要接入 Telegram API，基本都离不开这两个参数。

## 五、Docker 一键部署 TGAPI

申请到 `App api_id` 和 `App api_hash` 之后，就可以直接开始部署 `TGAPI`。

先执行下面这条命令：

```bash
mkdir -p ~/telegram-bot-api/data && docker run -d \
  --name telegram-bot-api \
  --restart always \
  -p 8081:8081 \
  -e TELEGRAM_API_ID=申请得到的api_id \
  -e TELEGRAM_API_HASH=申请得到的api_hash \
  -e TELEGRAM_LOCAL=1 \
  -v ~/telegram-bot-api/data:/var/lib/telegram-bot-api \
  aiogram/telegram-bot-api:latest
```

只需把下面两项换成申请得到的值：

- `TELEGRAM_API_ID=申请得到的api_id`
- `TELEGRAM_API_HASH=申请得到的api_hash`

如果想确认有没有正常跑起来，可以执行：

```bash
docker ps
```

## 六、部署完成后怎么用

部署成功后，`TGAPI` 地址一般就是：

```text
http://服务器IP:8081
```

## 七、注意事项

最后再提醒几个重点：

- 第一优先级就是**家宽代理**
- 提交成功后立刻保存 `api_id` 和 `api_hash`
- 不要把自己的 `api_hash` 随便公开发出去
- 部署命令里的 `api_id` 和 `api_hash` 一定要换成申请得到的值
- 部署完成后，面板里要记得填写 `TGAPI` / `Local Bot API`
- 如果申请失败，先换代理环境再试
