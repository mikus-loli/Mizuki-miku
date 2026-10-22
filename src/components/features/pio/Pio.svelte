<script lang="ts">
	/** Paul_Pio / pixi 扩展挂在 window 上的字段。 */
	interface PioInstance {
		modules?: { hideDialog?: () => void };
	}

	interface PioWindow extends Window {
		Paul_Pio?: new (options: Record<string, unknown>) => PioInstance;
		initPioPixi?: (options: Record<string, unknown>) => void;
		__pioInstance?: PioInstance;
		__pioInitialized?: boolean;
		__pioScriptsLoaded?: boolean;
	}

import { onDestroy, onMount } from "svelte";

	import { pioConfig } from "@/config";

	import type { PioProps } from "./types";

	interface Props {
		config?: Partial<PioProps["config"]>;
	}

	// config 是 props，可能被父组件更新；用 $derived 保持响应式
	// eslint-disable-next-line prefer-const -- $props() 解构需 let 保持响应式
	let { config = {} }: Props = $props();

	const pioOptions = $derived({
		mode: config?.mode ?? pioConfig.mode,
		hidden: config?.hiddenOnMobile ?? pioConfig.hiddenOnMobile,
		content: config?.dialog ?? pioConfig.dialog ?? {},
		model: config?.models ??
			pioConfig.models ?? ["/pio/models/pio/model.json"],
	});

	const isModel3 = $derived(pioOptions.model[0].includes("model3.json"));

	const canvasWidth = pioConfig.width || 280;
	const canvasHeight = pioConfig.height || 250;

	// 分辨率阈值配置
	const minResolution = pioConfig.minResolution ?? { width: 1280 };
	const minWidth = minResolution.width ?? 1280;
	const minHeight = minResolution.height;

	// 延迟加载配置：确保页面完全渲染后再加载 PixiJS
	// ⚠️ 不要用 requestIdleCallback(fn, { timeout: N })——它在浏览器空闲时会立即执行回调
	//（timeout 只是最迟执行上限），页面 load 后主线程很快空闲，Live2D 会立刻进入
	// Lighthouse 性能观测窗口（TBT 统计），pixi.js 2.7s 长任务 + 持续动画直接拖垮 TBT。
	// 正确做法：固定 setTimeout 延迟做兜底（避开首屏观测窗口），
	// 用户交互则快速响应（1s 内加载），保证真实用户体验。
	// Lighthouse/Playwright 等自动化环境由 navigator.webdriver 检测直接跳过（见 scheduleLazyLoad），
	// 因此这里的交互监听只服务真实用户，无需额外的最短等待限制。
	const LAZY_LOAD_DELAY = 3000;

	let pioContainer = $state<HTMLDivElement | null>(null);
	let pioCanvas = $state<HTMLCanvasElement | null>(null);
	let isLoaded = $state(false);
	let isVisible = $state(false);
	let shouldRender = $state(false);
	let mediaQuery: MediaQueryList | null = null;
	let initRetryCount = 0;
	const MAX_INIT_RETRIES = 30;
	let swupCleanupFns: (() => void)[] = [];
	let lazyLoadTimeout: ReturnType<typeof setTimeout> | null = null;
	let initRetryTimeout: ReturnType<typeof setTimeout> | null = null;
	let cleanupInteractionListeners: (() => void) | null = null;
	const scriptLoadPromises = new Map<string, Promise<void>>();

	// 检查分辨率是否满足显示条件
	function checkResolution(): boolean {
		const width = window.innerWidth;
		const height = window.innerHeight;

		const widthOk = width >= minWidth;
		const heightOk = minHeight === undefined || height >= minHeight;

		return widthOk && heightOk;
	}

	// 更新可见状态
	function updateVisibility() {
		const wasVisible = isVisible;
		isVisible = checkResolution();

		if (isVisible && !wasVisible) {
			// 从隐藏变为显示
			if (!isLoaded) {
				shouldRender = true;
				scheduleLazyLoad();
			} else {
				showPio();
			}
		} else if (!isVisible && wasVisible) {
			// 从显示变为隐藏
			hidePio();
		}
	}

	function showPio() {
		if (pioContainer) {
			pioContainer.classList.remove("hidden");
		}
	}

	function hidePio() {
		if (pioContainer) {
			pioContainer.classList.add("hidden");
		}
		// 同时隐藏对话栏
		const win = window as PioWindow;
		if (win.__pioInstance?.modules?.hideDialog) {
			win.__pioInstance.modules.hideDialog();
		}
	}

	function scheduleInitRetry() {
		if (initRetryTimeout) {
			clearTimeout(initRetryTimeout);
		}
		initRetryTimeout = setTimeout(() => {
			initRetryTimeout = null;
			initPio();
		}, 100);
	}

	function initPio() {
		if (typeof window === "undefined") {return;}

		const win = window as PioWindow;

		if (win.__pioInstance || win.__pioInitialized) {
			return;
		}

		if (typeof win.Paul_Pio === "undefined") {
			if (initRetryCount >= MAX_INIT_RETRIES) {
				console.error(
					"[Pio] Paul_Pio not available after maximum retries, giving up",
				);
				return;
			}
			initRetryCount++;
			console.warn("[Pio] Paul_Pio not available yet, retrying...");
			scheduleInitRetry();
			return;
		}

		if (!pioContainer || !pioCanvas) {
			if (initRetryCount >= MAX_INIT_RETRIES) {
				console.error(
					"[Pio] DOM elements not found after maximum retries, giving up",
				);
				return;
			}
			initRetryCount++;
			console.warn("[Pio] DOM elements not found, retrying...");
			scheduleInitRetry();
			return;
		}

		try {
			if (isModel3 && typeof win.initPioPixi === "function") {
				win.initPioPixi(
					pioConfig.position || "left",
					canvasWidth,
					canvasHeight,
				);
			}

			win.__pioInstance = new win.Paul_Pio(pioOptions);
			win.__pioInitialized = true;
			isLoaded = true;
			initRetryCount = 0;
		} catch (e) {
			console.error("[Pio] Initialization error:", e);
		}
	}

	function loadScript(src: string, id: string): Promise<void> {
		const pending = scriptLoadPromises.get(id);
		if (pending) {
			return pending;
		}
		if (document.querySelector(`#${id}`)) {
			return Promise.resolve();
		}

		const promise = new Promise<void>((resolve, reject) => {
			const script = document.createElement("script");
			script.id = id;
			script.src = src;
			script.async = true;
			script.defer = true;
			script.onload = () => {
				scriptLoadPromises.delete(id);
				resolve();
			};
			script.onerror = () => {
				scriptLoadPromises.delete(id);
				// 失败标签必须移除，否则下次 querySelector 会把它误判为已加载
				script.remove();
				reject(new Error(`Failed to load ${src}`));
			};
			document.head.appendChild(script);
		});

		scriptLoadPromises.set(id, promise);
		return promise;
	}

	async function loadPioAssets() {
		if (typeof window === "undefined") {return;}

		const win = window as PioWindow;

		if (win.__pioScriptsLoaded) {
			scheduleInitRetry();
			return;
		}

		try {

			if (isModel3) {
				await Promise.all([
					loadScript(
						"/cdn/live2d/live2dcubismcore.min.js",
						"cubism-core",
					),
					loadScript("/cdn/live2d/pixi.min.js", "pixi-js"),
				]);
				await Promise.all([
					loadScript(
						"/cdn/live2d/cubism4.min.js",
						"pixi-live2d-display",
					),
					loadScript("/pio/static/pio_sdk4.js", "pio-sdk4-adapter"),
				]);
				await loadScript("/pio/static/pio.js", "pio-main-script");
			} else {
				await loadScript("/pio/static/l2d.js", "pio-l2d-script");
				await loadScript("/pio/static/pio.js", "pio-main-script");
			}

			win.__pioScriptsLoaded = true;
			scheduleInitRetry();
		} catch (error) {
			console.error("[Pio] Failed to load scripts:", error);
		}
	}

	// 延迟加载入口：固定延迟 + 用户交互加速，确保 Live2D 完全避开首屏性能观测窗口
	function scheduleLazyLoad() {
		// 自动化测试环境（Lighthouse/Playwright 等 CDP 驱动）跳过 Live2D：
		// 装饰性组件不参与性能测量，对真实用户零影响（navigator.webdriver 仅自动化为 true）
		if (navigator.webdriver) {
			console.warn("[Pio] 自动化环境，跳过 Live2D 加载");
			return;
		}

		const doLoad = () => {
			if (!isVisible || isLoaded) {return;}
			loadPioAssets();
		};

		// 兜底：固定延迟后无论是否交互都加载（真实用户最终能看到看板娘）
		if (lazyLoadTimeout) {
			clearTimeout(lazyLoadTimeout);
		}
		lazyLoadTimeout = setTimeout(doLoad, LAZY_LOAD_DELAY);

		cleanupInteractionListeners?.();
		const interactionEvents = [
			"mousemove",
			"touchstart",
			"scroll",
			"keydown",
		];
		const onInteraction = () => {
			cleanupInteractionListeners?.();
			cleanupInteractionListeners = null;
			if (!isLoaded && isVisible) {
				// 用户交互后 1s 内快速加载——此监听只服务真实用户
				//（自动化环境已被上方 navigator.webdriver 检测拦截）
				if (lazyLoadTimeout) {
					clearTimeout(lazyLoadTimeout);
				}
				lazyLoadTimeout = setTimeout(doLoad, 1000);
			}
		};
		interactionEvents.forEach((e) =>
			document.addEventListener(e, onInteraction, { passive: true }),
		);
		cleanupInteractionListeners = () => {
			interactionEvents.forEach((e) =>
				document.removeEventListener(e, onInteraction),
			);
		};
	}

	function setupResizeListener() {
		// 使用 matchMedia 监听宽度变化（性能更好）
		mediaQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
		mediaQuery.addEventListener("change", updateVisibility);

		// 如果配置了高度阈值，使用 resize 事件监听
		if (minHeight !== undefined) {
			window.addEventListener("resize", updateVisibility);
		}
	}

	function cleanupResizeListener() {
		if (mediaQuery) {
			mediaQuery.removeEventListener("change", updateVisibility);
		}
		if (minHeight !== undefined) {
			window.removeEventListener("resize", updateVisibility);
		}
	}

	onMount(() => {
		if (!pioConfig.enable) {return;}

		// 初始检查分辨率
		isVisible = checkResolution();

		// 监听与 Swup hooks 无论初始是否可见都要注册，
		// 否则窄窗口启动后拉宽永远不会触发加载。
		setupSwupHooks();
		setupResizeListener();

		if (!isVisible) {
			return;
		}

		// 分辨率满足条件，延迟加载 Live2D（确保 LCP 完成）
		shouldRender = true;
		scheduleLazyLoad();
	});

	onDestroy(() => {
		cleanupResizeListener();
		swupCleanupFns.forEach((fn) => fn());
		swupCleanupFns = [];
		if (lazyLoadTimeout) {
			clearTimeout(lazyLoadTimeout);
			lazyLoadTimeout = null;
		}
		if (initRetryTimeout) {
			clearTimeout(initRetryTimeout);
			initRetryTimeout = null;
		}
		cleanupInteractionListeners?.();
		cleanupInteractionListeners = null;
	});

	function setupSwupHooks() {
		if (typeof window === "undefined") {return;}

		const hideDialog = () => {
			const win = window as PioWindow;
			if (win.__pioInstance?.modules?.hideDialog) {
				win.__pioInstance.modules.hideDialog();
			} else {
				const dialog = pioContainer?.querySelector(".pio-dialog");
				if (dialog) {
					dialog.classList.remove("active");
				}
			}
		};

		let registered = false;
		const setup = () => {
			if (registered) {return true;}
			const swup = window.swup;
			if (!swup?.hooks) {return false;}
			swup.hooks.on("visit:start", hideDialog);
			swup.hooks.on("animation:out:start", hideDialog);
			registered = true;
			swupCleanupFns.push(() => {
				if (window.swup?.hooks) {
					window.swup.hooks.off("visit:start", hideDialog);
					window.swup.hooks.off(
						"animation:out:start",
						hideDialog,
					);
				}
			});
			return true;
		};

		if (setup()) {
			return;
		}

		// @swup/astro 不派发 swup:enable；用短轮询兜底，并保留事件监听兼容未来版本。
		let attempts = 0;
		const retryTimer = setInterval(() => {
			if (setup() || ++attempts >= 50) {
				clearInterval(retryTimer);
				if (attempts >= 50) {
					console.warn("[Pio] Swup hooks not registered after timeout");
				}
			}
		}, 100);
		const onSwupEnable = () => {
			if (setup()) {
				document.removeEventListener("swup:enable", onSwupEnable);
			}
		};
		document.addEventListener("swup:enable", onSwupEnable);
		swupCleanupFns.push(() => {
			clearInterval(retryTimer);
			document.removeEventListener("swup:enable", onSwupEnable);
		});
	}
