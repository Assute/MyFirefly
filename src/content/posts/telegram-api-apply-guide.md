---
title: Telegram API 申请教程（图文）
published: 2026-03-23T21:07:21+08:00
description: 这篇文章记录如何通过家宽代理登录 Telegram 官方申请页面，提交应用资料并获取自己的 App api_id 和 App api_hash。
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

进入页面后，直接使用你自己的 Telegram 账号登录。

登录完成后，就会进入应用申请页面。

## 三、填写资料并提交

进入申请页面后，资料可以按正常格式直接填写，提交即可，不需要写得太复杂。

你可以按自己的用途简单写一个应用名称和说明，能正常提交就行。

下面这张图就是填写资料的页面示例：

![Telegram API 申请资料填写示例](https://pic.sl.al/gdrive/pic/2026-03-23/fileid_1IrqHgbd-exTZwzr5tJ5KAlSIydUz26UP_PixPin_2026-03-23_20-20-09.png)

提交完成后，系统会直接生成你的应用信息。

## 四、保存 App api_id 和 App api_hash

申请成功后，页面会显示：

- `App api_id`
- `App api_hash`

这两个参数后面接 Telegram 相关程序、面板、脚本时都会用到，所以**一定要马上保存好**。

下面这张图就是申请成功后的页面示例：

![Telegram API 申请成功示例](https://pic.sl.al/gdrive/pic/2026-03-23/fileid_15TsWZJyIOrw3Gd8kH3AjoFDJhheK7Zdg_PixPin_2026-03-23_21-00-26.png)

建议你把这两个值保存到：

- 本地记事本
- 密码管理器
- 自己的配置文件

只要后面要接入 Telegram API，基本都离不开这两个参数。

## 五、注意事项

最后再提醒几个重点：

- 第一优先级就是**家宽代理**
- 提交成功后立刻保存 `api_id` 和 `api_hash`
- 不要把自己的 `api_hash` 随便公开发出去
- 如果申请失败，先换代理环境再试
