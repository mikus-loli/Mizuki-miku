---
title: "Docker加速源"
published: 2026-01-14
pinned: false
description: "mikus自建的docker加速源"
tags: [docker, 加速]
category: "加速源"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-14
image: 'https://picflow-api.mikus.ink/converted/pc/webp/3FA88D85EFFCBED67E3F6D79A7D57B9B.webp'
pubDate: 2026-01-14
---

# Docker加速源
- docker hub 加速源 https://hub.docker.mikus.ink
- elastic 加速源 https://elastic.docker.mikus.ink
- gcr 加速源 https://gcr.docker.mikus.ink
- ghcr 加速源 https://ghcr.docker.mikus.ink
- k8s 加速源 https://k8s.docker.mikus.ink
- k8s.gcr 加速源 https://k8s-gcr.docker.mikus.ink
- mcr 加速源 https://mcr.docker.mikus.ink
- nvcr 加速源 https://nvcr.docker.mikus.ink
- quay 加速源 https://quay.docker.mikus.ink

# 配置使用示例

## Linux/Mac 系统配置

### 1. 编辑 Docker 配置文件
```bash
sudo nano /etc/docker/daemon.json
```

### 2. 添加加速源配置
```json
{
  "registry-mirrors": [
    "https://hub.docker.mikus.ink"
  ]
}
```

### 3. 重启 Docker 服务
```bash
# Ubuntu/Debian
sudo systemctl restart docker

# CentOS/RHEL
sudo service docker restart

# Mac (Docker Desktop)
# 无需命令，配置后自动生效
```

## Windows 系统配置

1. 打开 Docker Desktop
2. 点击右上角设置图标
3. 选择 Docker Engine 选项卡
4. 在配置中添加加速源：
```json
{
  "registry-mirrors": [
    "https://hub.docker.mikus.ink"
  ]
}
```
5. 点击应用并重启

## 验证配置

运行以下命令验证加速源是否生效：
```bash
docker info --format '{{.RegistryConfig.Mirrors}}'
```

如果输出显示配置的加速源 URL，则说明配置成功。

## 使用示例

### 拉取 Docker Hub 镜像
```bash
docker pull nginx:latest
# 自动使用 https://hub.docker.mikus.ink 加速
```

### 拉取 GCR 镜像
```bash
docker pull gcr.docker.mikus.ink/google-containers/pause:3.6
# 等同于 docker pull k8s.gcr.io/pause:3.6
```

### 拉取 GHCR 镜像
```bash
docker pull ghcr.docker.mikus.ink/microsoft/vscode:latest
# 等同于 docker pull ghcr.io/microsoft/vscode:latest
```

# 注意事项
1. 如遇无法拉取镜像，请尝试刷新 DNS 或更换网络环境  
2. 加速源仅用于个人学习和研究使用，禁止违法用途  
3. 请勿滥用，否则可能会被限制访问或封禁 IP  
4. 若有疑问或建议，可通过博客评论区或邮箱联系博主
