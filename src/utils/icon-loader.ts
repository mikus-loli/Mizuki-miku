/**
 * Iconify 图标加载的薄适配层。
 *
 * 真正的加载逻辑只有一处：`components/misc/IconifyLoader.astro` 注入的窗口级单例
 * `window.__iconifyLoader`（由 MainGridLayout 在 head 中挂载）。
 * 这里只负责「有全局实例就交给它、没有就最小化兜底」，不再自带一份 class 实现。
 */

interface IconifyLoadOptions {
	timeout?: number;
	retryCount?: number;
}

const ICONIFY_SRC = "/cdn/iconify/iconify-icon.min.js";
const DEFAULT_TIMEOUT = 10000;

function isIconifyReady(): boolean {
	return typeof window !== "undefined" && !!window.customElements?.get("iconify-icon");
}

function whenIconifyReady(timeout: number): Promise<void> {
	if (isIconifyReady()) {
		return Promise.resolve();
	}
	return new Promise((resolve, reject) => {
		const started = Date.now();
		const tick = () => {
			if (isIconifyReady()) {
				resolve();
				return;
			}
			if (Date.now() - started > timeout) {
				reject(new Error("Iconify initialization timeout"));
				return;
			}
			setTimeout(tick, 100);
		};
		tick();
	});
}

/** 全局实例缺失时的最小兜底：插一次 script 并等待就绪，失败按原逻辑重试。 */
async function fallbackLoad(timeout: number, retryCount = 3): Promise<void> {
	for (let attempt = 1; attempt <= retryCount; attempt++) {
		if (isIconifyReady()) {
			return;
		}
		if (!document.querySelector('script[src*="iconify-icon"]')) {
			const script = document.createElement("script");
			script.src = ICONIFY_SRC;
			script.async = true;
			script.crossOrigin = "anonymous";
			document.head.appendChild(script);
		}
		try {
			await whenIconifyReady(timeout);
			return;
		} catch (error) {
			if (attempt === retryCount) {
				throw error;
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

/** 确保 Iconify 已就绪（优先走全局 loader）。 */
export async function loadIconify(options: IconifyLoadOptions = {}): Promise<void> {
	const timeout = options.timeout ?? DEFAULT_TIMEOUT;
	const loader = typeof window !== "undefined" ? window.__iconifyLoader : undefined;
	if (loader) {
		await loader.load(options);
		return;
	}
	await fallbackLoad(timeout, options.retryCount);
}

/** 预加载图标（走全局 loader 的队列）。 */
export function preloadIcons(icons: string[]): void {
	if (icons.length === 0) {
		return;
	}
	const loader = typeof window !== "undefined" ? window.__iconifyLoader : undefined;
	if (loader) {
		loader.addToPreloadQueue(icons);
		return;
	}
	void fallbackLoad(DEFAULT_TIMEOUT);
}
