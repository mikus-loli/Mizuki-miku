/**
 * 侧边栏 Profile 卡片的站点统计（Umami / oddmisc）。
 *
 * 原先这段逻辑是 `widgets/profile/Profile.astro` 里的 is:inline 脚本，而首页会渲染
 * 3 个 Profile 实例 → 同一段 1.5KB 脚本被原样输出 3 次（靠 `window.__siteStatsFetching`
 * 去重只请求一次，另两份纯属字节浪费）。改成打包模块后每页只出现一份、可缓存。
 *
 * 文案通过 DOM data 属性传入（i18n 是构建期才知道的，不能再走 define:vars）。
 */

interface SiteStats {
	pageviews?: number;
	visits?: number;
}

interface OddmiscApi {
	getSiteStats: () => Promise<SiteStats>;
}

interface StatsLabels {
	pageViews: string;
	visits: string;
}

const CONTAINER_SELECTOR = ".umami-stats-container";
const DISPLAY_SELECTOR = ".site-stats-display";

function readLabels(): StatsLabels {
	const host = document.querySelector<HTMLElement>("[data-profile-stats]");
	return {
		pageViews: host?.dataset.statsPageViews ?? "",
		visits: host?.dataset.statsVisits ?? "",
	};
}

function getOddmisc(): OddmiscApi | undefined {
	return (window as unknown as { oddmisc?: OddmiscApi }).oddmisc;
}

function hideStats(): void {
	document.querySelectorAll(CONTAINER_SELECTOR).forEach((container) => {
		container.classList.add("hidden");
	});
}

function renderStats(labels: StatsLabels, stats: SiteStats): void {
	const pageViews = stats.pageviews ?? 0;
	const visits = stats.visits ?? 0;

	if (pageViews === 0 && visits === 0) {
		hideStats();
		return;
	}

	document.querySelectorAll(CONTAINER_SELECTOR).forEach((container) => {
		container.classList.remove("hidden");
	});
	const text = `${labels.pageViews} ${pageViews} · ${labels.visits} ${visits}`;
	document.querySelectorAll(DISPLAY_SELECTOR).forEach((el) => {
		el.textContent = text;
	});
}

async function fetchSiteStats(labels: StatsLabels, isRetry = false): Promise<void> {
	const api = getOddmisc();

	// oddmisc 尚未加载：等 500ms 再试一次，仍没有就收起统计
	if (!api) {
		if (!isRetry) {
			setTimeout(() => {
				void fetchSiteStats(labels, true);
			}, 500);
		} else {
			hideStats();
		}
		return;
	}

	try {
		renderStats(labels, await api.getSiteStats());
	} catch (error) {
		console.error("Error fetching site stats:", error);
		hideStats();
	}
}

/**
 * 初始化站点统计展示。幂等：同一页多个 Profile 实例只请求一次。
 */
export function initProfileStats(): void {
	if (typeof window === "undefined") {
		return;
	}
	// 与旧实现保持同一把锁，避免和其他脚本重复请求
	if (window.__siteStatsFetching) {
		return;
	}
	window.__siteStatsFetching = true;

	const labels = readLabels();
	if (document.readyState === "loading") {
		document.addEventListener(
			"DOMContentLoaded",
			() => {
				void fetchSiteStats(labels);
			},
			{ once: true },
		);
		return;
	}
	void fetchSiteStats(labels);
}
