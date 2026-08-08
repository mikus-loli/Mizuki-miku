import { describe, expect, it } from "vitest";

import {
	getCategoryUrl,
	getPostUrl,
	getPostUrlByAlias,
	getPostUrlBySlug,
	getTagUrl,
	pathsEqual,
	removeFileExtension,
} from "../url-utils";

describe("removeFileExtension", () => {
	it("移除 .md 扩展名", () => {
		expect(removeFileExtension("posts/hello.md")).toBe("posts/hello");
	});

	it("移除 .mdx 扩展名（不区分大小写）", () => {
		expect(removeFileExtension("posts/hello.MDX")).toBe("posts/hello");
	});

	it("无扩展名时原样返回", () => {
		expect(removeFileExtension("posts/hello")).toBe("posts/hello");
	});
});

describe("pathsEqual", () => {
	it("忽略首尾斜杠和大小写", () => {
		expect(pathsEqual("/About/", "about")).toBe(true);
		expect(pathsEqual("/posts/hello/", "/posts/hello")).toBe(true);
	});

	it("不同路径返回 false", () => {
		expect(pathsEqual("/about", "/archive")).toBe(false);
	});
});

describe("getPostUrlBySlug / getPostUrlByAlias", () => {
	it("slug 路径在 /posts/ 下", () => {
		// content.config.ts 的 glob base 是 ./src/content/posts，id 不带 posts/ 前缀
		expect(getPostUrlBySlug("hello.md")).toBe("/posts/hello/");
	});

	it("子目录 slug 保留目录结构", () => {
		expect(getPostUrlBySlug("tutorial/guide.md")).toBe(
			"/posts/tutorial/guide/",
		);
	});

	it("alias 清理开头斜杠后拼接到 /posts/", () => {
		expect(getPostUrlByAlias("//my-alias")).toBe("/posts/my-alias/");
	});
});

describe("getTagUrl", () => {
	it("空 tag 返回归档页", () => {
		expect(getTagUrl("")).toBe("/archive/");
	});

	it("tag 进行 URL 编码", () => {
		expect(getTagUrl("AI 编程")).toBe("/archive/?tag=AI%20%E7%BC%96%E7%A8%8B");
	});
});

describe("getCategoryUrl", () => {
	it("null 分类返回未分类过滤", () => {
		expect(getCategoryUrl(null)).toBe("/archive/?uncategorized=true");
	});

	it("分类拼接到归档页 query", () => {
		expect(getCategoryUrl("技术")).toBe("/archive/?category=%E6%8A%80%E6%9C%AF");
	});
});

describe("getPostUrl 优先级", () => {
	// content.config.ts 的 glob base 是 ./src/content/posts，id 不带 posts/ 前缀
	const base = { id: "hello.md", data: {} };

	it("自定义 permalink 优先（根目录）", () => {
		const post = { ...base, data: { permalink: "/custom-path/" } };
		expect(getPostUrl(post)).toBe("/custom-path/");
	});

	it("alias 在 /posts/ 下", () => {
		const post = { ...base, data: { alias: "my-alias" } };
		expect(getPostUrl(post)).toBe("/posts/my-alias/");
	});

	it("无特殊配置时用默认 slug", () => {
		const post = { ...base, data: {} };
		expect(getPostUrl(post)).toBe("/posts/hello/");
	});
});
