---
title: Cookie Viewer & Exporter 一键查看并导出网站 Cookie 的 Chrome 扩展
published: 2026-03-06T10:30:00+08:00
description: Cookie Viewer & Exporter 是一款轻量的 Chrome 扩展，可以一键查看当前网站的所有 Cookie，并快速复制或导出为标准请求头格式。
image: "https://upload-bbs.miyoushe.com/upload/2026/02/27/363490070/b8105e957c03e8d84a13d32973c8e220_7312483646035272672.jpeg"
tags: [浏览器插件]
category: 浏览器插件
draft: false
---

做接口调试的时候，经常需要从浏览器里复制 Cookie 粘贴到 cURL、Postman 或者自动化脚本里。每次都要打开 DevTools -> Application -> Cookies，然后一条条拼接，实在繁琐。所以我写了一个小工具 `Cookie Viewer & Exporter`，点一下就搞定。

## 插件预览

![Cookie Viewer & Exporter 插件预览](https://upload-bbs.miyoushe.com/upload/2026/02/27/363490070/b8105e957c03e8d84a13d32973c8e220_7312483646035272672.jpeg)

## 它能做什么？

非常简单，就三件事。

1. **查看**：点击扩展图标，自动读取当前网站的所有 Cookie，格式化显示在弹窗中
2. **复制**：一键复制为 `name=value; name=value` 格式，直接能粘贴到 HTTP 请求头里用
3. **下载**：一键导出为 `cookie.txt` 文件，保存到默认下载目录

输出的格式就是标准的 HTTP `Cookie` 请求头格式，复制出来可以直接用，不用再手动拼接。

## 使用场景

如果你经常做以下这些事，这个插件能帮你省不少时间。

- **接口调试**：需要在 Postman、Insomnia 或 cURL 中携带 Cookie 发请求
- **自动化脚本**：Python、Node.js 等脚本需要模拟登录态
- **问题排查**：快速检查当前网站存了哪些 Cookie，值是什么
- **数据采集**：需要快速获取登录后的 Cookie 用于爬虫

## 安装方法

目前还没有上架 Chrome 应用商店，需要通过开发者模式手动加载。

1. 从 GitHub 下载源码：

```bash
git clone https://github.com/Assute/cookie-viewer.git
```

或者从 Gitee（国内镜像）下载：

```bash
git clone https://gitee.com/Assute/cookie-viewer.git
```

2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角的开发者模式
4. 点击加载已解压的扩展程序，选择下载的项目文件夹

## 怎么用？

安装完成后，使用非常简单。

1. 访问你想获取 Cookie 的网站，比如已经登录的后台
2. 点击浏览器工具栏上的扩展图标
3. 弹窗会自动显示当前网站的所有 Cookie
4. 点击 **复制到剪贴板** 或 **下载为 cookie.txt**

就这么简单，全程不需要打开开发者工具。

## 输出格式

假设当前网站有三条 Cookie，输出内容长这样。

```text
session_id=abc123; token=xyz456; user=assute
```

可以直接作为 HTTP 请求头中 `Cookie` 字段的值使用。比如在 cURL 中：

```bash
curl -H "Cookie: session_id=abc123; token=xyz456; user=assute" https://example.com/api/data
```

## 技术细节

- 基于 **Chrome Extension Manifest V3** 开发
- 通过 `chrome.cookies.getAll()` 获取当前页面的 Cookie
- 通过 `navigator.clipboard.writeText()` 实现剪贴板复制
- 通过 `chrome.downloads.download()` 触发文件下载
- 纯原生 JavaScript，无任何第三方依赖，整个插件只有 3 个文件
- 代码开源，协议为 Apache-2.0

## 项目地址

- GitHub: <https://github.com/Assute/cookie-viewer>
- Gitee: <https://gitee.com/Assute/cookie-viewer>

插件非常轻量，代码也很简单，感兴趣的话可以看看源码，也欢迎 Star 支持。有问题或建议，欢迎提交 Issue。
