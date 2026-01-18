---
title: "Meting API"
published: 2026-01-15
pinned: false
description: "mikus自建的Meting API"
tags: [meting, api]
category: "API"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-15
image: 'https://picflow-api.mikus.ink/converted/pc/webp/D7994B273C2F7698AE88E09D5F028FAC.webp'
pubDate: 2026-01-15
---

# Meting API
Meting API地址:https://meting.mikus.ink
# 接口用法
## API 参数
### 服务器地址 (server)
支持的音乐源服务器：
- netease - 网易云音乐
- tencent - QQ音乐
- kugou - 酷狗音乐
- xiami - 虾米音乐
- baidu - 百度音乐
### 获取类型 (type)
支持的数据获取类型：
- playlist - 歌单
- song - 单曲
- album - 专辑
- artist - 艺术家
### 资源ID (id)
对应获取类型的唯一标识符：
- 对于歌单：歌单ID
- 对于单曲：歌曲ID
- 对于专辑：专辑ID
- 对于艺术家：艺术家ID
## API 端点格式
Meting API 的端点格式为：
```
{api_base_url}?server={server}&type={type}&id={id}&auth={auth}&r={r}
```
其中：
- api_base_url - API 基础URL
- server - 音乐源服务器
- type - 获取类型
- id - 资源ID
- auth - 认证参数（通常为空）
- r - 随机数（用于防止缓存，通常是时间戳）
## 举个栗子
假设我们要获取网易云音乐的歌单ID为12990345596的歌单信息。
我们可以使用以下URL：
```
https://meting.mikus.ink/api?server=netease&type=playlist&id=12990345596&auth=&r=1674633600000
```
其中：
- server=netease 表示使用网易云音乐服务器
- type=playlist 表示获取歌单信息
- id=12990345596 表示歌单ID为12990345596
- auth= 表示认证参数为空 （可选 ）
- r=1674633600000 表示随机数为1674633600000（16位时间戳）(可选,不加好像也行QAQ)

# 注意事项
1. 仅用于个人学习和研究使用，禁止违法用途  
2. 请勿滥用，否则可能会被限制访问或封禁 IP  
3. 若有疑问或建议，可通过博客评论区或邮箱联系博主