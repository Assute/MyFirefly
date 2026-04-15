---
title: Twitter Bot V2 部署与使用教程
published: 2026-03-24T22:51:58+08:00
description: 这篇文章记录如何配置 Twitter Bot V2 的 BOT_TOKEN，通过 Docker 或 Python 启动项目，进入后台设置套餐、支付接口和 TGAPI，并完成群组、用户、Cookie、全量同步与定时更新配置。
image: "https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1XceZpvXvNAJO1R9oraAOfn_nvx88aJlY_PixPin_2026-03-24_22-14-14.png"
tags: [Telegram, X, Twitter, 教程]
category: GitHub
draft: false
pinned: false
sourceLink: "https://github.com/Assute/Twitter-Bot-V2"
---

这篇直接按实际部署流程整理。  
按下面步骤操作，即可完成 `Twitter Bot V2` 部署，并把 `X` 的推文同步到 `Telegram` 群组。

## 一、先修改配置文件

先打开项目里的配置文件：

```python
config/settings.py
```

先把这里改掉：

```python
# Telegram Bot Token
BOT_TOKEN =
```

改成实际使用的机器人 `Token`，例如：

```python
# Telegram Bot Token
BOT_TOKEN = "机器人Token"
```

这个 `BOT_TOKEN` 是机器人启动的基础，不改的话项目没法正常跑起来。

## 二、启动项目

启动方式有两种，任选一种即可。

### 方式一：Docker 一键部署

在项目目录执行：

```bash
docker compose up -d
```

如果是第一次启动，或者改了镜像内容，也可以用：

```bash
docker compose up -d --build
```

### 方式二：安装依赖后用 Python 启动

先安装依赖：

```bash
pip install -r requirements.txt
```

然后启动：

```bash
python run.py
```

这个命令会一起启动：

- Telegram 机器人
- 后台管理页面

## 三、打开 Telegram 机器人

项目启动后，先打开 Telegram 机器人。

机器人启动后，可以先获取主菜单，后面的所有操作基本都在这里完成。

菜单示例：

![Twitter Bot V2 机器人主菜单](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1XceZpvXvNAJO1R9oraAOfn_nvx88aJlY_PixPin_2026-03-24_22-14-14.png)

## 四、打开后台

后台默认地址：

```text
http://服务器IP:5000/login
```

默认管理员账号密码：

```text
admin / admin123
```

后台登录页示例：

![Twitter Bot V2 后台登录页面](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_13FnB55bTERyykeEvJQFsU2Brx819J0LF_PixPin_2026-03-24_22-15-43.png)

登录进去后，先把后台基础设置配好。

## 五、设置套餐

进入后台后，先去设置套餐。

套餐主要决定后面用户在机器人里看到的订阅信息和可购买内容，没有设置套餐的话，机器人端很多订阅相关功能不好用。

套餐设置页面示例：

![Twitter Bot V2 套餐设置](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1_DsFM6pzMSlsUAY2cFZqvMwcotbJso8R_PixPin_2026-03-24_22-15-49.png)

## 六、设置支付接口和 TGAPI

接着进入后台的系统设置页面，把支付接口和 `TGAPI` 一起设置好。

设置页示例：

![Twitter Bot V2 支付接口和TGAPI设置](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1cDtfu43vmZEvwdRcMXUn8JSsfLHQHuPD_PixPin_2026-03-24_22-16-14.png)

这里重点看两项：

- 易支付接口配置
- `Local Bot API` 配置

这里的 `Local Bot API`，也可以直接理解成要配置的 `TGAPI`。

**这一项一定要设置。**

如果不设置，实际使用时只能稳定处理比较小的视频文件，大一点的视频很容易上传失败。  
这一项建议直接按大文件场景配置，否则后面同步视频推文时很容易出问题。

`TGAPI` 的申请和搭建，可以参考站内之前的相关文章：

- [Telegram API 申请与部署教程（图文）](/posts/telegram-api-apply-guide/)

## 七、创建群组并给机器人权限

后台和机器人都启动好后，接下来去 `Telegram` 里创建一个群组。

群组创建完成后，把机器人拉进群里，并给它管理员权限，同时开启管理话题权限。

第一步，打开机器人资料页，点击“添加到群组”：

![点击机器人信息并添加到群组](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_10tmXRL6f9GuxVIrx9SP4xR6DYbR9bcou_286ea1618b069587e03c22b7f63b9859.jpg)

第二步，选择前面创建好的群组：

![选择刚创建的群组](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1_laTVs4SsH626KZ8S5cz8jmqWMI0VybP_12d52a8d61c02f0f3a8de9c217e7c863.jpg)

