/**
 * 把 @iconify/svelte 的图标数据源指到同源镜像（/cdn/iconify/api）。
 *
 * 背景：站里有两套图标系统 —— .astro 组件用 <iconify-icon> 自定义元素（构建期
 * 生成的 IconifyProviders 已指向本地镜像），Svelte 组件用 @iconify/svelte，
 * 它内置的 @iconify/iconify 核心默认打 https://api.iconify.design，于是在
 * 首屏 1.4s 左右并发 2-4 个跨洋请求，国内网络下经常拖到 2-3 秒，图标先是空白。
 *
 * 镜像文件由 scripts/trim-iconify.mjs 在构建前按 src 里的实际引用裁剪，
 * 只含用得到的图标，体积几十 KB，命中 CDN 后基本零延迟。
 */
import { addAPIProvider } from "@iconify/svelte/dist/functions.js";

addAPIProvider("", { resources: ["/cdn/iconify/api"] });
