/**
 * tsc 无法解析 .astro / .svelte 源文件，barrel（index.ts）re-export 时会报 TS2307。
 * 这里提供通配环境声明，让 `pnpm type-check`（纯 tsc）能跑通；
 * 编辑器内的精确组件类型仍由 @astrojs/ts-plugin / svelte 插件提供，不受影响。
 */

declare module "*.astro" {
	import type { ComponentType } from "astro";
	const component: ComponentType<Record<string, unknown>, Record<string, unknown>>;
	export default component;
}

declare module "*.svelte" {
	import type { ComponentType } from "svelte";
	const component: ComponentType;
	export default component;
}
