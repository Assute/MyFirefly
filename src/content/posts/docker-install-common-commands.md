---
title: Docker 安装与常用指令速查
published: 2026-03-30T11:52:53+08:00
description: 一篇偏实用的 Docker 安装与常用命令整理，包含 Linux 安装步骤、开机自启设置和日常运维命令。
tags: [Docker, Linux, 教程]
category: 教程
draft: false
---

这篇文章整理一份偏实用的 Docker 安装与命令清单，适合日常部署、维护和排查时直接查阅。

## 一、安装 Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## 二、启动并设置开机自启

```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

验证是否安装成功：

```bash
docker --version
sudo docker run --rm hello-world
```

## 三、Docker 常用指令

<table style="width:100%; border-collapse: collapse; border: 1px solid #d0d7de;">
  <thead>
    <tr>
      <th style="border: 1px solid #d0d7de; padding: 8px; text-align: left;">指令</th>
      <th style="border: 1px solid #d0d7de; padding: 8px; text-align: left;">说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker --version</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">基础：查看 Docker 版本</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker info</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">基础：查看 Docker 运行信息</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker images</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">镜像：查看本地镜像列表</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker rmi -f IMAGE_ID</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">镜像：强制删除指定镜像</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker image prune -a</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">镜像：清理未被容器使用的镜像</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker ps -a</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：查看所有容器（含已停止）</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker start ID</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：启动容器</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker restart ID</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：重启容器</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker rm -f ID</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：强制删除指定容器</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker rm $(docker ps -aq -f status=exited)</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：批量删除已退出容器</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker rm -f $(docker ps -aq)</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">容器：强制删除全部容器</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose up -d</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：后台启动服务</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose down</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：停止并删除服务</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose logs -f</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：实时查看日志</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose restart</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：重启服务</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose up -d --build</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：重新构建并后台启动</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose ps</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：查看服务状态</td>
    </tr>
    <tr>
      <td style="border: 1px solid #d0d7de; padding: 8px;"><code>docker-compose down && docker-compose up -d --build</code></td>
      <td style="border: 1px solid #d0d7de; padding: 8px;">Docker Compose：先销毁再重建启动</td>
    </tr>
  </tbody>
</table>
