---
title: "小米ax3000t 开启ssh"
published: 2026-01-14
pinned: false
description: "开启小米ax3000t的ssh功能"
tags: ["ax3000t", "ssh"]
category: "路由器"
licenseName: "MIT"
author: "mikus"
draft: false
date: 2026-01-14
image: 'https://picflow-api.mikus.ink/converted/pc/webp/3FA88D85EFFCBED67E3F6D79A7D57B9B.webp'
pubDate: 2026-01-14
---
# 开启ax3000t的ssh功能
## 方案一
### 1.开启ssh
注意系统要不高于系统版本1.0.47 高于需使用官方工具降级 新生产的小米AX3000T似乎换了硬件，降级系统会变砖请看方案二
![替代文本（图片加载失败显示）](ax3000t-admin.png "可选标题")
1. 登录小米路由器后台，复制自己的stok变量 如上图stok值为96f52ad83d95e195613c5688fc22b02f
2. 打开Windows系统 win+r 打开运行 输入cmd打开终端
3. 依次输入以下代码，小米 AX3000T 解锁 SSH 命令：（整体替换为你浏览器地址栏看到的数值）
4. 输入以下代码，确认解锁 SSH：
:::caution[注意]
192.168.10.1是路由器就因为ip地址 小米默认是192.168.31.1 stok的值记得替换
:::
```bash
curl -X POST http://192.168.10.1/cgi-bin/luci/;stok=0a53ad5b8027c954d73b12ba8622668e/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20set%20ssh_en%3D1%0A"
```
```bash
curl -X POST http://192.168.10.1/cgi-bin/luci/;stok=0a53ad5b8027c954d73b12ba8622668e/api/misystem/arn_switch -d "open=1&model=1&level=%0Anvram%20commit%0A"
```
```bash
curl -X POST http://192.168.10.1/cgi-bin/luci/;stok=0a53ad5b8027c954d73b12ba8622668e/api/misystem/arn_switch -d "open=1&model=1&level=%0Ased%20-i%20's%2Fchannel%3D.*%2Fchannel%3D%22debug%22%2Fg'%20%2Fetc%2Finit.d%2Fdropbear%0A"
```
```bash
curl -X POST http://192.168.10.1/cgi-bin/luci/;stok=0a53ad5b8027c954d73b12ba8622668e/api/misystem/arn_switch -d "open=1&model=1&level=%0A%2Fetc%2Finit.d%2Fdropbear%20start%0A"
```
正常情况每条结果都会出现code：0 就是解锁ssh成功了，没有固化ssh，重启系统后可能会丢失ssh连接


