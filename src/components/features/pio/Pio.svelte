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

	let pioInstance: any = null;
	let pioInitialized = false;
	let pioContainer: HTMLDivElement | null = null;
	let pioCanvas: HTMLCanvasElement | null = null;

	function initPio() {
		if (
			typeof window !== "undefined" &&
			typeof (window as any).Paul_Pio !== "undefined"
		) {
			try {
				if (pioContainer && pioCanvas && !pioInitialized) {
					if (
						isModel3 &&
						typeof (window as any).initPioPixi === "function"
					) {
						(window as any).initPioPixi(
							pioConfig.position || "left",
						);
					}

					pioInstance = new (window as any).Paul_Pio(pioOptions);
					pioInitialized = true;
					console.log(
						`Pio initialized successfully (${isModel3 ? "SDK4" : "SDK2"})`,
					);
				} else if (!pioContainer || !pioCanvas) {
					console.warn("Pio DOM elements not found, retrying...");
					setTimeout(initPio, 100);
				}
			} catch (e) {
				console.error("Pio initialization error:", e);
			}
		} else {
			setTimeout(initPio, 100);
		}
	}

	async function loadPioAssets() {
		if (typeof window === "undefined") {
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
				await loadScript(
					"https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js",
					"cubism-core",
				);
				await loadScript(
					"https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js",
					"pixi-js",
				);
				await loadScript(
					"https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/cubism4.min.js",
					"pixi-live2d-display",
				);
				await loadScript("/pio/static/pio_sdk4.js", "pio-sdk4-adapter");
				await loadScript("/pio/static/pio.js", "pio-main-script");
			} else {
				await loadScript("/pio/static/l2d.js", "pio-l2d-script");
				await loadScript("/pio/static/pio.js", "pio-main-script");
			}

			setTimeout(initPio, 100);
		} catch (error) {
			console.error("Failed to load Pio scripts:", error);
		}
	}

	onMount(() => {
		if (!pioConfig.enable) {
			return;
		}

		if (
			pioConfig.hiddenOnMobile &&
			window.matchMedia("(max-width: 1280px)").matches
		) {
			return;
		}

		loadPioAssets();
	});

	onDestroy(() => {
		console.log("Pio Svelte component destroyed (keeping instance alive)");
	});
</script>

{#if pioConfig.enable}
	<div
		class={`pio-container ${pioConfig.position || "right"}`}
		bind:this={pioContainer}
	>
		<div class="pio-action"></div>
		<canvas
			id="pio"
			bind:this={pioCanvas}
			width={pioConfig.width || 280}
			height={pioConfig.height || 250}
		></canvas>
	</div>
{/if}

<style>
	/* Pio 相关样式将通过外部CSS文件加载 */
</style>
