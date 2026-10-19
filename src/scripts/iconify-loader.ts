/**
 * Iconify 图标的窗口级加载器（唯一实现）。
 *
 * 原先这段逻辑是 `components/misc/IconifyLoader.astro` 里 275 行 `is:inline` 脚本，
 * 每页原样输出 6KB、不可压缩、不可缓存、不进类型检查。搬进模块后由 Vite 打包：
 * 同一份代码全站共用、可缓存、可类型检查，行为保持不变。
 */

export interface IconifyLoaderOptions {
	/** 预加载的图标名列表，如 "fa7-brands:github"。 */
	preloadIcons?: string[];
	/** 单次加载超时（毫秒）。 */
	timeout?: number;
	/** 失败重试次数。 */
	retryCount?: number;
}

interface LoadOptions {
	timeout?: number;
	retryCount?: number;
}

const ICONIFY_SRC = "/cdn/iconify/iconify-icon.min.js";
const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRY_COUNT = 3;

function isIconifyReady(): boolean {
	return (
		typeof window !== "undefined" &&
		"customElements" in window &&
		customElements.get("iconify-icon") !== undefined
	);
}

export class IconifyLoader {
	isLoaded = false;
	isLoading = false;
	private loadPromise: Promise<void> | null = null;
	private readonly observers = new Set<() => void>();
	private readonly preloadQueue = new Set<string>();
	private readonly defaultTimeout: number;
	private readonly defaultRetryCount: number;

	constructor(options: LoadOptions = {}) {
		this.defaultTimeout = options.timeout ?? DEFAULT_TIMEOUT;
		this.defaultRetryCount = options.retryCount ?? DEFAULT_RETRY_COUNT;
	}

	async load(options: LoadOptions = {}): Promise<void> {
		const loadTimeout = options.timeout ?? this.defaultTimeout;
		const maxRetries = options.retryCount ?? this.defaultRetryCount;

		if (this.isLoaded) {
			return;
		}
		if (this.isLoading && this.loadPromise) {
			return this.loadPromise;
		}

		this.isLoading = true;
		this.loadPromise = this.loadWithRetry(loadTimeout, maxRetries);

		try {
			await this.loadPromise;
			this.isLoaded = true;
			this.notifyObservers();
			await this.processPreloadQueue();
		} catch (error) {
			console.error("Failed to load Iconify:", error);
			throw error;
		} finally {
			this.isLoading = false;
		}
	}

	private async loadWithRetry(timeout: number, retryCount: number): Promise<void> {
		for (let attempt = 1; attempt <= retryCount; attempt++) {
			try {
				await this.loadScript(timeout);
				return;
			} catch (error) {
				console.warn(`Iconify load attempt ${attempt} failed:`, error);
				if (attempt === retryCount) {
					throw new Error(`Failed to load Iconify after ${retryCount} attempts`);
				}
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
	}

	private loadScript(timeout: number): Promise<void> {
		return new Promise((resolve, reject) => {
			if (isIconifyReady()) {
				resolve();
				return;
			}

			const existingScript = document.querySelector('script[src*="iconify-icon"]');
			if (existingScript) {
				this.waitForIconifyReady().then(resolve).catch(reject);
				return;
			}

			const script = document.createElement("script");
			script.src = ICONIFY_SRC;
			script.async = true;
			script.crossOrigin = "anonymous";

			const timeoutId = setTimeout(() => {
				script.remove();
				reject(new Error("Script load timeout"));
			}, timeout);

			script.onload = () => {
				clearTimeout(timeoutId);
				this.waitForIconifyReady().then(resolve).catch(reject);
			};

			script.onerror = () => {
				clearTimeout(timeoutId);
				script.remove();
				reject(new Error("Script load error"));
			};

			document.head.appendChild(script);
		});
	}

	private waitForIconifyReady(maxWait = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			const checkReady = () => {
				if (isIconifyReady()) {
					resolve();
					return;
				}
				if (Date.now() - startTime > maxWait) {
					reject(new Error("Iconify initialization timeout"));
					return;
				}
				setTimeout(checkReady, 50);
			};
			checkReady();
		});
	}

	/** 加载完成后回调；已加载则立即执行。 */
	onLoad(callback: () => void): void {
		if (this.isLoaded) {
			callback();
			return;
		}
		this.observers.add(callback);
	}

	private notifyObservers(): void {
		this.observers.forEach((callback) => {
			try {
				callback();
			} catch (error) {
				console.error("Error in icon load observer:", error);
			}
		});
		this.observers.clear();
	}

	addToPreloadQueue(icons: string | string[]): void {
		if (Array.isArray(icons)) {
			icons.forEach((icon) => {
				this.preloadQueue.add(icon);
			});
		} else {
			this.preloadQueue.add(icons);
		}

		if (this.isLoaded) {
			void this.processPreloadQueue();
		}
	}

	private async processPreloadQueue(): Promise<void> {
		if (this.preloadQueue.size === 0) {
			return;
		}
		const iconsToLoad = Array.from(this.preloadQueue);
		this.preloadQueue.clear();
		await this.preloadIcons(iconsToLoad);
	}

	/** 用离屏临时元素把图标预取进浏览器缓存。 */
	async preloadIcons(icons: string[]): Promise<void> {
		if (!this.isLoaded || icons.length === 0) {
			return;
		}

		return new Promise((resolve) => {
			let loadedCount = 0;
			const totalIcons = icons.length;
			const tempElements: HTMLElement[] = [];

			const cleanup = () => {
				tempElements.forEach((el) => {
					el.parentNode?.removeChild(el);
				});
			};

			const checkComplete = () => {
				loadedCount++;
				if (loadedCount >= totalIcons) {
					cleanup();
					resolve();
				}
			};

			icons.forEach((icon) => {
				const tempIcon = document.createElement("iconify-icon");
				tempIcon.setAttribute("icon", icon);
				tempIcon.style.cssText =
					"position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
				tempIcon.addEventListener("load", checkComplete);
				tempIcon.addEventListener("error", checkComplete);
				tempElements.push(tempIcon);
				document.body.appendChild(tempIcon);
			});

			setTimeout(() => {
				cleanup();
				resolve();
			}, 3000);
		});
	}
}

/**
 * 初始化全局单例并挂载 window 便捷方法。
 * 幂等：`window.__iconifyLoaderInitialized` 已为 true 时直接返回。
 */
export function initIconifyLoader(options: IconifyLoaderOptions = {}): void {
	if (typeof window === "undefined" || window.__iconifyLoaderInitialized) {
		return;
	}
	window.__iconifyLoaderInitialized = true;

	window.IconifyProviders = {
		"": { resources: ["/cdn/iconify/api"] },
	};

	const loader = new IconifyLoader({
		timeout: options.timeout,
		retryCount: options.retryCount,
	});
	window.__iconifyLoader = loader;

	loader.load().catch((error) => {
		console.error("Failed to initialize Iconify:", error);
	});

	if (options.preloadIcons && options.preloadIcons.length > 0) {
		loader.addToPreloadQueue(options.preloadIcons);
	}

	window.loadIconify = () => loader.load();
	window.preloadIcons = (icons: string[]) => loader.addToPreloadQueue(icons);
	window.onIconifyReady = (callback: () => void) => loader.onLoad(callback);

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden && !loader.isLoaded) {
			loader.load().catch(console.error);
		}
	});
}
