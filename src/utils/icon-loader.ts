interface IconifyLoadOptions {
	timeout?: number;
	retryCount?: number;
	retryDelay?: number;
}

interface GlobalIconifyLoader {
	isLoaded: boolean;
	isLoading: boolean;
	load: (options?: IconifyLoadOptions) => Promise<void>;
	onLoad: (callback: () => void) => void;
	addToPreloadQueue: (icons: string | string[]) => void;
	preloadIcons: (icons: string[]) => Promise<void>;
}

function getGlobalLoader(): GlobalIconifyLoader | null {
	if (typeof window !== "undefined" && window.__iconifyLoader) {
		return window.__iconifyLoader;
	}
	return null;
}

class IconLoader {
	private static instance: IconLoader;
	private observers = new Set<() => void>();

	private constructor() {}

	static getInstance(): IconLoader {
		if (!IconLoader.instance) {
			IconLoader.instance = new IconLoader();
		}
		return IconLoader.instance;
	}

	async loadIconify(options: IconifyLoadOptions = {}): Promise<void> {
		const globalLoader = getGlobalLoader();
		if (globalLoader) {
			await globalLoader.load(options);
			this.notifyObservers();
			return;
		}

		if (typeof window !== "undefined" && "customElements" in window && customElements.get("iconify-icon")) {
			return;
		}

		console.warn("Iconify global loader not found, attempting direct load");
		await this.directLoad(options);
		this.notifyObservers();
	}

	private async directLoad(options: IconifyLoadOptions = {}): Promise<void> {
		const { timeout = 10000, retryCount = 3, retryDelay = 1000 } = options;

		for (let attempt = 1; attempt <= retryCount; attempt++) {
			try {
				await this.loadScript(timeout);
				return;
			} catch (error) {
				console.warn(`Iconify load attempt ${attempt} failed:`, error);
				if (attempt === retryCount) {
					throw new Error(`Failed to load Iconify after ${retryCount} attempts`);
				}
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	private loadScript(timeout: number): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof window !== "undefined" && "customElements" in window && customElements.get("iconify-icon")) {
				resolve();
				return;
			}

			const existingScript = document.querySelector('script[src*="iconify-icon"]');
			if (existingScript) {
				this.waitForIconifyReady().then(resolve).catch(reject);
				return;
			}

			const script = document.createElement("script");
			script.src = "/cdn/iconify/iconify-icon.min.js";
			script.async = true;

			const timeoutId = setTimeout(() => {
				script.remove();
				reject(new Error("Iconify script load timeout"));
			}, timeout);

			script.onload = () => {
				clearTimeout(timeoutId);
				this.waitForIconifyReady().then(resolve).catch(reject);
			};

			script.onerror = () => {
				clearTimeout(timeoutId);
				script.remove();
				reject(new Error("Failed to load Iconify script"));
			};

			document.head.appendChild(script);
		});
	}

	private waitForIconifyReady(maxWait = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			const checkReady = () => {
				if (typeof window !== "undefined" && "customElements" in window && customElements.get("iconify-icon")) {
					resolve();
					return;
				}
				if (Date.now() - startTime > maxWait) {
					reject(new Error("Iconify initialization timeout"));
					return;
				}
				setTimeout(checkReady, 100);
			};
			checkReady();
		});
	}

	onLoad(callback: () => void): void {
		const globalLoader = getGlobalLoader();
		if (globalLoader) {
			globalLoader.onLoad(callback);
			return;
		}
		if (typeof window !== "undefined" && "customElements" in window && customElements.get("iconify-icon")) {
			callback();
		} else {
			this.observers.add(callback);
		}
	}

	offLoad(callback: () => void): void {
		this.observers.delete(callback);
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

	getLoadState(): { isLoaded: boolean; isLoading: boolean } {
		const globalLoader = getGlobalLoader();
		if (globalLoader) {
			return { isLoaded: globalLoader.isLoaded, isLoading: globalLoader.isLoading };
		}
		const isLoaded = typeof window !== "undefined" && "customElements" in window && customElements.get("iconify-icon") !== undefined;
		return { isLoaded, isLoading: false };
	}

	async preloadIcons(icons: string[]): Promise<void> {
		const globalLoader = getGlobalLoader();
		if (globalLoader) {
			globalLoader.addToPreloadQueue(icons);
			return;
		}

		if (icons.length === 0) {return;}

		return new Promise((resolve) => {
			let loadedCount = 0;
			const totalIcons = icons.length;
			const tempElements: HTMLElement[] = [];

			const cleanup = () => {
				tempElements.forEach((el) => {
					if (el.parentNode) {el.parentNode.removeChild(el);}
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
				tempIcon.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
				tempIcon.addEventListener("load", checkComplete);
				tempIcon.addEventListener("error", checkComplete);
				tempElements.push(tempIcon);
				document.body.appendChild(tempIcon);
			});

			setTimeout(() => {
				cleanup();
				resolve();
			}, 5000);
		});
	}
}

export const iconLoader = IconLoader.getInstance();

export const loadIconify = (options?: IconifyLoadOptions) =>
	iconLoader.loadIconify(options);
export const preloadIcons = (icons: string[]) => iconLoader.preloadIcons(icons);
export const onIconsReady = (callback: () => void) =>
	iconLoader.onLoad(callback);
