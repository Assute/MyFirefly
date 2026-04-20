---
title: AWS Lightsail IP 自动检测、更换与多域名 Cloudflare DNS 更新教程
published: 2026-04-20T22:33:07+08:00
description: 这篇文章记录如何部署 lightsail-ip 脚本，实现 AWS Lightsail IP 检测、自动更换、Telegram 通知、多个 Cloudflare Token 管理和多域名 DNS 自动更新。
image: "https://pic.sl.al/gdrive/pic/2026-04-16/fileid_1DTB0Sh_2sGqNF7J-3eQrfWOnVe4yv9CK_image.png"
tags: [AWS, Lightsail, Cloudflare, Linux, 教程]
category: 教程
draft: false
sourceLink: "https://github.com/Assute/lightsail-ip"
---

这篇文章按最新版 `lightsail-ip` 脚本整理，适合直接部署到服务器，用来完成下面这些事情：

- AWS Lightsail IP 检测
- 自动更换静态 IP
- Telegram 机器人通知
- Cloudflare A 记录自动更新
- 一个账号绑定多个域名
- 多个根域名分别使用不同 Cloudflare Token
- 定时任务管理

项目效果图：

![AWS Lightsail IP 自动检测与定时更换](https://pic.sl.al/gdrive/pic/2026-04-16/fileid_1DTB0Sh_2sGqNF7J-3eQrfWOnVe4yv9CK_image.png)

## 一、克隆项目

先把项目拉到服务器，例如放到 `/opt/AWS`：

```bash
git clone https://github.com/Assute/lightsail-ip.git /opt/AWS
cd /opt/AWS
cp config.example.json config.json
```

后面如果脚本有更新，直接执行：

```bash
cd /opt/AWS
git pull
```

## 二、安装依赖

脚本依赖这些命令：

- `bash`
- `aws`
- `jq`
- `curl`
- `ping`
- `crontab`

### Debian / Ubuntu

```bash
apt update
apt install -y bash jq curl unzip iputils-ping ca-certificates cron less groff
cd /tmp
curl -L "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
./aws/install --bin-dir /usr/local/bin --install-dir /usr/local/aws-cli
aws --version
```

如果服务器架构是 `aarch64` / `arm64`，把下载地址改成：

```text
https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip
```

### Alpine

```bash
setup-apkrepos -c
sed -i 's#http://#https://#g' /etc/apk/repositories
apk update
apk add --no-cache bash jq curl iputils ca-certificates aws-cli dcron
```

## 三、配置 config.json

脚本默认读取同目录下的：

```bash
config.json
```

初始化：

```bash
cp config.example.json config.json
```

### 推荐配置示例

这是当前推荐写法，支持多个根域名分别使用不同 Token，也支持一个账号绑定多个域名：

```json
{
  "defaults": {
    "ping_times": 30
  },
  "telegram": {
    "enabled": true,
    "bot_token": "YOUR_TELEGRAM_BOT_TOKEN",
    "chat_id": "YOUR_TELEGRAM_CHAT_ID"
  },
  "cloudflare": {
    "tokens": [
      {
        "root_domain": "example.com",
        "token": "YOUR_CLOUDFLARE_TOKEN_EXAMPLE_COM"
      },
      {
        "root_domain": "example.net",
        "token": "YOUR_CLOUDFLARE_TOKEN_EXAMPLE_NET"
      }
    ]
  },
  "accounts": [
    {
      "name": "lightsail-kr",
      "enabled": true,
      "region": "ap-northeast-2",
      "aws_access_key_id": "YOUR_AWS_ACCESS_KEY_ID",
      "aws_secret_access_key": "YOUR_AWS_SECRET_ACCESS_KEY",
      "ip": "",
      "proxy_url": "",
      "domains": [
        "a.example.com",
        "b.example.com"
      ],
      "notification_enabled": true
    }
  ]
}
```

### 兼容旧写法

脚本仍兼容旧版单 Token / 单域名配置：

```json
{
  "cloudflare": {
    "root_domain": "example.com",
    "token": "YOUR_CLOUDFLARE_API_TOKEN"
  },
  "accounts": [
    {
      "domain": "a.example.com"
    }
  ]
}
```

## 四、配置项说明

### `defaults`

- `ping_times`：每次检测的 `ping` 次数

### `telegram`

- `enabled`：是否启用 Telegram 通知
- `bot_token`：Telegram 机器人 Token
- `chat_id`：Telegram 接收消息的 Chat ID

### `cloudflare`

推荐使用：

```json
"cloudflare": {
  "tokens": [
    {
      "root_domain": "example.com",
      "token": "..."
    }
  ]
}
```

字段说明：

- `root_domain`：Cloudflare Zone 对应根域名
- `token`：该根域名使用的 Cloudflare API Token

脚本会根据账号中的域名，自动匹配最合适的 `root_domain`。

### `accounts`

- `name`：账号名称
- `enabled`：是否启用
- `region`：AWS 区域
- `aws_access_key_id`：AWS Access Key
- `aws_secret_access_key`：AWS Secret Key
- `ip`：当前记录 IP，可留空
- `proxy_url`：代理地址，可留空
- `domains`：要自动更新到 Cloudflare 的域名数组，可留空
- `domain`：旧版单域名写法，仍兼容
- `notification_enabled`：当前账号是否发送 Telegram 通知

## 五、常用地区码

`accounts` 里的 `region` 需要填写对应的地区码，点击右侧地区码可直接复制：

<table style="width:100%; border-collapse: collapse; border: 1px solid #d0d7de;">
  <thead>
    <tr>
      <th style="border: 1px solid #d0d7de; padding: 10px; text-align: left;">地区</th>
      <th style="border: 1px solid #d0d7de; padding: 10px; text-align: left;">地区码</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">美国东部（俄亥俄）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="us-east-2" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>us-east-2</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">美国东部（弗吉尼亚北部）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="us-east-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>us-east-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">美国西部（俄勒冈）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="us-west-2" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>us-west-2</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">亚太地区（孟买）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ap-south-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ap-south-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">亚太地区（首尔）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ap-northeast-2" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ap-northeast-2</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">亚太地区（新加坡）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ap-southeast-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ap-southeast-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">亚太地区（悉尼）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ap-southeast-2" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ap-southeast-2</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">亚太地区（东京）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ap-northeast-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ap-northeast-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">加拿大（中部）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="ca-central-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>ca-central-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">欧洲（法兰克福）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="eu-central-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>eu-central-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">欧洲（爱尔兰）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="eu-west-1" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>eu-west-1</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">欧洲（伦敦）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="eu-west-2" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>eu-west-2</code></button></td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 10px;">欧洲（巴黎）</td>
      <td style="border: 1px solid #d0d7de; padding: 10px;"><button type="button" data-copy="eu-west-3" onclick="navigator.clipboard.writeText(this.dataset.copy);this.animate([{transform:'scale(1)',opacity:1},{transform:'scale(0.94)',opacity:0.72},{transform:'scale(1)',opacity:1}],{duration:180,easing:'ease-out'});let toast=document.getElementById('aws-region-copy-toast');if(!toast){toast=document.createElement('div');toast.id='aws-region-copy-toast';toast.style.cssText='position:fixed;left:50%;top:50%;z-index:9999;background:#16a34a;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(22,163,74,.25);font-size:14px;line-height:1;opacity:0;transform:translate(-50%, calc(-50% + 8px));transition:opacity .18s ease,transform .18s ease;pointer-events:none;';document.body.appendChild(toast)}toast.textContent='已复制到剪贴板';toast.style.opacity='1';toast.style.transform='translate(-50%, -50%)';clearTimeout(window.__awsRegionCopyToastTimer);window.__awsRegionCopyToastTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%, calc(-50% + 8px))'},1500)" style="border: none; background: transparent; padding: 0; cursor: pointer;"><code>eu-west-3</code></button></td>
    </tr>
  </tbody>
</table>

## 六、赋予执行权限

```bash
chmod +x /opt/AWS/lightsail-ip.sh
```

## 七、运行模式

脚本支持两种运行方式。

### 1）交互模式

直接运行：

```bash
cd /opt/AWS
bash ./lightsail-ip.sh
```

会显示：

```text
1. 设置/更新定时任务
2. 删除定时任务
0. 返回
```

### 2）执行模式

- 非交互执行时：自动读取 `config.json` 中所有启用账号并执行
- 传入账号名时：只执行指定账号

示例：

```bash
bash ./lightsail-ip.sh lightsail-kr
```

## 八、IP 更换逻辑

脚本会先读取账号配置中的 `ip`。

### 情况 1：账号下已有静态 IP

会执行：

1. 检测当前 IP
2. 释放旧静态 IP
3. 重新申请同名静态 IP
4. 绑定到实例
5. 获取新 IP
6. 写回 `config.json`

### 情况 2：账号下没有静态 IP

会执行：

1. 读取实例公网 IP 作为初始 IP
2. 当检测到需要更换时
3. 自动创建新的静态 IP
4. 自动绑定到实例
5. 写回 `config.json`

## 九、Cloudflare DNS 更新逻辑

当账号配置了 `domain` 或 `domains` 时，脚本会自动更新 Cloudflare DNS。

处理流程如下：

1. 根据域名匹配 `cloudflare.tokens` 里最合适的 `root_domain`
2. 查询对应 Zone
3. 查询该域名下的 A 记录
4. 已存在 A 记录时直接更新
5. 不存在 A 记录时自动创建

例如：

- 域名：`a.example.com`
- Token 根域：`example.com`

脚本就会自动使用 `example.com` 对应的 Token。

如果一个账号绑定了多个域名，也会逐个处理。

## 十、定时任务

交互运行脚本后，选择：

```text
1. 设置/更新定时任务
```

然后输入分钟数，例如：

```text
5
```

会生成类似：

```cron
# lightsail-ip managed task begin
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
*/5 * * * * /bin/bash "/opt/AWS/lightsail-ip.sh" >> "/opt/AWS/lightsail-ip.log" 2>&1
# lightsail-ip managed task end
```

查看当前定时任务：

```bash
crontab -l
```

删除脚本创建的定时任务：

```bash
bash ./lightsail-ip.sh
```

选择：

```text
2
```

## 十一、日志

日志默认写入：

```bash
/opt/AWS/lightsail-ip.log
```

查看日志：

```bash
tail -f /opt/AWS/lightsail-ip.log
```

日志规则：

- 超过 `5MB`
- 下次非交互执行前自动清空
- 不备份旧日志

## 十二、Telegram 通知

当 IP 被更换后，脚本会发送 Telegram 通知。

需要准备：

- `bot_token`
- `chat_id`

## 十三、安全建议

真实配置中通常包含：

- AWS Access Key
- AWS Secret Key
- Telegram Bot Token
- Cloudflare Token
- 代理账号密码

不要把真实 `config.json` 提交到 GitHub。

建议：

- 提交前使用模板文件
- 将 `config.json` 加入 `.gitignore`
- 服务器上收紧权限

例如：

```bash
chmod 700 /opt/AWS
chmod 700 /opt/AWS/lightsail-ip.sh
chmod 600 /opt/AWS/config.json
```

## 十四、GitHub 地址

- GitHub: <https://github.com/Assute/lightsail-ip>
