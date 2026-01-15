---
title: "Live2D API"
published: 2026-01-14
pinned: false
description: "miku自建的live2d-api"
tags: [live2d, api]
category: "API"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-14
image: 'https://picflow-api.mikus.ink/converted/pc/webp/8F54C70847A95D27A4BD911A42583576.webp'
pubDate: 2026-01-14
---

# Live2D API
Live2d API地址:https://live2d.mikus.ink
# 使用方法
```html
<!-- waifu-tips.js 依赖 JQuery 库 -->放在body
<script src="https://static.mikus.ink/live2d/jquery.min.js"></script>
<!-- 使用 aotuload.js 引入看板娘 -->放在body
<script src="https://static.mikus.ink/live2d/autoload.js"></script>
```
# 接口用法
- /add/ - 检测新增皮肤并更新缓存列表
- /get/?id=1-23 获取分组1的第23号皮肤
- /rand/?id=1 根据上一分组随机切换
- /switch/?id=1 根据上一分组顺序切换
- /rand_textures/?id=1-23 根据上一皮肤随机切换同分组其他皮肤
- /switch_textures/?id=1-23 根据上一皮肤顺序切换同分组其他皮肤

# 注意事项
1. 仅用于个人学习和研究使用，禁止违法用途  
2. 请勿滥用，否则可能会被限制访问或封禁 IP  
3. 若有疑问或建议，可通过博客评论区或邮箱联系博主