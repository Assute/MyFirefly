---
title: Backup Manager v4.0 更新版教程：Rsync 自动备份脚本
published: 2026-05-14T23:22:06+08:00
description: 这篇文章记录 Backup Manager v4.0 的最新用法，支持服务器凭据加密保存、服务器列表管理、临时执行一次备份、立即执行已有任务、远程自动安装 rsync 和一键更新脚本。
image: "https://pic.sl.al/gdrive/pic/2026-05-14/fileid_1YVNQa8gCT0_kiVEByqsXvsM0khtnlVr2_image.png"
tags: [Rsync, 备份, Linux, 脚本, 教程]
category: 教程
draft: false
sourceLink: "https://github.com/Assute/backup_manager"
---

这篇是 `Backup Manager` 的更新版教程，按目前最新的 `v4.0` 脚本来整理。

当前这版除了基础的 `Rsync` 自动备份，还多了不少更顺手的功能：

- 服务器凭据加密保存
- 服务器列表管理
- 临时执行一次备份
- 立即执行已有备份任务
- 远程自动检测并安装 `rsync`
- 快捷指令 `bf`
- 一键更新脚本

展示图：

![Backup Manager v4.0](https://pic.sl.al/gdrive/pic/2026-05-14/fileid_1YVNQa8gCT0_kiVEByqsXvsM0khtnlVr2_image.png)

## 一、这个脚本能做什么

这个脚本适合用来做服务器之间的自动备份。

主要能力包括：

- 添加 / 修改 / 删除备份任务
- 按分钟设置定时备份
- 开机自动执行备份
- 基于 `rsync` 增量同步
- 支持自定义 SSH 端口
- 远程自动创建目标目录
- 自动安装本机依赖
- 自动检测远程是否安装 `rsync`

## 二、一键安装

直接执行：

```bash
bash <(curl -sL https://raw.githubusercontent.com/Assute/backup_manager/main/backup_manager.sh)
```

安装完成后，脚本会自动保存到：

```text
/opt/backup/backup_manager.sh
```

并自动生成快捷命令：

```bash
bf
```

## 三、启动方式

安装完成后，后面直接输入：

```bash
bf
```

也可以手动运行：

```bash
sudo bash /opt/backup/backup_manager.sh
```

## 四、新版菜单

当前 `v4.0` 的菜单如下：

```text
1. 添加备份任务
2. 临时执行一次备份
3. 立即执行已有备份
4. 修改备份任务
5. 删除备份任务
6. 修改定时
7. 服务器管理
8. 更新脚本
0. 退出脚本
```

相比旧版，现在多了几项更实用的功能：

- `临时执行一次备份`
- `立即执行已有备份`
- `服务器管理`
- `更新脚本`

## 五、添加备份任务

选择：

```text
1. 添加备份任务
```

然后按提示填写：

1. 备份备注
2. 源目录
3. 目标服务器信息
4. 目标存放目录
5. 备份间隔（分钟）

服务器信息部分支持两种方式：

- 直接手动填写
- 从服务器列表里选择

创建完成后，脚本会自动：

- 保存任务配置
- 生成对应备份脚本
- 添加定时任务
- 添加开机自启
- 立即执行一次首次备份

## 六、服务器管理

这是新版很实用的一项。

选择：

```text
7. 服务器管理
```

可以集中管理远程服务器配置，后面添加备份时就不需要每次重新输入一遍。

这部分支持：

- 添加服务器
- 修改服务器
- 删除服务器

服务器密码不会再直接明文存放，而是会加密保存。

## 七、临时执行一次备份

如果不想先创建正式任务，只想先测试一遍同步流程，可以用：

```text
2. 临时执行一次备份
```

这个模式适合用来：

- 测试远程连通性
- 测试 SSH 端口和密码
- 测试目标目录权限
- 测试 `rsync` 是否正常

执行完成后会生成日志，但不会写成长期定时任务。

## 八、立即执行已有备份

如果任务已经创建好了，但不想等到下一个定时点再执行，可以直接用：

```text
3. 立即执行已有备份
```

这样可以手动立即跑一次现有任务。

## 九、远程自动安装 rsync

这是新版一个很实用的更新。

脚本执行备份时，会先检查远程机器有没有安装 `rsync`。

如果远程没有安装，脚本会尝试自动安装，支持：

- `apt-get`
- `yum`
- `dnf`
- `apk`

也就是说，很多情况下不用先手动去远程安装 `rsync`，脚本会自己处理。

## 十、目录结构

脚本运行后会在：

```text
/opt/backup/
```

下面生成这些内容：

```text
/opt/backup/
├── backup_configs/     # 备份任务配置
├── backup_scripts/     # 自动生成的备份执行脚本
├── backup_logs/        # 备份日志
├── server_configs/     # 服务器配置
├── .backup_secret.key  # 本地加密密钥
└── backup_manager.sh   # 主脚本
```

和旧版相比，现在新增了：

- `server_configs/`
- `.backup_secret.key`

## 十一、日志和定时任务

每个备份任务都会有独立日志，默认放在：

```bash
/opt/backup/backup_logs/
```

查看日志可以直接用：

```bash
cat /opt/backup/backup_logs/任务名.log
```

脚本生成的定时任务基于 `cron`，会自动写入系统计划任务里。

如果日志超过 `5MB`，脚本会自动清空旧日志，避免一直涨大。

## 十二、更新脚本

如果脚本后面有新版本，可以直接在菜单里选择：

```text
8. 更新脚本
```

脚本会自动：

- 从 GitHub 拉取最新版
- 备份当前安装脚本
- 覆盖到 `/opt/backup/backup_manager.sh`

这样后面维护会更方便。

## 十三、注意事项

- 需要 `root` 权限运行
- 本机会自动检测并安装 `rsync`、`sshpass`、`cron`
- 远程服务器需要能通过 SSH 正常连接
- 目标服务器需要有足够空间
- 备份前最好先用“临时执行一次备份”测试

## 十四、项目地址

- GitHub：<https://github.com/Assute/backup_manager>
