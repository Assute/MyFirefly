---
title: Browser Proxy Manager 一款轻量的 Chrome 代理切换扩展
published: 2026-03-06T10:00:00+08:00
description: Browser Proxy Manager 是一款轻量的 Chrome 代理切换扩展，支持手动代理配置和通过 API 自动获取、验证、轮换代理 IP。
image: "https://upload-bbs.miyoushe.com/upload/2026/02/27/363490070/8818ca8f548463e2dab8d19abc6659c3_1858078389479248811.jpeg"
tags: [浏览器插件]
category: 浏览器插件
draft: false
---

日常开发和测试中，经常需要切换浏览器代理，手动改系统设置实在太麻烦。于是我写了一个 Chrome 扩展 `Browser Proxy Manager`，可以在浏览器内一键切换代理，还支持通过 API 自动获取和轮换代理 IP。

> ⚠️ 声明：本项目目前为半成品，部分功能尚未经过完整测试，可能存在未知问题。如果你在使用中遇到 Bug，欢迎在 GitHub 提交 Issue。

## 它能做什么？

这个扩展提供了两种代理模式，覆盖了大多数使用场景。

### 模式一：手动代理

适合有固定代理服务器的用户。在弹窗中填入代理地址、端口，选择协议类型（HTTP / HTTPS / SOCKS5），保存即可生效。支持填写用户名和密码进行认证。

### 模式二：API 自动代理

这是这个插件的核心亮点。如果你使用的是按量计费的代理服务，比如各种 IP 代理平台，通常会提供一个 API 接口来获取代理 IP。只需要把 API 地址填进去，插件就会：

1. 自动调用 API 获取新的代理 IP
2. 验证代理是否可用
3. 应用到浏览器
4. 到期后自动换一个新的 IP

整个过程完全自动化，不需要你手动操作。

## 主要特性

- **代理验证**：每次获取新 IP 后，会先测试连通性，确认可用才会启用
- **定时轮换**：支持 `1 / 3 / 5 / 10 / 30` 分钟的自动换 IP 周期
- **失败重试**：获取失败时自动重试，递增延迟，连续 5 次失败后暂停
- **实时状态**：弹窗显示当前代理 IP 和剩余时间倒计时
- **智能绕行**：自动将 API 域名加入绕行列表，避免循环请求
- **多格式兼容**：支持纯文本 `ip:port` 和多种 JSON 格式的 API 响应
- **状态持久化**：重启浏览器后自动恢复代理设置

## 安装方法

目前还没有上架 Chrome 应用商店，需要通过开发者模式手动加载。

1. 从 GitHub 下载源码：

```bash
git clone https://github.com/Assute/browser-proxy-manager.git
```

或者从 Gitee（国内镜像）下载：

```bash
git clone https://gitee.com/Assute/browser-proxy-manager.git
```

2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角的开发者模式
4. 点击加载已解压的扩展程序，选择下载的项目文件夹

## 使用演示

安装完成后，点击浏览器工具栏上的扩展图标，会弹出设置面板。

![手动代理模式](https://upload-bbs.miyoushe.com/upload/2026/02/27/363490070/8818ca8f548463e2dab8d19abc6659c3_1858078389479248811.jpeg)

![API代理模式](https://upload-bbs.miyoushe.com/upload/2026/02/27/363490070/3d487eabb4eaf36a872039e98979bb49_2030722325682677239.jpeg)

- 顶部有 **手动代理** 和 **API代理** 两个标签页，点击切换
- 填写对应的配置信息，点击保存即可
- 底部会实时显示当前代理状态、IP 地址和剩余有效时间

两种模式互斥，开启一种会自动关闭另一种。

## API 响应格式

插件兼容多种常见的代理 API 返回格式，基本上拿来就能用。

| 格式 | 示例 |
| --- | --- |
| 纯文本 | `123.45.67.89:8080` |
| JSON（proxy 字段） | `{"proxy": "123.45.67.89:8080"}` |
| JSON（ip 字段） | `{"ip": "123.45.67.89:8080"}` |
| JSON（带绕行列表） | `{"proxy": "123.45.67.89:8080", "bypass": ["api.example.com"]}` |

## 技术细节

- 基于 **Chrome Extension Manifest V3** 开发
- 使用 Chrome Proxy API 控制浏览器代理设置
- 使用 Chrome Alarms API 实现定时轮换
- 纯原生 JavaScript，无任何第三方依赖
- 代码开源，协议为 Apache-2.0

## 项目地址

- GitHub: <https://github.com/Assute/browser-proxy-manager>
- Gitee: <https://gitee.com/Assute/browser-proxy-manager>

如果觉得有用，欢迎 Star 支持一下。遇到问题或有功能建议，也欢迎提交 Issue。
