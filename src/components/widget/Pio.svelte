<script>
	import { onDestroy, onMount } from "svelte";
	import { pioConfig } from "@/config";

	const pioOptions = {
		mode: pioConfig.mode,
		hidden: pioConfig.hiddenOnMobile,
		content: pioConfig.dialog || {},
		model: pioConfig.models || ["/pio/models/pio/model.json"],
	};

	// 判断是否为 Model3 (SDK 4)
	const isModel3 = pioOptions.model[0].includes("model3.json");

	let pioContainer;
	let pioCanvas;
	let pioInitialized = false;

	// 初始化函数
	function initPio() {
		if (typeof window !== "undefined" && typeof Paul_Pio !== "undefined") {
			try {
				if (pioContainer && pioCanvas && !pioInitialized) {
					// 如果是 SDK4 ，手动初始化 Pixi 环境
					if (isModel3 && typeof window.initPioPixi === "function") {
						// 将 'left' 或 'right' 传给 SDK4 用于初始化对齐
						window.initPioPixi(pioConfig.position || "left");
					}

					// 实例化 Paul_Pio
					new Paul_Pio(pioOptions);
					pioInitialized = true;
					console.log(
						`Pio initialized successfully (${isModel3 ? "SDK4" : "SDK2"})`,
					);
				}
			} catch (e) {
				console.error("Pio initialization error:", e);
			}
		} else {
			// 轮询等待脚本加载完成
			setTimeout(initPio, 100);
		}
	}

	// 核心：资源加载器
	async function loadPioAssets() {
		if (typeof window === "undefined") return;

		// 辅助函数：加载单个脚本
		const loadScript = (src, id) => {
			return new Promise((resolve, reject) => {
				if (document.querySelector(`#${id}`)) {
					resolve(); // 已存在则直接成功
					return;
				}
				const script = document.createElement("script");
				script.id = id;
				script.src = src;
				script.onload = () => resolve();
				script.onerror = (e) => reject(e);
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
				await loadScript("/pio/static/pio.js", "pio-main");
			} else {
				await loadScript("/pio/static/l2d.js", "l2d-lib");
				await loadScript("/pio/static/pio.js", "pio-main");
			}

			// 全部加载完成后，初始化
			setTimeout(initPio, 100);
		} catch (err) {
			console.error("Failed to load Pio assets:", err);
		}
	}

	onMount(() => {
		if (!pioConfig.enable) return;
		if (
			pioConfig.hiddenOnMobile &&
			window.matchMedia("(max-width: 1280px)").matches
		)
			return;

		// 延时一点执行，确保 DOM 已挂载
		setTimeout(loadPioAssets, 0);
	});
</script>

{#if pioConfig.enable}
	<!-- 添加 pointer-events-none 样式类供调试，根据需要调整 css -->
	<!-- 最后一行修复幕布和模型大小不匹配 -->
	<div
		class={`pio-container ${pioConfig.position || "left"}`}
		bind:this={pioContainer}
	>
		<div class="pio-action"></div>
		<canvas
			id="pio"
			bind:this={pioCanvas}
			width={pioConfig.width || 280}
			height={pioConfig.height || 250}
			style="width: {pioConfig.width ||
				280}px; height: {pioConfig.height || 250}px;"
		></canvas>
	</div>
{/if}

<style>
	/* 确保 canvas 可见 */
	#pio {
		display: block;
	}
</style>
