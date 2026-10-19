/**
 * icon-loader 行为契约：
 * 1) 有全局 loader（IconifyLoader.astro 注入的窗口单例）时，必须委托给它，不自己插 script
 * 2) 没有全局 loader 时才兜底注入 CDN script，且重复调用不会插第二个
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { loadIconify } from "../icon-loader";

const CDN_SRC = "/cdn/iconify/iconify-icon.min.js";

afterEach(() => {
	vi.restoreAllMocks();
	delete window.__iconifyLoader;
	for (const el of document.querySelectorAll('script[src*="iconify-icon"]')) {
		el.remove();
	}
});

describe("loadIconify", () => {
	it("存在全局 loader 时委托给它", async () => {
		const load = vi.fn().mockResolvedValue(undefined);
		window.__iconifyLoader = {
			isLoaded: false,
			isLoading: false,
			load,
			onLoad: vi.fn(),
			addToPreloadQueue: vi.fn(),
			preloadIcons: vi.fn(),
		};

		await loadIconify({ timeout: 1234 });

		expect(load).toHaveBeenCalledTimes(1);
		expect(load).toHaveBeenCalledWith({ timeout: 1234 });
		expect(document.querySelectorAll('script[src*="iconify-icon"]')).toHaveLength(0);
	});

	it("没有全局 loader 时注入 CDN 脚本，且超时后抛错", async () => {
		await expect(loadIconify({ timeout: 20, retryCount: 1 })).rejects.toThrow();

		const scripts = document.querySelectorAll('script[src*="iconify-icon"]');
		expect(scripts).toHaveLength(1);
		expect(scripts[0].getAttribute("src")).toBe(CDN_SRC);
	});

	it("重复调用不会重复注入脚本", async () => {
		await expect(loadIconify({ timeout: 20, retryCount: 1 })).rejects.toThrow();
		await expect(loadIconify({ timeout: 20, retryCount: 1 })).rejects.toThrow();

		expect(document.querySelectorAll('script[src*="iconify-icon"]')).toHaveLength(1);
	});
});
