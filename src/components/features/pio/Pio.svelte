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

	let pioContainer: HTMLDivElement | null = null;
	let pioCanvas: HTMLCanvasElement | null = null;
	let isLoaded = false;

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
			console.warn("[Pio] Paul_Pio not available yet, retrying...");
			setTimeout(initPio, 100);
			return;
		}

		if (!pioContainer || !pioCanvas) {
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

	onMount(() => {
		if (!pioConfig.enable) return;

		if (
			pioConfig.hiddenOnMobile &&
			window.matchMedia("(max-width: 1280px)").matches
		) {
			return;
		}

		loadPioAssets();
	});

	onDestroy(() => {
		console.log("[Pio] Component destroyed (keeping instance alive)");
	});
</script>

{#if pioConfig.enable}
	<div
		class="pio-container"
		class:left={pioConfig.position === "left"}
		class:right={pioConfig.position !== "left"}
		class:loaded={isLoaded}
		bind:this={pioContainer}
		data-swup-persist="pio-live2d"
		style="width: {canvasWidth}px; height: {canvasHeight}px;"
	>
		<div class="pio-dialog"></div>
		<div class="pio-action"></div>
		<canvas
			id="pio"
			bind:this={pioCanvas}
			width={canvasWidth}
			height={canvasHeight}
		></canvas>
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
