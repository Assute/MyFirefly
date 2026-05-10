---
title: Cloudreve 自建云盘接入 Cloudflare R2 教程（宝塔反代 + Supervisor）
published: 2026-05-10T17:20:00+08:00
description: 这篇文章记录如何在 Linux 服务器上部署 Cloudreve，自建网盘并通过宝塔反向代理和 Supervisor 守护运行，再把存储策略接到 Cloudflare R2 存储桶。
image: "https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1X0kiR0Z3Vtz-XGWttY--yOPLP1CsvhpT_image.png"
tags: [Cloudreve, Cloudflare, R2, 宝塔, Linux, 教程]
category: GitHub
draft: false
pinned: false
sourceLink: "https://github.com/cloudreve/Cloudreve/releases/latest"
---

这篇教程适合这样一种用法：用 `Cloudreve` 自建一个云盘前端，文件实际存到 `Cloudflare R2`，服务器这边只负责跑面板和管理逻辑。

我这里按 **宝塔面板 + 反向代理 + Supervisor 守护进程** 的方式整理，步骤比较直接，照着做就能跑起来。

> 截至 `2026-05-10`，我查到 `Cloudreve` 的 GitHub Releases 最新版本是 `4.15.0`，默认监听端口是 `5212`。

## 一、先下载 Cloudreve 压缩包

先打开官方 Releases：

```text
https://github.com/cloudreve/Cloudreve/releases
```

然后下载对应你服务器架构的 Linux 压缩包。

常见情况：

- `x86_64 / amd64` 服务器：下载 `linux_amd64` 包
- `arm64` 服务器：下载 `linux_arm64` 包

如果你是在宝塔服务器上部署，大多数场景都是 `amd64`。

## 二、解压并首次运行

把压缩包放到你准备部署 Cloudreve 的目录里，例如：

```bash
mkdir -p /www/wwwroot/cloudreve
cd /www/wwwroot/cloudreve
```

然后解压：

```bash
tar -zxvf cloudreve_VERSION_linux_amd64.tar.gz
```

给主程序加执行权限：

```bash
chmod +x ./cloudreve
```

然后先手动启动一次：

```bash
./cloudreve
```

第一次启动主要是为了确认程序能正常跑起来，同时生成默认配置和数据目录。

Cloudreve 默认监听：

```text
http://127.0.0.1:5212
```

如果你看到程序已经正常监听 `5212`，这一步就没问题了。

## 三、宝塔里创建反向代理到 5212

Cloudreve 自带 Web 服务，但正式对外用的时候，更适合在宝塔里绑定域名再反代到 `5212`。

大致流程：

1. 在宝塔里先创建一个站点，绑定你的域名
2. 打开这个站点的【反向代理】
3. 反代目标填：

```text
http://127.0.0.1:5212
```

这样以后访问你的域名，就会转到 Cloudreve。

如果你同时开了 HTTPS，就直接通过宝塔给这个站点配证书就行。

> 如果你后面上传大文件时报 `413 Request Entity Too Large`，去宝塔站点的 Nginx 配置里把 `client_max_body_size` 调大，值要大于你准备上传的文件大小。

## 四、宝塔应用商店安装 Supervisor，并创建守护进程

为了避免终端关掉后 Cloudreve 跟着退出，接下来在宝塔里装 `Supervisor` 来守护它。

先去：

- 宝塔面板
- 应用商店
- 安装 `Supervisor`

装好后创建守护进程，程序路径填 Cloudreve 主程序所在位置。

示意图：

![宝塔 Supervisor 守护进程](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1X0kiR0Z3Vtz-XGWttY--yOPLP1CsvhpT_image.png)

如果你是放在本文示例目录里，一般可以按这种思路填：

- 名称：`cloudreve`
- 运行目录：`/www/wwwroot/cloudreve`
- 启动命令：`/www/wwwroot/cloudreve/cloudreve`

保存后启动守护进程即可。

这样后面服务器重启或者进程异常退出时，Supervisor 都会帮你拉起来。

## 五、打开域名，注册第一个管理员账号

