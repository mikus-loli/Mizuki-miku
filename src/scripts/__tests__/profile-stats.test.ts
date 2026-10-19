/**
 * Profile 站点统计行为契约：
 * 1) 取到数据 → 三个实例的 .site-stats-display 都写入同一段文案、容器取消 hidden
 * 2) 数据为 0 → 保持隐藏
 * 3) 多实例只请求一次（window.__siteStatsFetching 锁）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initProfileStats } from "../profile-stats";

interface Stats {
	pageviews?: number;
	visits?: number;
}

function mountProfiles(count: number): void {
	document.body.innerHTML = "";
	for (let i = 0; i < count; i++) {
		document.body.insertAdjacentHTML(
			"beforeend",
			`<div class="umami-stats-container hidden" data-profile-stats
				data-stats-page-views="浏览量" data-stats-visits="访问次数">
				<span class="site-stats-display">统计加载中...</span>
			</div>`,
		);
	}
}

function setStats(getSiteStats: () => Promise<Stats>): ReturnType<typeof vi.fn> {
	const spy = vi.fn(getSiteStats);
	(window as unknown as { oddmisc?: { getSiteStats: typeof spy } }).oddmisc = {
		getSiteStats: spy,
	};
	return spy;
}

/** 让 fetchSiteStats 里的 microtask / 500ms 重试跑完 */
async function flush(): Promise<void> {
	for (let i = 0; i < 5; i++) {
		await Promise.resolve();
	}
}

beforeEach(() => {
	delete window.__siteStatsFetching;
	mountProfiles(3);
});

afterEach(() => {
	delete window.__siteStatsFetching;
	delete (window as unknown as { oddmisc?: unknown }).oddmisc;
	document.body.innerHTML = "";
});

describe("initProfileStats", () => {
	it("取到数据后三个实例都写入文案并显示", async () => {
		const spy = setStats(async () => ({ pageviews: 1234, visits: 56 }));

		initProfileStats();
		await flush();

		expect(spy).toHaveBeenCalledTimes(1);
		const texts = Array.from(document.querySelectorAll(".site-stats-display")).map(
			(el) => el.textContent,
		);
		expect(texts).toEqual(Array(3).fill("浏览量 1234 · 访问次数 56"));
		for (const container of document.querySelectorAll(".umami-stats-container")) {
			expect(container.classList.contains("hidden")).toBe(false);
		}
	});

	it("数据为 0 时保持隐藏", async () => {
		setStats(async () => ({ pageviews: 0, visits: 0 }));

		initProfileStats();
		await flush();

		for (const container of document.querySelectorAll(".umami-stats-container")) {
			expect(container.classList.contains("hidden")).toBe(true);
		}
	});

	it("重复初始化只请求一次", async () => {
		const spy = setStats(async () => ({ pageviews: 1, visits: 1 }));

		initProfileStats();
		initProfileStats();
		initProfileStats();
		await flush();

		expect(spy).toHaveBeenCalledTimes(1);
	});
});
