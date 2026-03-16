---
title: 企业微信自建应用通知教程：把应用管理做成消息渠道
published: 2026-03-16T21:27:17+08:00
description: 这是一篇企业微信自建应用通知教程，整理了应用管理、自建应用创建、CorpID 和 AgentID 获取、access_token 获取、发送应用消息以及常见踩坑点。
image: "https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1Yr5c31SoYBX9GEVh8WLam1QKZSnfn3ng_image.png"
tags: [企业微信, 通知, 教程]
category: 脚本
draft: false
sourceLink: "https://work.weixin.qq.com/api/doc/90000/90135/90236"
---

最近在整理通知渠道的时候，顺手把 **企业微信自建应用** 这条路也捋了一遍。

如果你的目标是：

- 做一个系统通知渠道
- 让程序把告警、状态、结果推送到企业微信
- 不想走个人微信那种不稳定方案

那最稳的一条路线，其实就是：

**企业微信管理后台 → 应用管理 → 自建应用 → 用应用消息做通知。**

这篇就按这个方向来写，尽量直白一点，直接说怎么配、怎么发。

## 首页图片

![企业微信自建应用通知教程首页图](https://pic.sl.al/gdrive/pic/2026-03-16/fileid_1Yr5c31SoYBX9GEVh8WLam1QKZSnfn3ng_image.png)

## 一、先说它适合做什么

企业微信自建应用，最适合拿来做这类通知：

- 服务器运行结果通知
- 定时任务成功 / 失败提醒
- 域名、证书、监控告警
- 面板后台消息推送
- 订单、工单、审批类内部通知

它的好处是比较稳定，因为本质上走的是**企业微信官方应用消息接口**，不是靠网页硬跳某个个人号。

## 二、后台入口在哪里

先登录企业微信管理后台：

- 企业微信后台：<https://work.weixin.qq.com/>

然后按下面路径进入：

```text
应用管理 → 自建 → 创建应用
```

创建时一般会让你填写：

- 应用名称
- 应用 Logo
- 可见范围

这里有一个很关键的点：

**你后面要接收通知的人，必须在这个应用的可见范围里。**

否则程序消息是发不进去的。

## 三、创建完以后要记住哪几个值

创建好自建应用后，后面最常用的是这 3 个：

- `CorpID`：企业 ID
- `AgentID`：应用 ID
- `Secret`：这个自建应用自己的密钥

这 3 个里最容易拿错的是 `Secret`。

注意：

- 不是随便拿一个企业级密钥
- 不是通讯录同步 secret
- 必须是**这个自建应用自己的 Secret**

## 四、接收通知的人怎么确定

程序发消息时，通常还需要一个接收人标识，也就是：

- `UserID`

这里不要直接写成员姓名。

要用的是企业微信成员对应的 `UserID`。  
如果你不确定，可以在通讯录里查看成员详情，或者通过接口读取成员信息。

官方成员读取文档：

- 读取成员：<https://work.weixin.qq.com/api/doc/90000/90135/90196>

## 五、程序发送通知的基本流程

整个流程其实很简单，就两步：

### 第一步：获取 `access_token`

官方文档：

- 获取 `access_token`：<https://work.weixin.qq.com/api/doc/90000/90135/91039>

请求地址：

```text
GET https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=你的CorpID&corpsecret=你的Secret
```

拿到成功响应后，会返回一个 `access_token`。

### 第二步：发送应用消息

官方文档：

- 发送应用消息：<https://work.weixin.qq.com/api/doc/90000/90135/90236>

请求地址：

```text
POST https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN
```

最简单的文本消息体可以写成这样：

```json
{
  "touser": "zhangsan",
  "msgtype": "text",
  "agentid": 1000002,
  "text": {
    "content": "这是一条测试通知"
  },
  "safe": 0
}
```

## 六、用 `curl` 测试一遍

如果你想最快确认通不通，先直接用 `curl`。

### 1）获取 token

```bash
curl "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=你的CorpID&corpsecret=你的Secret"
```

正常会返回类似：

```json
{
  "errcode": 0,
  "errmsg": "ok",
  "access_token": "xxxxx",
  "expires_in": 7200
}
```

### 2）发送测试消息

```bash
curl -X POST "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=你的ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "touser": "zhangsan",
    "msgtype": "text",
    "agentid": 1000002,
    "text": {
      "content": "企业微信通知测试成功"
    },
    "safe": 0
  }'
```

如果返回：

```json
{
  "errcode": 0,
  "errmsg": "ok"
}
```

那就说明这条通知链路已经通了。

## 七、Node.js 示例

如果你是自己写后台，下面这个 Node.js 示例基本就够用了。

```js
const axios = require("axios");

async function sendWecomText() {
  const corpId = "你的CorpID";
  const secret = "你的Secret";
  const agentId = 1000002;
  const toUser = "zhangsan";

  const tokenResp = await axios.get(
    "https://qyapi.weixin.qq.com/cgi-bin/gettoken",
    {
      params: {
        corpid: corpId,
        corpsecret: secret,
      },
    }
  );

  const accessToken = tokenResp.data.access_token;

  const sendResp = await axios.post(
    `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`,
    {
      touser: toUser,
      msgtype: "text",
      agentid: agentId,
      text: {
        content: "这是一条来自自建应用的通知",
      },
      safe: 0,
    }
  );

  console.log(sendResp.data);
}

sendWecomText().catch(console.error);
```

## 八、做成“通知渠道”时怎么理解

如果你是在做自己的项目后台，其实可以把企业微信自建应用理解成一个标准通知渠道：

- 配置区保存 `CorpID`
- 配置区保存 `AgentID`
- 配置区保存 `Secret`
- 配置区保存默认接收人 `UserID`
- 发送通知时先获取 token，再发消息

也就是说，它和邮箱通知、Telegram Bot 通知、本质上是同一类东西：

**都是你系统里的一个消息出口。**

## 九、最容易踩坑的地方

这里我把最常见的问题直接列出来。

### 1）接收人不在应用可见范围里

这是最常见的。

应用虽然创建好了，但如果成员不在这个自建应用的可见范围里，消息就是发不过去。

### 2）把姓名当成 `UserID`

发送消息时，`touser` 用的是 `UserID`，不是成员姓名，也不是昵称。

### 3）`Secret` 拿错

一定要用**自建应用自己的 Secret**。

### 4）接口通了，但人没看到通知

先确认：

- 成员是否已经加入企业
- 成员是否在应用可见范围
- 应用是否正常启用
- 发的是企业微信应用消息，不是普通微信个人消息

### 5）想发到“普通微信”里

这里要分清楚：

- 这篇教程做的是**企业微信应用通知**
- 不是直接给普通微信个人号发消息

如果成员已经绑定微信，并开启企业微信相关接收方式，有些场景会在微信插件里收到；  
但这条教程本身的目标，仍然是：**把企业微信作为通知渠道。**

## 十、适合接到哪些项目里

如果你手里有这些项目，都很适合直接接企业微信通知：

- 面板项目
- 域名监控
- 备份脚本
- 定时抓取任务
- Docker 容器巡检
- 证书到期提醒

尤其是内部项目、自己团队用的项目，这种方式会比个人微信方案稳定很多。

## 官方参考

- 企业微信后台：<https://work.weixin.qq.com/>
- 企业微信开发者中心：<https://developer.work.weixin.qq.com/document>
- 获取 `access_token`：<https://work.weixin.qq.com/api/doc/90000/90135/91039>
- 发送应用消息：<https://work.weixin.qq.com/api/doc/90000/90135/90236>
- 读取成员：<https://work.weixin.qq.com/api/doc/90000/90135/90196>
