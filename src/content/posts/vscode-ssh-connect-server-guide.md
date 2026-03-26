---
title: VS Code 连接服务器教程（Remote SSH）
published: 2026-03-26T11:50:21+08:00
description: 手把手教你用 VS Code 的 Remote SSH 连接服务器，从添加 SSH 到输入密码并打开远程文件夹。
image: "https://pic.sl.al/gdrive/pic/2026-03-26/fileid_19NnUS1XzJHmMUQUuY1Erl_yngNPTppzx_image.png"
tags: [VS Code, SSH, 服务器]
category: 教程
draft: false
---

这篇教程记录一下如何用 VS Code 连接远程服务器。

## 第一步：打开远程资源管理器，添加 SSH

先打开 VS Code 左侧的远程资源管理器，然后点击添加 SSH 主机。

![打开远程资源管理器并添加 SSH](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_19NnUS1XzJHmMUQUuY1Erl_yngNPTppzx_image.png)

## 第二步：输入连接命令

基础连接命令：

```bash
ssh root@ip
```

如果你需要自定义连接端口，用这个命令：

```bash
ssh -p 22 root@ip
```

![输入 SSH 连接命令](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_1smExyaWgZcOIFCdDNlnd02kTkX7-1PAk_image.png)

## 第三步：选择第一个配置文件

VS Code 会提示把 SSH 配置保存到哪个文件，直接选择第一个即可。

![选择第一个配置文件](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_14aaWuz_zvjyDW6CdvRiZnm_73EyU2_Xp_image.png)

## 第四步：连接服务器

配置写入后，在远程资源管理器中点击对应主机并连接。

![连接服务器](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_1jHVu2CIK8LyqUgX9mRePf9iqJd6_Jc60_image.png)

## 第五步：输入服务器密码

首次连接会提示输入服务器密码，输入后回车。

![输入密码](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_1mTmcFL1sA4uTHRGGhOgrjvzT7frDxwlU_image.png)

## 第六步：连接成功后打开文件夹

连接成功后，点击打开远程文件夹。

![连接成功后打开文件夹](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_12dLqz1Jj57OqZNz4pOXMwuUEt9ATm72y_image.png)

## 第七步：选择目录并再次输入密码

选择你要打开的服务器目录后，通常会再提示输入一次密码，输入即可。

![选择目录并再次输入密码](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_1Tc-3q2dO8I_vRvc8SddrgJJcNMwZRZoe_image.png)

## 完成

到这里就完成了，你已经可以在 VS Code 里直接管理服务器文件了。

![完成连接](https://pic.sl.al/gdrive/pic/2026-03-26/fileid_1s-xOfKBfLw25hAI9Vb30_3sDdCFrxcO0_image.png)
