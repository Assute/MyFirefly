---
title: Realm-Web 部署教程：Realm 转发脚本 + 网页面板
published: 2026-05-14T23:33:56+08:00
description: 这篇文章记录如何部署 Realm-Web，通过一键脚本安装 Realm 转发服务，再安装网页面板，实现规则管理、批量导入、备份恢复和账户设置。
image: "https://pic.sl.al/gdrive/pic/2026-05-14/fileid_1hQBf9oHDsc6EGCoyz3sBRWR7udQe0wjk_image.png"
tags: [Realm, 面板, Linux, 转发, 教程]
category: 教程
draft: false
sourceLink: "https://github.com/Assute/Realm-Web"
---

这篇文章整理 `Realm-Web` 的部署方法。

这套项目主要分成两部分：

- `Realm` 转发服务
- `Realm-Web` 网页管理面板

部署完成后，可以通过网页后台管理转发规则、批量导入、备份恢复，以及修改背景和账户信息。

## 一、先执行安装命令

如果是国外机器，直接执行：

```bash
wget -N https://raw.githubusercontent.com/Assute/Realm-Web/main/realm.sh && chmod +x realm.sh && ./realm.sh
```

如果是国内机器，执行：

```bash
wget -N https://ghfast.top/https://raw.githubusercontent.com/Assute/Realm-Web/main/CN/realm.sh && chmod +x realm.sh && ./realm.sh
```

命令参考图：

![Realm-Web 安装命令](https://pic.sl.al/gdrive/pic/2026-05-14/fileid_1hQBf9oHDsc6EGCoyz3sBRWR7udQe0wjk_image.png)

后面如果还要再次进入脚本菜单，直接执行：

```bash
./realm.sh
```

## 二、脚本菜单说明

脚本运行后，会看到主菜单。

当前这版主要菜单包括：

```text
1. 安装 / 更新 Realm
2. 添加转发规则
3. 查看转发规则
4. 删除转发规则
5. 启动服务
6. 停止服务
7. 重启服务
8. 定时任务管理
9. 查看日志
10. 完全卸载
11. 面板管理
0. 退出脚本
```

## 三、安装 Realm

第一次使用时，先选择：

```text
1. 安装 / 更新 Realm
```

这一步会自动安装或更新 `Realm` 主程序，并处理对应的服务文件。

安装完成后，就可以继续添加转发规则。

## 四、添加转发规则

如果需要先通过脚本添加规则，可以选择：

```text
2. 添加转发规则
```

按提示填写：

- 本地监听端口
- 目标 IP
- 目标端口
- 监听方式
- 备注

添加完成后，脚本会自动重启 `realm.service`，让规则立即生效。

## 五、安装网页面板

如果要使用网页后台，进入：

```text
11. 面板管理
```

面板管理菜单里有这些选项：

```text
1. 安装 / 更新面板
2. 卸载面板
3. 修改面板端口
0. 返回
```

第一次部署时，直接选择：

```text
1. 安装 / 更新面板
```

脚本会自动：

- 安装 `python3`
- 复制或下载面板文件
- 生成 `realm-panel.service`
- 设置开机自启
- 启动面板服务

面板参考图：

![Realm-Web 面板页面](https://pic.sl.al/gdrive/pic/2026-05-14/fileid_1mVHAXv2-UfqcSDv9yvMShFfXHo0Kp2NE_image.png)

## 六、面板默认地址

当前面板默认端口是：

```text
3060
```

默认访问地址：

```text
http://服务器IP:3060
```

默认账号密码：

```text
admin / 123456
```

首次登录后，建议尽快在面板里修改账号密码。

## 七、修改面板端口

如果默认端口 `3060` 不方便使用，可以在：

```text
11. 面板管理
```

里面选择：

```text
3. 修改面板端口
```

输入新的端口后，脚本会自动重启面板服务。

## 八、面板能做什么

按当前这版说明，网页面板支持：

- 规则管理
- 批量导入
- 备份恢复
- 背景设置
- 账户设置

而且脚本侧新增的规则，也会同步到面板里。

## 九、服务说明

当前这套会用到两个服务：

- `realm.service`
- `realm-panel.service`

其中：

- `realm.service`：负责转发
- `realm-panel.service`：负责网页管理后台

如果规则修改后没有生效，通常可以回到脚本里执行：

```text
7. 重启服务
```

## 十、适合的部署顺序

实际部署时，按下面顺序走最省事：

1. 执行安装命令
2. 选择 `1. 安装 / 更新 Realm`
3. 选择 `11. 面板管理`
4. 选择 `1. 安装 / 更新面板`
5. 打开 `http://服务器IP:3060`
6. 登录后台
7. 在后台或脚本中添加转发规则

## 十一、GitHub 地址

- GitHub: <https://github.com/Assute/Realm-Web>
