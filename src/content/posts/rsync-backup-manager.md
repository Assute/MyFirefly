---
title: Linux 服务器自动备份神器：Rsync 备份管理工具
published: 2026-03-06T18:05:44+08:00
description: 一个基于 rsync、sshpass 和 cron 的 Linux 服务器自动备份脚本，支持交互式配置、增量同步、定时任务和开机自启。
image: "https://upload-bbs.miyoushe.com/upload/2026/03/01/363490070/e4f9fbad785cd0a3b53d88a9b21518ed_6185428099354103731.jpeg"
tags: [服务器, 备份, 脚本]
category: GitHub
draft: false
---

# Linux 服务器自动备份神器：Rsync 备份管理工具

在服务器运维中，数据备份是一项至关重要的工作。手动备份不仅繁琐，还容易遗漏。今天分享一个自己写的 **Rsync 备份管理工具**，它可以帮你轻松实现自动化增量备份，支持定时任务和开机自启。

## 视频教程

快速了解工具的使用方法，请观看视频教程：

<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=BV1TmABz1E3v&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

## 一、功能特点

这个脚本具备以下核心功能：

- **添加备份任务**：通过交互式菜单配置备份源、目标服务器、SSH 端口、密码等信息
- **修改备份任务**：随时调整已有备份任务的配置
- **删除备份任务**：一键清理不需要的备份任务
- **灵活的定时设置**：支持按分钟设置备份间隔，可单独修改或批量修改
- **增量同步**：基于 Rsync，只传输变化的部分，大幅节省带宽和时间
- **开机自启动**：服务器重启后自动恢复备份任务
- **自动依赖安装**：首次运行自动检测并安装 `rsync`、`sshpass`、`cron` 等依赖

## 二、工作原理

脚本的核心工作流程如下：

```text
用户配置 -> 生成配置文件 -> 生成 Rsync 备份脚本 -> 添加 Cron 定时任务
```

### 2.1 配置文件管理

每个备份任务会生成一个独立的配置文件，存储在 `/opt/backup/backup_configs/` 目录下：

```bash
BACKUP_NAME="mybackup"
SOURCE_FOLDER="/data/important"
USERNAME="root"
HOST="192.168.1.100"
PORT="22"
DEST_FOLDER="/backup"
PASSWORD="your_password"
INTERVAL="60"
```

### 2.2 Rsync 增量备份

脚本使用 **rsync + sshpass** 实现自动化增量备份。相比传统的 SCP 全量复制，Rsync 只传输文件变化的部分，效率更高。每个备份任务会生成一个对应的 Bash 脚本，自动处理：

- 通过 `sshpass` 自动传递密码，无需交互
- 使用 `-avz` 参数保留文件属性并压缩传输
- 自动接受 SSH 主机密钥
- 日志记录，超过 5MB 自动清空

### 2.3 Cron 定时任务

脚本会根据你设置的时间间隔，自动生成合适的 Cron 表达式：

| 间隔设置 | Cron 表达式 |
| --- | --- |
| 30 分钟 | `*/30 * * * *` |
| 60 分钟 | `0 * * * *` |
| 120 分钟 | `0 */2 * * *` |

## 三、使用方法

### 3.1 一键安装

**国内服务器：**

```bash
bash <(curl -sL https://gitee.com/Assute/backup_manager/raw/master/backup_manager.sh)
```

**国外服务器：**

```bash
bash <(curl -sL https://raw.githubusercontent.com/Assute/backup_manager/main/backup_manager.sh)
```

### 3.2 主菜单界面

运行后会显示一个美观的交互式菜单：

![Rsync 备份管理工具主菜单](https://upload-bbs.miyoushe.com/upload/2026/03/01/363490070/e4f9fbad785cd0a3b53d88a9b21518ed_6185428099354103731.jpeg)

### 3.3 添加备份任务示例

选择 `1. 添加备份` 后，按提示输入：

1. **任务名称**：如 `web_backup`，仅支持英文和数字
2. **备份路径**：如 `/var/www/html`
3. **目标服务器**：如 `192.168.1.100`
4. **SSH 端口**：默认 22
5. **用户名**：默认 root
6. **密码**：SSH 登录密码
7. **目标目录**：如 `/backup/web`
8. **备份间隔**：如 60，单位为分钟

配置完成后，脚本会：

- 保存配置文件
- 生成自动化备份脚本
- 添加定时任务
- 设置开机自启
- **立即执行一次备份**

## 四、目录结构

脚本运行后会创建以下目录结构：

```text
/opt/backup/
├── backup_configs/     # 配置文件目录
│   └── mybackup.conf
├── backup_scripts/     # Rsync 备份脚本目录
│   └── mybackup.sh
└── backup_logs/        # 日志文件目录
    └── mybackup.log
```

## 五、查看备份日志

每个备份任务都有独立的日志文件，记录备份的开始和完成时间：

```bash
cat /opt/backup/backup_logs/mybackup.log
```

输出示例：

```text
2024-01-15 10:00:01 - 开始备份 /data/important -> root@192.168.1.100:22:/backup
2024-01-15 10:00:15 - 备份完成
```

## 六、注意事项

1. **需要 root 权限**：脚本需要 root 权限来安装依赖和管理 cron 任务
2. **密码安全**：配置文件中存储了明文密码，文件权限已设置为 600，仅 root 可读写
3. **网络要求**：确保本机可以通过 SSH 连接到目标服务器
4. **存储空间**：请确保目标服务器有足够的存储空间

## 七、适用场景

- 网站数据定时备份到远程服务器
- 数据库导出文件异地备份
- 配置文件定期同步
- 日志文件归档备份

## 八、总结

这个 Rsync 备份管理工具通过交互式菜单简化了备份任务的配置过程，结合 sshpass 实现密码自动化，利用 Rsync 增量同步节省带宽，配合 Cron 实现定时执行，是一个实用的服务器备份解决方案。

如果你也有服务器备份的需求，不妨试试这个脚本。

---

## 九、项目地址

- **GitHub**：<https://github.com/Assute/backup_manager>
- **Gitee**：<https://gitee.com/Assute/backup_manager>

## 十、免责声明

本脚本仅供学习和参考使用，请根据实际环境调整。使用本脚本所造成的任何直接或间接损失，作者不承担任何责任。请在使用前充分测试，并确保已备份重要数据。

**禁止将本脚本用于任何非法用途。**
