/* ----

# Pio SDK 2/3/4 support
# By: jupiterbjy
# Last Update: 2021.4.22

To use this, you need to include following sources to your HTML file first.
With this script, you don't have to include `l2d.js`. Testing is done without it.
Basic usage is same with Paul-Pio.

Make sure to call `pio_refresh_style()` upon changing styles on anything related to 'pio-container' and it's children.

To change alignment, modify variable `pio_alignment` to either `left` or `right`, then call `pio_refresh_style()`.

<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>

If you have trouble setting up this, check following example's sources.
https://jupiterbjy.github.io/PaulPio_PIXI_Demo/

---- */
var app;
var currentModel = null;

function loadlive2d(canvas_id, json_object_or_url) {
	// Replaces original l2d method 'loadlive2d' for Pio.
	// Heavily relies on pixi_live2d_display.

	console.log("[Pio] Loading new model");

	const canvas = document.getElementById(canvas_id);

	// When pio was start minimized on browser refresh or reload,
	// canvas is set to 0, 0 dimension and need to be changed.
	if (canvas.width === 0) {
		canvas.removeAttribute("height");
		pio_refresh_style();
	}

	// Try to remove previous model, if any exists.
	try {
		app.stage.removeChildAt(0);
	} catch (error) {}

	let model = PIXI.live2d.Live2DModel.fromSync(json_object_or_url);

	model.once("load", () => {
		currentModel = model;
		app.stage.addChild(model);

		var targetSize = window.__pioTargetSize;
		var scale;

		console.log(
			"[Pio] Model loaded. targetSize:",
			targetSize,
			"model.size:",
			model.width,
			"x",
			model.height,
		);

		if (
			targetSize &&
			typeof targetSize.width === "number" &&
			typeof targetSize.height === "number"
		) {
			var scaleX = targetSize.width / model.width;
			var scaleY = targetSize.height / model.height;
			scale = Math.min(scaleX, scaleY);
			canvas.width = targetSize.width;
			canvas.height = targetSize.height;
			console.log(
				"[Pio] Applied target size:",
				canvas.width,
				"x",
				canvas.height,
				"scale:",
				scale,
			);
		} else {
			scale = canvas.height / model.height;
			canvas.width = model.width;
			console.log(
				"[Pio] Using model size (no target):",
				canvas.width,
				"x",
				canvas.height,
			);
		}

		model.scale.set(scale);
		pio_refresh_style();

		if (
			document
				.getElementsByClassName("pio-container")
				.item(0)
				.className.includes("left")
		) {
			model.x = 0;
		} else {
			model.x = canvas.width - model.width * scale;
		}

		// Hit callback definition
		model.on("hit", (hitAreas) => {
			if (hitAreas.includes("body")) {
				console.log("[Pio] Touch on body (SDK2)");
				model.motion("tap_body");
			} else if (hitAreas.includes("Body")) {
				console.log("[Pio] Touch on body (SDK3/4)");
				model.motion("Tap");
			} else if (hitAreas.includes("head") || hitAreas.includes("Head")) {
				console.log("[Pio] Touch on head");
				model.expression();
			}
		});
	});
}

// 注释掉生成 DOM 的函数，因为 Svelte 已经渲染了
// function _pio_initialize_container(){

//     // Generate structure
//     let pio_container = document.createElement("div")
//     pio_container.classList.add("pio-container")
//     pio_container.id = "pio-container"
//     document.body.insertAdjacentElement("beforeend", pio_container)

//     // Generate action
//     let pio_action = document.createElement("div")
//     pio_action.classList.add("pio-action")
//     pio_container.insertAdjacentElement("beforeend", pio_action)

//     // Generate canvas
//     let pio_canvas = document.createElement("canvas")
//     pio_canvas.id = "pio"
//     pio_container.insertAdjacentElement("beforeend", pio_canvas)

//     console.log("[Pio] Initialized container.")
// }

// 将此变量保留在全局作用域，但默认值不重要了，会被覆盖
var pio_alignment = "right";

function pio_refresh_style() {
	// Always make sure to call this after container/canvas style changes!
	// You can set alignment here, but still you can change it manually.

	let pio_container = document
		.getElementsByClassName("pio-container")
		.item(0);
	// 增加判空，防止报错
	if (!pio_container) return;

	// 强行重置 class，确保和内部状态一致
	pio_container.classList.remove("left", "right");
	pio_container.classList.add(pio_alignment);

	if (app && document.getElementById("pio")) {
		app.resizeTo = document.getElementById("pio");
	}
}

// 函数接收 alignment 参数

window.pio_change_expression = function () {
	if (currentModel) {
		// pixi-live2d-display 提供的 API，会自动播放下一个或随机表情
		// 如果想指定表情，可以使用 currentModel.expression('expressionName')
		// 这里默认随机 / 轮询
		currentModel.expression();
		console.log("[Pio] Change expression trigger.");
	}
};

window.initPioPixi = function (alignmentParam, targetWidth, targetHeight) {
	console.log(
		"[Pio] initPioPixi called with:",
		alignmentParam,
		targetWidth,
		targetHeight,
	);

	if (alignmentParam) {
		pio_alignment = alignmentParam;
	}

	if (typeof targetWidth === "number" && typeof targetHeight === "number") {
		window.__pioTargetSize = { width: targetWidth, height: targetHeight };
		console.log("[Pio] __pioTargetSize set to:", window.__pioTargetSize);
	} else {
		console.warn(
			"[Pio] Invalid targetWidth or targetHeight:",
			targetWidth,
			targetHeight,
		);
	}

	if (typeof PIXI === "undefined") {
		console.error("[Pio] PixiJS not loaded!");
		return;
	}

	if (typeof app !== "undefined" && app !== null) {
		var canvas = document.getElementById("pio");
		if (canvas && window.__pioTargetSize) {
			canvas.width = window.__pioTargetSize.width;
			canvas.height = window.__pioTargetSize.height;
		}
		pio_refresh_style();
		return;
	}

	var canvas = document.getElementById("pio");

	if (window.__pioTargetSize) {
		canvas.width = window.__pioTargetSize.width;
		canvas.height = window.__pioTargetSize.height;
	}

	app = new PIXI.Application({
		view: canvas,
		transparent: true,
		autoStart: true,
	});

	pio_refresh_style();
	console.log("[Pio] Pixi App Initialized with alignment:", pio_alignment);
};

// change alignment to left by modifying this value in other script.
// Make sure to call `pio_refresh_style` to apply changes!
// let pio_alignment = "left"

// 注释掉自动监听
// let app
// window.addEventListener("DOMContentLoaded", _pio_initialize_pixi)
