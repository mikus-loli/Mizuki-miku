<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	import { pioConfig } from "@/config";

	import type { PioProps } from "./types";

	export let config: Partial<PioProps["config"]> = {};

	const pioOptions = {
		mode: config?.mode ?? pioConfig.mode,
		hidden: config?.hiddenOnMobile ?? pioConfig.hiddenOnMobile,
		content: config?.dialog ?? pioConfig.dialog ?? {},
		model: config?.models ??
			pioConfig.models ?? ["/pio/models/pio/model.json"],
	};

	const isModel3 = pioOptions.model[0].includes("model3.json");

	const canvasWidth = pioConfig.width || 280;
	const canvasHeight = pioConfig.height || 250;

	// 分辨率阈值配置
	const minResolution = pioConfig.minResolution ?? { width: 1280 };
	const minWidth = minResolution.width ?? 1280;
	const minHeight = minResolution.height;

	let pioContainer: HTMLDivElement | null = null;
	let pioCanvas: HTMLCanvasElement | null = null;
	let isLoaded = false;
	let isVisible = false;
	let shouldRender = false;
	let resizeObserver: ResizeObserver | null = null;
	let mediaQuery: MediaQueryList | null = null;
	let initRetryCount = 0;
	const MAX_INIT_RETRIES = 30;
	let swupCleanupFns: (() => void)[] = [];

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
			console.log("[Pio] Resolution meets threshold, showing Live2D");
			if (!isLoaded) {
				shouldRender = true;
				loadPioAssets();
			} else {
				showPio();
			}
		} else if (!isVisible && wasVisible) {
			// 从显示变为隐藏
			console.log("[Pio] Resolution below threshold, hiding Live2D");
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
		const win = window as any;
		if (win.__pioInstance?.modules?.hideDialog) {
			win.__pioInstance.modules.hideDialog();
		}
	}

	function initPio() {
		if (typeof window === "undefined") return;

		const win = window as any;

		if (win.__pioInstance || win.__pioInitialized) {
			console.log(
				"[Pio] Instance already exists, skipping initialization",
			);
			return;
		}

		if (typeof win.Paul_Pio === "undefined") {
			if (initRetryCount >= MAX_INIT_RETRIES) {
				console.error("[Pio] Paul_Pio not available after maximum retries, giving up");
				return;
			}
			initRetryCount++;
			console.warn("[Pio] Paul_Pio not available yet, retrying...");
			setTimeout(initPio, 100);
			return;
		}

		if (!pioContainer || !pioCanvas) {
			if (initRetryCount >= MAX_INIT_RETRIES) {
				console.error("[Pio] DOM elements not found after maximum retries, giving up");
				return;
			}
			initRetryCount++;
			console.warn("[Pio] DOM elements not found, retrying...");
			setTimeout(initPio, 100);
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
			console.log(
				`[Pio] Initialized successfully (${isModel3 ? "SDK4" : "SDK2"})`,
			);
		} catch (e) {
			console.error("[Pio] Initialization error:", e);
		}
	}

	async function loadPioAssets() {
		if (typeof window === "undefined") return;

		const win = window as any;

		if (win.__pioScriptsLoaded) {
			console.log("[Pio] Scripts already loaded, initializing...");
			setTimeout(initPio, 100);
			return;
		}

		const loadScript = (src: string, id: string): Promise<void> => {
			return new Promise((resolve, reject) => {
				if (document.querySelector(`#${id}`)) {
					resolve();
					return;
				}
				const script = document.createElement("script");
				script.id = id;
				script.src = src;
				script.async = true;
				script.onload = () => resolve();
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};

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
			setTimeout(initPio, 100);
		} catch (error) {
			console.error("[Pio] Failed to load scripts:", error);
		}
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
		if (!pioConfig.enable) return;

		// 初始检查分辨率
		isVisible = checkResolution();

		if (!isVisible) {
			console.log(
				`[Pio] Resolution below threshold (${window.innerWidth}x${window.innerHeight} < ${minWidth}x${minHeight ?? "any"}), Live2D hidden`,
			);
			return;
		}

		// 分辨率满足条件，加载 Live2D
		shouldRender = true;
		loadPioAssets();
		setupSwupHooks();

		// 设置分辨率监听
		setupResizeListener();
	});

	onDestroy(() => {
		console.log("[Pio] Component destroyed (keeping instance alive)");
		cleanupResizeListener();
		swupCleanupFns.forEach((fn) => fn());
		swupCleanupFns = [];
	});

	function setupSwupHooks() {
		if (typeof window === "undefined") return;

		const hideDialog = () => {
			const win = window as any;
			if (win.__pioInstance?.modules?.hideDialog) {
				win.__pioInstance.modules.hideDialog();
			} else {
				const dialog = pioContainer?.querySelector(".pio-dialog");
				if (dialog) {
					dialog.classList.remove("active");
				}
			}
		};

		const setup = () => {
			const swup = (window as any).swup;
			if (!swup?.hooks) return false;
			swup.hooks.on("visit:start", hideDialog);
			swup.hooks.on("animation:out:start", hideDialog);
			swupCleanupFns.push(() => {
				if ((window as any).swup?.hooks) {
					(window as any).swup.hooks.off("visit:start", hideDialog);
					(window as any).swup.hooks.off("animation:out:start", hideDialog);
				}
			});
			return true;
		};

		if (!setup()) {
			const onSwupEnable = () => {
				if (setup()) {
					document.removeEventListener("swup:enable", onSwupEnable);
				}
			};
			document.addEventListener("swup:enable", onSwupEnable);
			swupCleanupFns.push(() => {
				document.removeEventListener("swup:enable", onSwupEnable);
			});
		}
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