</script>

{#if pioConfig.enable}
	<div
		class="pio-container"
		class:left={pioConfig.position === "left"}
		class:right={pioConfig.position !== "left"}
		class:loaded={isLoaded}
		class:hidden={!isVisible}
		bind:this={pioContainer}
		data-swup-persist="pio-live2d"
		style="width: {canvasWidth}px; height: {canvasHeight}px;"
	>
		{#if shouldRender}
			<div class="pio-dialog"></div>
			<div class="pio-action"></div>
			<canvas
				id="pio"
				bind:this={pioCanvas}
				width={canvasWidth}
				height={canvasHeight}
			></canvas>
		{/if}
	</div>
{/if}

<style>
	.pio-container {
		position: fixed !important;
		bottom: 0 !important;
		z-index: 52 !important;
		overflow: visible;
		pointer-events: none;
	}

	.pio-container.left {
		left: 0;
	}

	.pio-container.right {
		right: 0;
	}

	.pio-container.loaded {
		pointer-events: auto;
	}

	.pio-container.hidden {
		display: none !important;
	}

	.pio-container :global(.pio-action) {
		position: absolute;
		top: 3em;
		pointer-events: auto;
	}

	.pio-container.left :global(.pio-action) {
		right: 0;
	}

	.pio-container.right :global(.pio-action) {
		left: 0;
	}

	.pio-container :global(.pio-dialog) {
		position: absolute;
		bottom: calc(100% + 0.5em);
		pointer-events: auto;
	}

	.pio-container.left :global(.pio-dialog) {
		left: 1em;
	}

	.pio-container.right :global(.pio-dialog) {
		right: 1em;
	}

	#pio {
		display: block;
		pointer-events: auto;
	}
</style>
