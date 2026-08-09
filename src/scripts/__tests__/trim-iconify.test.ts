import { describe, expect, it } from "vitest";

import { collectNeeded } from "../../../scripts/trim-iconify.mjs";

describe("collectNeeded（Iconify 图标裁剪 alias 递归解析）", () => {
	it("直接引用的图标被保留", () => {
		const full = {
			icons: { search: {}, home: {} },
			aliases: {},
		};
		const needed = collectNeeded(full, new Set(["search"]));
		expect([...needed]).toEqual(["search"]);
	});

	it("alias 指向的父图标被递归保留", () => {
		const full = {
			icons: { volume: {}, volume_off: {}, "volume-off-rounded": {} },
			aliases: {
				"volume-off-rounded": { parent: "volume-off" },
				"volume-off": { parent: "volume" },
			},
		};
		const needed = collectNeeded(
			full,
			new Set(["volume-off-rounded"]),
		);
		expect(needed.has("volume-off-rounded")).toBe(true);
		expect(needed.has("volume-off")).toBe(true); // 父图标（alias）
		expect(needed.has("volume")).toBe(true); // 递归到根图标
	});

	it("不相关图标不被保留", () => {
		const full = {
			icons: { search: {}, home: {}, trash: {} },
			aliases: { "search-circle": { parent: "search" } },
		};
		const needed = collectNeeded(full, new Set(["home"]));
		expect(needed.has("home")).toBe(true);
		expect(needed.has("search")).toBe(false);
		expect(needed.has("trash")).toBe(false);
	});

	it("无 aliases 时正常工作", () => {
		const full = { icons: { a: {}, b: {} } };
		const needed = collectNeeded(full, new Set(["b"]));
		expect([...needed]).toEqual(["b"]);
	});
});
