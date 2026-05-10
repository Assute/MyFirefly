---
title: 阿里云 OSS 多 Bucket 同步上传面板部署教程（oss-sync）
published: 2026-05-10T16:55:00+08:00
description: 这篇文章记录如何部署 oss-sync，一个基于 Node.js 的阿里云 OSS 多存储同步上传网页，支持登录、自动发现 Bucket、同步上传、批量复制链接、在线编辑和删除。
image: "https://pic.sl.al/gdrive/pic/2026-05-08/fileid_1R7qkNYMNSevitfeYBLKiVgTJYCewsu6C_image.png"
tags: [阿里云, OSS, Node.js, Linux, 教程]
category: GitHub
draft: false
pinned: false
sourceLink: "https://github.com/Assute/oss-sync"
---

`oss-sync` 是一个阿里云 OSS 多存储同步上传面板，后端直接调用 OSS REST API，前端是纯静态页面，适合放在自己的 VPS 上用浏览器管理多个 Bucket。

它的特点比较直接：

- 只需要 `AccessKeyId` 和 `AccessKeySecret`
- 不手动写 Bucket 时，可自动发现当前账号下的 Bucket
- 上传、编辑、删除都会同步到所有 Bucket
- 同名文件只显示一条记录
- 复制链接时会一次性复制所有存储地址，一行一个
- 不需要额外安装依赖，直接 `node server.js` 就能跑

效果图：

![oss-sync 演示图](https://pic.sl.al/gdrive/pic/2026-05-08/fileid_1R7qkNYMNSevitfeYBLKiVgTJYCewsu6C_image.png)

## 一、准备环境

开始前准备这几样：

- 一台 Linux VPS 或你自己的本地服务器
- Node.js 18 或更高版本
- 阿里云 OSS 的 `AccessKeyId` 和 `AccessKeySecret`

项目 `package.json` 里要求的是：

```json
"engines": {
  "node": ">=18"
}
```

所以如果你的机器还是老版本 Node，先升级再部署。

## 二、拉取项目

先把项目克隆到服务器，例如放到 `/opt/oss-sync`：

```bash
git clone https://github.com/Assute/oss-sync.git /opt/oss-sync
cd /opt/oss-sync
```

这个项目是零依赖写法，仓库里没有必须先跑的 `npm install` 步骤，直接配置后就可以启动。

## 三、修改配置文件

项目根目录直接有 `config.json`，编辑它：

```bash
nano /opt/oss-sync/config.json
```

默认配置大概是这样：

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 5300
  },
  "auth": {
    "enabled": true,
    "username": "admin",
    "password": "change-this-password"
  },
  "oss": {
    "accessKeyId": "your-access-key-id",
    "accessKeySecret": "your-access-key-secret",
    "secure": true
  },
  "upload": {
    "maxFileSizeMB": 100
  },
  "list": {
    "maxKeys": 200
  }
}
```

你至少要改这几个值：

- `auth.username`：网页登录账号
- `auth.password`：网页登录密码
- `oss.accessKeyId`：阿里云 AccessKeyId
- `oss.accessKeySecret`：阿里云 AccessKeySecret

几个常用字段说明：

- `server.host`：监听地址，填 `0.0.0.0` 表示允许外部访问
- `server.port`：网页端口，默认 `5300`
- `auth.enabled`：是否开启登录验证
- `upload.maxFileSizeMB`：单文件上传大小限制
- `list.maxKeys`：文件列表单次读取数量
- `oss.secure`：是否使用 `https`

## 四、Bucket 获取方式

这个项目有两种方式拿 Bucket。

### 1）自动发现 Bucket

如果你在 `config.json` 里只填写 AK/SK，不写 `oss.buckets`，程序会自动拉取当前账号下的 Bucket 列表。

这也是最省事的用法。

### 2）手动指定 Bucket

如果你只想同步固定几个 Bucket，也可以手动写：

```json
{
  "oss": {
    "accessKeyId": "your-access-key-id",
    "accessKeySecret": "your-access-key-secret",
    "secure": true,
    "buckets": [
      {
        "name": "bucket-a",
        "region": "oss-cn-hangzhou",
        "endpoint": "oss-cn-hangzhou.aliyuncs.com"
      },
      {
        "name": "bucket-b",
        "region": "oss-cn-shanghai",
        "endpoint": "oss-cn-shanghai.aliyuncs.com"
      }
    ]
  }
}
```

这样程序就不会再自动发现，而是只同步你写进去的这些 Bucket。

## 五、启动项目

在项目目录执行：

```bash
cd /opt/oss-sync
node server.js
```

启动后终端会输出类似：

```text
OSS 上传网页已启动: http://127.0.0.1:5300
```

如果你是本机访问，直接打开：

```text
http://127.0.0.1:5300
```

如果你部署在 VPS，上面配置又是 `0.0.0.0`，那就用：

```text
http://你的服务器IP:5300
```

首次访问会先跳到登录页 `login.html`，输入你在 `config.json` 里设置的账号密码即可。

## 六、后台常驻运行（可选）

如果你不想一直挂着终端，可以先用最简单的后台方式：

```bash
nohup node /opt/oss-sync/server.js > /opt/oss-sync/oss-sync.log 2>&1 &
```

如果你想长期稳定运行，建议写一个 `systemd` 服务。

先创建：

```bash
nano /etc/systemd/system/oss-sync.service
```

内容可以写成：

```ini
[Unit]
Description=oss-sync
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/oss-sync
ExecStart=/usr/bin/node /opt/oss-sync/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

然后执行：

```bash
systemctl daemon-reload
systemctl enable --now oss-sync
systemctl status oss-sync
```

## 七、网页里能做什么

这个面板的核心逻辑很简单，但非常实用。

### 1）上传

选择一个文件上传后，程序会把它同步写入所有 Bucket。

如果遇到同名文件，不会自动改名，而是直接覆盖原文件。

### 2）文件列表

多个 Bucket 里如果都有同名文件，列表里只显示一条，不会重复铺满页面。

### 3）复制链接

点击复制时，会把这个文件在所有 Bucket 里的访问地址一次性复制出来，一行一个。

如果某个 Bucket 开启了传输加速，程序会优先使用加速地址。

### 4）在线编辑

支持直接在线编辑一部分文本类文件，然后同步保存到所有 Bucket。

目前代码里可在线编辑的后缀包括：

```text
.txt .json .js .ts .html .css .md .xml .yml .yaml .csv .svg
```

### 5）删除

删除某个文件时，会同步删除所有 Bucket 中同名的对象。

## 八、常见问题

### 1）启动时报“未找到配置文件”

先确认项目根目录里存在：

```text
/opt/oss-sync/config.json
```

这个项目启动时会直接读取这个文件。

### 2）能打开登录页，但看不到 Bucket 或文件

通常优先检查这几项：

- `AccessKeyId` / `AccessKeySecret` 是否正确
- 这个 AK/SK 是否有 OSS 相关权限
- 填写的 `endpoint` 和 `region` 是否对应

### 3）复制出来的链接打不开

如果 Bucket 是私有读，复制出来的 URL 不一定能直接在浏览器打开，这属于 OSS 本身的访问策略问题，不是程序故障。

## 九、更新项目

后面如果仓库有更新，直接执行：

```bash
cd /opt/oss-sync
git pull
```

如果你是 `systemd` 方式运行，更新后重启一下：

```bash
systemctl restart oss-sync
```

这样就完成了。

如果你想要的不是本地管理，而是继续往外做成带域名访问、反向代理、HTTPS 的线上面板，可以再额外在 Nginx 前面套一层。
