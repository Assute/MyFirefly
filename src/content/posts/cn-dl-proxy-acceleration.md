---
title: 被屏蔽海外访问的国内服务器，如何用代理做加速
published: 2026-03-06T18:55:17+08:00
description: 一篇可直接落地的完整安装教程，教你通过 CN 中继和 DL 上游，让无法直连海外资源的国内服务器稳定访问 GitHub 等站点。
tags: [服务器, 脚本]
category: 服务器
draft: false
---

## 被屏蔽海外访问的国内服务器，如何用代理做加速

这篇是可直接落地的完整安装教程。目标是让**无法直接访问海外资源**的国内服务器，也能稳定下载 GitHub 等站点内容。

### 一、架构说明

```text
A（业务机，海外访问受限） -> B（CN 中继，国内） -> C（DL 上游，海外） -> GitHub/目标站点
```

**A：**业务服务器，不能直接访问海外。  
**B：**国内中继服务器，安装 CN。  
**C：**海外服务器，安装 DL。

### 二、端口规划

**C（DL）端口：**`9011`  
**B（CN）端口：**`9010`

### 三、先安装 DL（海外服务器 C）

1. 登录海外服务器：

```bash
ssh root@C_IP
```

2. 一键安装 DL：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Assute/dl_proxy/main/dl_proxy.sh)
```

3. 验证 DL 是否正常：

```bash
docker ps --filter "name=dl_proxy"
curl -I "http://127.0.0.1:9011/https://github.com"
```

### 四、再安装 CN（国内服务器 B）

1. 登录国内服务器：

```bash
ssh root@B_IP
```

2. 一键安装 CN：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/Assute/cn_proxy/main/cn_proxy.sh)
```

3. 按提示输入：

**gh-proxy 地址：**`http://C_IP:9011`  
**本机监听端口：**`9010`

4. 验证 CN 是否正常：

```bash
nginx -t
curl -I "http://127.0.0.1:9010/https://github.com"
```

### 五、业务机 A 的使用方式

把目标链接拼成：

```text
http://B_IP:9010/https://目标地址
```

常见示例：

```bash
# 下载压缩包
wget "http://B_IP:9010/https://github.com/user/repo/archive/master.zip"

# 克隆仓库
git clone "http://B_IP:9010/https://github.com/user/repo.git"

# 执行远程脚本
bash <(curl -fsSL "http://B_IP:9010/https://raw.githubusercontent.com/user/repo/main/install.sh")
```

### 六、运维命令

**DL（C 服务器）**

```bash
docker logs -f dl_proxy
docker restart dl_proxy
docker stop dl_proxy
docker rm -f dl_proxy
```

**CN（B 服务器）**

```bash
nginx -t
systemctl restart nginx
nginx -s reload
```

### 七、常见问题

**1）CN 返回 502：**先在 B 上测试是否能访问 C：`curl -I http://C_IP:9011/https://github.com`

**2）访问超时：**检查安全组和防火墙是否放通 `B:9010`、`C:9011`

**3）脚本安装失败：**确认 DNS 正常、系统有 root 权限

> 建议：生产环境请限制来源 IP，避免代理被公网滥用。

### 八、项目地址

**CN Proxy**

GitHub：<https://github.com/Assute/cn_proxy.git>  
Gitee：<https://gitee.com/Assute/cn_proxy.git>

**DL Proxy**

GitHub：<https://github.com/Assute/dl_proxy.git>  
Gitee：<https://gitee.com/Assute/dl_proxy.git>