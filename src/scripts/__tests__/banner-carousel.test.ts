import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

/**
 * Banner 轮播帧构建回归测试
 *
 * 背景：Banner 轮播用 <template> 元素存后续帧。
 * 之前把 innerHTML 方式改为 cloneNode(true) 直接克隆 <template> 元素——
 * template 内容在 document fragment 中，直接克隆的元素不会渲染内容，
 * 导致"只显示第 1 张，其他帧空白"的 bug（PR #5 修复）。
 * 本测试锁定正确用法：template 必须克隆 .content。
 */

function buildFrames(useContentClone: boolean) {
	const dom = new JSDOM(
		`<div id="carousel">
			<div class="banner-image-slot-mobile"><img src="a.jpg" /></div>
			<template class="banner-tpl-mobile"><img src="b.jpg" /></template>
			<template class="banner-tpl-mobile"><img src="c.jpg" /></template>
		</div>`,
	);
	const container = dom.window.document.getElementById("carousel")!;
	const initialSlot = container.querySelector(".banner-image-slot-mobile")!;
	const templates = container.querySelectorAll(".banner-tpl-mobile");

	const sourceFrames = [initialSlot].concat(Array.from(templates));
	initialSlot.parentNode!.removeChild(initialSlot);
	templates.forEach((t) => t.parentNode!.removeChild(t));

	const frameElements: Element[] = [];
	for (const src of sourceFrames) {
		if (useContentClone) {
			// 修复后：template 取 content 克隆，普通元素直接克隆
			const el = dom.window.document.createElement("div");
			if (src.tagName === "TEMPLATE") {
				el.appendChild(src.content.cloneNode(true));
			} else {
				el.appendChild(src.cloneNode(true));
			}
			container.appendChild(el);
			frameElements.push(el);
		} else {
			// 修复前（bug）：直接克隆整个元素（template 内容不渲染）
			const el = src.cloneNode(true) as Element;
			container.appendChild(el);
			frameElements.push(el);
		}
	}
	return frameElements.map((el) => el.querySelectorAll("img").length);
}

describe("Banner 轮播帧构建", () => {
	it("修复后：每帧都包含 img（初始帧 + template 帧）", () => {
		const imgCounts = buildFrames(true);
		expect(imgCounts).toEqual([1, 1, 1]);
	});

	it("回归保护：直接克隆 template 元素会导致帧空白", () => {
		// 锁定历史 bug 的行为，防止未来无意识回退
		const imgCounts = buildFrames(false);
		expect(imgCounts).toEqual([1, 0, 0]);
	});
});
