---
title: "Umami Docker 部署"
published: 2026-01-29
pinned: false
description: "Umami 是一个开源、轻量级的网站分析工具，使用 Docker 快速部署，保护用户隐私的同时提供详细的流量统计"
tags: ["Umami", "分析工具", "docker"]
category: "工具"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-29
image: 'https://picflow-api.mikus.ink/converted/pc/webp/BB3E8EA26B159AA8FEFBBBDBA0D5BBDF.webp'
pubDate: 2026-01-29
---

# Umami Docker 部署指南

## 项目介绍

[Umami](https://umami.is/) 是一个开源的网站分析工具，专注于简洁、轻量和保护用户隐私。与 Google Analytics 等服务不同，Umami 不会跟踪用户个人信息，所有数据存储在您自己的服务器上，完全可控。

### 主要特点

- 📊 简洁直观的仪表板
- 🔒 完全保护用户隐私
- 🚀 轻量级设计，加载速度快
- 📱 响应式界面，支持移动端
- 🗄️ 数据存储在自己的服务器上
- 🐳 支持 Docker 快速部署

## 部署前准备

### 环境要求

- Docker 和 Docker Compose
- 至少 512MB 内存
- 至少 1GB 存储空间

## 部署步骤

### 方法一：使用 Docker Compose（推荐）

1. **创建项目目录**

```bash
mkdir -p umami && cd umami
```

2. **创建 docker-compose.yml 文件**

```yaml
services:
  umami:
    image: ghcr.docker.mikus.ink/umami-software/umami:latest  # 使用指定镜像源的Umami最新版
    container_name: umami  # 容器名称
    ports:
      - 3000:3000  # 端口映射：主机3000端口 → 容器3000端口
    networks:
      - umami-network  # 连接到自定义网络
    environment:
      FAVICON_URL: https://easyimage.mikus.ink/app/thumb.php?img=/i/u/2025/05/24/w1yxsy.svg  # 网站图标URL
      DATABASE_URL: postgresql://umami:umami@umami-db:5432/umami  # 数据库连接字符串（用户名:密码@主机:端口/数据库名）
      APP_SECRET: replace-me-with-a-random-string  # 应用密钥
    depends_on:
      db:
        condition: service_healthy  # 等待数据库健康检查通过后再启动
    init: true  # 使用init进程处理信号和僵尸进程
    restart: always  # 总是重启（除非手动停止）
    healthcheck:
      test:
        - CMD-SHELL
        - curl http://localhost:3000/api/heartbeat  # 健康检查：访问心跳接口
      interval: 5s  # 每5秒检查一次
      timeout: 5s   # 超时时间5秒
      retries: 5    # 重试5次后标记为不健康

  db:
    image: postgres:15-alpine  # 使用PostgreSQL 15 Alpine轻量版
    container_name: umami-db  # 数据库容器名称
    networks:
      - umami-network  # 连接到同一网络
    environment:
      POSTGRES_DB: umami      # 数据库名称
      POSTGRES_USER: umami    # 数据库用户
      POSTGRES_PASSWORD: umami  # 数据库密码（生产环境建议修改）
    volumes:
      - ./data:/var/lib/postgresql/data  # 数据持久化：主机./data目录 → 容器数据目录
    restart: always  # 总是重启
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}  # PostgreSQL健康检查
      interval: 5s
      timeout: 5s
      retries: 5

networks:
  umami-network:
    driver: bridge  # 使用桥接网络模式，允许容器间通信
```

3. **启动服务**

```bash
docker-compose up -d
```

5. **验证部署**

打开浏览器访问 `http://your-server-ip:3000`，使用默认凭据登录：
- 用户名：`admin`
- 密码：`umami`

## 安全配置

1. **修改默认密码**
2. **使用 HTTPS** 推荐使用 Nginx 或 Caddy 作为反向代理，并配置 SSL 证书

## 使用方法

### 添加网站

1. 登录 Umami 仪表板
2. 点击左侧菜单的 "Websites"
3. 点击 "Add website" 按钮
4. 填写网站名称和域名
5. 点击 "Save" 保存

### 安装跟踪代码

添加网站后，您会获得一段跟踪代码，将其添加到您的网站中：

```html
<script async src="https://analytics.yourdomain.com/script.js" data-website-id="your-website-id"></script>
```

### 查看统计数据

- **实时访问**：查看当前网站的实时访问情况
- **页面浏览**：查看页面访问量和热门页面
- **来源分析**：了解用户从哪里来
- **设备分析**：查看用户使用的设备和浏览器
- **地理位置**：查看用户所在地区

## 升级 Umami

当有新版本发布时，您可以通过以下步骤升级：

```bash
# 停止并删除旧容器
docker-compose down

# 拉取新版本
docker-compose pull

# 重新启动
docker-compose up -d
```

## 总结

Umami 是一个优秀的开源网站分析工具，通过 Docker 部署可以快速搭建属于自己的分析平台。它不仅保护用户隐私，还提供了丰富的统计功能，是 Google Analytics 的理想替代品。

## 相关资源

- [Umami 官方文档](https://umami.is/docs/)
- [Umami 中文文档](https://umami.zhcndoc.com/docs)
- [Umami GitHub 仓库](https://github.com/umami-software/umami)
- [Docker 官方文档](https://docs.docker.com/)

希望能帮助您成功部署 Umami！如果您有任何问题或建议，欢迎在评论区留言。