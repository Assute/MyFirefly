---
title: AWS Lightsail IP 自动检测、更换与 Cloudflare DNS 更新教程
published: 2026-04-16T23:48:57+08:00
description: 这篇文章记录如何部署 lightsail-ip 脚本，实现 AWS Lightsail IP 检测、自动更换、Telegram 通知、Cloudflare DNS 自动更新和定时任务管理。
image: "https://pic.sl.al/gdrive/pic/2026-04-16/fileid_1DTB0Sh_2sGqNF7J-3eQrfWOnVe4yv9CK_image.png"
tags: [AWS, Lightsail, Linux, 教程]
category: 教程
draft: false
sourceLink: "https://github.com/Assute/lightsail-ip"
---

这篇文章整理 `lightsail-ip` 的完整使用流程，适合直接部署到服务器，用来做：

- AWS Lightsail 静态 IP 检测
- 自动更换 IP
- Telegram 通知
- Cloudflare DNS 自动更新
- 定时任务管理
- 多账号、多区域管理

项目效果图：

![AWS Lightsail IP 自动检测与定时更换](https://pic.sl.al/gdrive/pic/2026-04-16/fileid_1DTB0Sh_2sGqNF7J-3eQrfWOnVe4yv9CK_image.png)

## 一、项目准备

先把项目拉到服务器，例如放到 `/opt/AWS`：

```bash
git clone https://github.com/Assute/lightsail-ip.git /opt/AWS
cd /opt/AWS
cp config.example.json config.json
```

后面如果需要更新代码，直接执行：

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

如果服务器是 `aarch64` / `arm64`，把下载地址改成：

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

配置前先复制模板：

```bash
cp config.example.json config.json
```

配置示例：

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
    "token": "YOUR_CLOUDFLARE_API_TOKEN"
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
      "domain": "",
      "notification_enabled": true
    }
  ]
}
```

### 配置项说明

#### `defaults`

- `ping_times`：`ping` 检测次数

#### `telegram`

- `enabled`：是否启用 Telegram 通知
- `bot_token`：Telegram 机器人 Token
- `chat_id`：Telegram 接收消息的 Chat ID

#### `cloudflare`

- `token`：Cloudflare API Token

#### `accounts`

- `name`：账号名称
- `enabled`：是否启用
- `region`：Lightsail 区域
- `aws_access_key_id`：AWS Access Key
- `aws_secret_access_key`：AWS Secret Key
- `ip`：当前记录 IP，可留空
- `proxy_url`：代理地址，可留空
- `domain`：要自动更新到 Cloudflare 的域名，可留空
- `notification_enabled`：当前账号是否发送通知

### 常用地区码

`accounts` 里的 `region` 需要填写对应的地区码，常用地区如下：

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

如果有多个 Lightsail 账号或多个区域，可以继续往 `accounts` 里追加。

如果 `accounts` 里填写了 `domain`，并且全局配置里填写了 `cloudflare.token`，脚本在 IP 变更后会自动更新对应域名的 Cloudflare A 记录。

## 四、赋予执行权限

```bash
chmod +x /opt/AWS/lightsail-ip.sh
```

## 五、运行脚本

进入项目目录后直接执行：

```bash
cd /opt/AWS
bash ./lightsail-ip.sh
```

运行后会显示菜单：

```text
1. 设置/更新定时任务
2. 删除定时任务
0. 返回
```

## 六、设置定时任务

选择 `1` 之后，输入需要执行的分钟间隔即可。

例如输入 `5`，就会生成类似下面的定时任务：

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

删除脚本生成的定时任务时，重新运行脚本并选择：

```text
2. 删除定时任务
```

## 七、运行逻辑

脚本支持两种运行方式：

### 1. 交互模式

直接运行脚本时，会优先进入定时任务菜单。

### 2. 执行模式

- 非交互执行时：自动读取 `config.json` 中所有启用账号并执行
- 传入账号名时：只执行指定账号

## 八、IP 更换逻辑

脚本会先读取当前账号配置中的 `ip`。

### 情况 1：账号下已有静态 IP

会按原有逻辑执行：

1. 检测当前 IP
2. 释放旧静态 IP
3. 重新申请同名静态 IP
4. 绑定到实例
5. 读取新 IP
6. 写回 `config.json`

### 情况 2：账号下没有静态 IP

脚本会自动处理：

1. 读取实例公网 IP 作为初始 IP
2. 当检测到需要更换时
3. 自动新建一个静态 IP
4. 自动绑定到实例
5. 写回 `config.json`

## 九、手动执行单个账号

如果只想单独执行某一个账号，可以直接带上账号名：

```bash
bash ./lightsail-ip.sh lightsail-kr
```

这里的 `lightsail-kr` 对应 `config.json` 里的 `name` 字段。

## 十、查看日志

日志文件默认位置：

```bash
/opt/AWS/lightsail-ip.log
```

实时查看日志：

```bash
tail -f /opt/AWS/lightsail-ip.log
```

脚本带了日志大小控制，日志超过 `5MB` 后，下次非交互执行时会自动清空。

## 十一、Telegram 通知

当脚本检测到 IP 被更换后，会自动向 Telegram 发送通知。

需要提前准备好：

- Telegram Bot Token
- Telegram Chat ID

然后填到 `config.json` 的 `telegram` 配置里即可。

## 十二、Cloudflare DNS 自动更新

如果账号配置中填写了：

```json
"domain": "example.com"
```

并且全局配置中填写了：

```json
"cloudflare": {
  "token": "YOUR_CLOUDFLARE_API_TOKEN"
}
```

那么 IP 发生变化后，脚本会自动：

- 查找对应 Zone
- 查找该域名下的 A 记录
- 更新为新 IP
- 如果 A 记录不存在则自动创建

## 十三、安全建议

`config.json` 里会包含敏感信息：

- AWS Access Key
- AWS Secret Key
- Telegram Bot Token
- Cloudflare Token
- 代理信息

这些内容不要直接提交到公开仓库。

建议权限设置：

```bash
chmod 700 /opt/AWS
chmod 700 /opt/AWS/lightsail-ip.sh
chmod 600 /opt/AWS/config.json
```

## 十四、GitHub 地址

- GitHub: <https://github.com/Assute/lightsail-ip>
