---
title: "Mikutap Docker版部署指南"
published: 2026-01-21
pinned: false
description: "Mikutap Docker镜像，无需部署，直接使用即可"
tags: [Mikutap,docker]
category: "Mikutap"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-21
image: 'https://picflow-api.mikus.ink/converted/pc/webp/3294652C99ACC6E4ED864B1F94B95F82.webp'
pubDate: 2026-01-21
---
# 项目地址
::github{repo="AkariRin/mikutap"}

# 介绍
Mikutap 是由日本知名 Vocaloid 音乐人*daniwell*开发的一款极简交互式声音艺术装置，灵感来源于 Patatap，核心特点是无需任何音乐基础，通过简单的点击操作就能生成初音未来风格的电音旋律，配合绚丽的粒子动画，带来极致的解压体验。它没有复杂的规则，没有失败惩罚，只有纯粹的创作乐趣和感官享受。 miku厨狂喜

# 使用方法
:::caution[注意]
部署前需确保服务器/本地已安装Docker和Docker Compose
:::
## 1.使用mikus构建好的镜像 （推荐）
1. 创建docker-compose.yml文件
```docker compose
services:
  mikutap:
    container_name: mikutap
    image: mikusloli/mikutap-mikus:latest
    restart: always
    ports:
      - "8080:80"  # 主机8080端口映射到容器80端口（可自定义主机端口，如9000:80）
```
2. 启动容器：
```bash
docker compose up -d
```

## 2.自己构建镜像
1. 编写 Dockerfile
```Dockerfile
# 基于官方轻量Nginx镜像（Alpine版本体积更小）
FROM nginx:alpine

# 清空Nginx默认的静态文件目录
RUN rm -rf /usr/share/nginx/html/*

# 安装git工具
RUN apk add --no-cache git \
    && rm -rf /var/cache/apk/*
# 克隆Mikutap源码到容器的Nginx静态目录
RUN git clone https://mirror.mikus.ink/https://github.com/AkariRin/mikutap.git /usr/share/nginx/html/

# 暴露80端口（容器对外提供服务的端口）
EXPOSE 80

# 启动Nginx（前台运行，保证容器不退出）
CMD ["nginx", "-g", "daemon off;"]
```
2. 构建镜像
```bash
# 构建镜像（-t 指定镜像名:标签）
docker build -t mikutap:v1.0 .
# 可选：给镜像打tag（方便管理）
docker tag mikutap:v1.0 mikutap:latest
```
3. 运行容器
```bash
# 后台运行，自动重启，映射端口8080
docker run -d \
  --name mikutap \
  --restart always \
  -p 8080:80 \
  --memory 128M \
  mikutap:latest
```

## 访问验证
部署完成后，通过以下方式验证是否成功：
1. 本地访问：打开浏览器，输入 http://localhost:8080
2. 服务器访问：输入 http://服务器IP:8080
检查容器状态：
```bash
运行
docker ps  # 看到mikutap容器状态为Up即正常
# 查看日志（排查启动失败）
docker logs mikutap
```

# 预览网址

- https://aidn.jp/mikutap/
- https://mikutap.mikus.ink/ （mikus部署的Mikutap 国内访问优化）


:::caution[注意]
1. 仅用于个人学习和研究使用，禁止违法用途  
2. 请勿滥用，否则可能会被限制访问或封禁 IP  
3. 若有疑问或建议，可通过博客评论区或邮箱联系博主
:::