第三步，给机器人管理员权限和管理话题权限：

![设置管理员权限和管理话题权限](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1OydKEhuQd9VhZXiWT6-XnxxhjUly3Fss_59e660983a598105a71160dbd56efb93.jpg)

## 八、获取群组 ID 并添加群组

机器人进群并设置好权限后，在群组中发送：

```text
/getid
```

或者在菜单里直接点“获取群组ID”。

获取群组 ID 示例：

![获取群组ID](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1h6Qjpgay7VgpeREM_wHH_Ev1RuZZoU03_ac12cde22c7b42f353f97a34a35086c4.jpg)

复制这个群组 ID，然后回到机器人私聊窗口：

- 进入 `群组管理`
- 点击 `添加群组`
- 把刚刚复制的群组 ID 发给机器人

添加群组示例：

![群组管理里添加群组](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1RIDEEBpSwETDpTJLlvnkU-BirXssFnzo_fe840aa6f40b9f4d95f6cde010599962.jpg)

到这里，群组就算接好了。

## 九、添加要同步的用户名

接着去 `X` 里复制需要保存推文的用户名。

然后回到机器人私聊：

- 进入 `用户管理`
- 点击 `添加用户`
- 发送 `X` 用户名

示例：

![添加X用户名](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1sRi_OorgBHKis0O4FswQ73Ay_3eMIXEr_3173eada6973d711e47be411e17c7542.jpg)

## 十、添加 Cookie

接下来设置 `Cookie`。

建议准备一个不用的 `X` 小号，或者单独注册一个新号，专门用来跑同步。  
如果不想单独注册，直接购买一个便宜的 `X` 小号也可以，1 块钱左右的就够用。

大概流程就是：

1. 在 `X.com` 登录一个不用的小号
2. 按 `F12` 打开开发者工具
3. 找到请求里的 `Cookie`
4. 复制完整 `Cookie` 内容
5. 回到 Telegram 机器人里设置

机器人里设置路径：

- `设置`
- `Cookie 设置`
- `设置 Cookie`

然后把复制好的 `Cookie` 发给机器人。

操作示例：

![进入Cookie设置](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1XxkvjN9d-LtMQCn51btDzmVedc60Nq-L_c5f4b84a6e8f17ffab64496c94a0cb90.jpg)

![发送Cookie给机器人](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1yEqCtiTcyrjdOshxRZy7iLfXcXZABmeZ_ab490f04ca1544c8d606b2cb7eb6c08f.jpg)

## 十一、开始全量同步

如果需要把某个 `X` 博主之前发过的内容一次性同步到群组，直接使用 `全量同步`。

全量同步开始后，会在目标群组里自动创建一个新的话题，话题名称就是这个博主的用户名。  
后面这个博主同步过来的推文，都会统一发到这个话题里面，查看和管理都会更方便。

操作顺序如下：

1. 进入 `全量同步`
2. 选择群组  
   - 如果只设置了一个群组，这一步可能不会出现
3. 选择要同步的用户名
4. 选择同步内容  
   - 全部内容  
   - 仅同步视频推文
5. 选择同步数量  
   - 自定义数量  
   - 或全部同步
6. 确认后开始同步

全量同步示例：

![全量同步操作](https://pic.sl.al/gdrive/pic/2026-03-24/fileid_1HkcXgy_IsTuqp0o1SZrg9eRTf1VCk0KH_f7ba567a498f13a57a2acd30158d7968.jpg)

## 十二、定时更新

如果不是只想同步一次，而是要持续订阅某个博主，就使用定时更新功能。

把想订阅的博主加进去后，机器人会定时获取新推文。

按当前这个版本的逻辑，默认是**每小时获取一次**。

这样后面博主有新内容，就会继续往对应的 `Telegram` 群组里发送。

## 十三、订阅信息

前面在后台设置的套餐，后面都会在机器人里显示出来。

也就是说：

- 后台设置套餐
- 机器人里显示订阅信息
- 用户按套餐使用同步功能

## 十四、仓库地址

项目地址：

- GitHub: <https://github.com/Assute/Twitter-Bot-V2>

## 十五、最后提醒

这套流程里最容易出问题的地方，基本就是下面这几个：

- `BOT_TOKEN` 没改
- 后台套餐没设置
- `TGAPI` / `Local Bot API` 没设置
- 机器人没有拉进群组
- 机器人没有管理员权限或管理话题权限
- 没有先添加群组就去同步
- 没有设置 `Cookie` 就去添加用户或抓推文

把这几步都配置好后，整体流程基本就能正常跑起来。