Cloudreve 跑起来以后，直接打开你绑定好的域名。

第一次访问时注册一个账号，**第一个注册的账号就是管理员账号**。

后面添加存储策略、设置用户组，都是在这里完成。

## 六、在管理面板里添加 R2 存储策略

进入 Cloudreve 管理后台后，添加新的存储策略。

这里选择：

- `S3 兼容`

对应界面参考：

![Cloudreve 添加存储策略](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1e7p2kDY02w0QfSrfKNIzKSlBGBnVWQqE_image.png)

## 七、到 R2 存储桶里复制 Endpoint

去 Cloudflare 面板里打开你创建好的 `R2` 存储桶，在存储桶设置里找到 `S3 API` 地址。

参考图：

![R2 存储桶 Endpoint](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1MBXIZ2n97iSXFIpxumqN9VbPttXmIS3N_image.png)

这里要注意一件事：

- `Endpoint` 不是整条都原样填进去
- 要把链接最后面的 **存储桶名称删掉**

也就是：

- 如果 R2 给你的地址像这样：

```text
https://xxxxxxxxxxxx.r2.cloudflarestorage.com/your-bucket
```

- 那么 Cloudreve 里应该填成：

```text
https://xxxxxxxxxxxx.r2.cloudflarestorage.com
```

存储策略里另外几个关键项这样填：

- `Bucket 名称`：你的 R2 存储桶名
- `Endpoint`：删掉桶名后的 S3 API 地址
- `强制路径格式 Endpoint`：勾选
- `地区代码`：填 `auto`

## 八、在 Cloudflare 创建 R2 API 令牌

接着去 Cloudflare 的 `R2 -> API -> 管理 API 令牌`。

按图里的流程创建：

![创建 R2 令牌 1](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_13xTI_J1i3Kpd-vHjuFZx1VDXV6llOM5R_image.png)

![创建 R2 令牌 2](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1yMiXH3fcDN3VZ3FfPl4HLGRudfTgE_Rv_image.png)

![创建 R2 令牌 3](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1w4lRS2Xl_eCV8MNoMzepk9dUdcj8U66m_image.png)

权限这里建议直接选：

- `管理员读和写`

创建完成后，会拿到：

- `Access Key ID`
- `Secret Access Key`

然后复制到 Cloudreve 存储策略对应位置：

![填写 R2 Key 和地区代码 auto](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1vWdPyxb3yB5wagCbu7QaY4l0WYmnH91z_image.png)

这里再强调一次：

- `地区代码` 填 `auto`
- `Access Key ID` / `Secret Access Key` 填刚创建的那组凭证

## 九、点击“帮我设置”，完成跨域配置

Cloudreve 接 R2 做网页上传时，存储桶需要有 CORS 跨域策略。

正常情况下，在添加存储策略时直接点击 Cloudreve 里的 **“帮我设置”** 就行，它会帮你把 R2 需要的跨域规则配好。

这样做完以后，这条存储策略基本就能正常用了。

## 十、在用户组里把存储策略分配给 R2

最后还差一步：去 `用户组` 里，把刚创建的 R2 存储策略分配给对应用户组。

参考图：

![用户组绑定 R2 存储策略](https://pic.sl.al/gdrive/pic/2026-05-10/fileid_1yQtzfegtwipVkzZJg1-hbhmhMCKqRytH_image.png)

做完后，这个用户组上传的文件就会走 R2 存储桶。

到这里就算完成了。

## 十一、补充说明

如果你只是自己用，Cloudreve 默认的内置 SQLite 也能先跑起来。

如果后面用户多、文件多，再考虑额外接 MySQL / PostgreSQL 和 Redis 就行。Cloudreve 首次启动后会在程序目录下生成 `data/conf.ini`，后续这些配置也都是在这里改。

这套方案的核心思路其实很简单：

- Cloudreve 负责前端、用户、分享、权限和面板
- Cloudflare R2 负责真正存文件
- 宝塔负责域名和反代
- Supervisor 负责守护进程

这样搭起来以后，基本就是一个比较顺手的自建云盘了。
