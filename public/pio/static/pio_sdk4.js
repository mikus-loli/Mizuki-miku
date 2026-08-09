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

// ============================================================
// moc3 gzip 预压缩加载补丁
// 原理：本地将 miku.moc3 用 gzip 压缩为 miku.moc3.gz（-65%，9.5MB → 3.1MB），
// 此处拦截 pixi-live2d-display 的 XHR 请求：.moc3 → .moc3.gz → DecompressionStream 解压。
// 说明：浏览器 DecompressionStream 标准仅支持 gzip/deflate（不支持 brotli），故用 gzip。
// 兼容性：DecompressionStream('gzip') Chrome 80+ / Edge 80+ / Firefox 113+ / Safari 16.4+，
//         不支持时回退请求原始 .moc3（完整保留原逻辑）。
// ============================================================
(function patchMoc3Gzip() {
	if (window.__moc3GzipPatched) return;
	window.__moc3GzipPatched = true;

	var origOpen = XMLHttpRequest.prototype.open;
	var origSend = XMLHttpRequest.prototype.send;

	XMLHttpRequest.prototype.open = function (method, url) {
		this.__pioUrl = typeof url === "string" ? url : String(url);
		return origOpen.apply(this, arguments);
	};

	XMLHttpRequest.prototype.send = function (body) {
		var xhr = this;
		var url = xhr.__pioUrl || "";

		if (
			url.indexOf(".moc3") !== -1 &&
			typeof DecompressionStream !== "undefined"
		) {
			var gzUrl = url + ".gz";
			fetch(gzUrl)
				.then(function (res) {
					if (!res.ok) throw new Error("gz not found: " + res.status);
					return res.arrayBuffer();
				})
				.then(function (compressed) {
					var ds = new DecompressionStream("gzip");
					var stream = new Blob([compressed]).stream().pipeThrough(ds);
					return new Response(stream).arrayBuffer();
				})
				.then(function (decoded) {
					// 用解压后的数据填充 XHR 状态，触发 onload/onloadend
					Object.defineProperty(xhr, "response", {
						value: decoded,
						writable: true,
						configurable: true,
					});
					Object.defineProperty(xhr, "status", {
						value: 200,
						writable: true,
						configurable: true,
					});
					Object.defineProperty(xhr, "readyState", {
						value: 4,
						writable: true,
						configurable: true,
					});
					if (xhr.onreadystatechange) xhr.onreadystatechange();
					if (xhr.onload) xhr.onload();
					if (xhr.onloadend) xhr.onloadend();
				})
				.catch(function () {
					// 回退：原始 URL 正常加载（不压缩）
					return origSend.call(xhr, body);
				});
			return;
		}

		return origSend.apply(this, arguments);
	};
})();

var app;
var currentModel = null;
var pio_has_expression = false;

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

		// 检查模型是否有表情
		pio_has_expression = pio_check_model_expressions(model);

		// 更新表情按钮显示状态
		if (typeof window.pio_update_expression_button === "function") {
			window.pio_update_expression_button();
		}

		var targetSize = window.__pioTargetSize;
		var scale;

		if (targetSize && targetSize.width && targetSize.height) {
			var scaleX = targetSize.width / model.width;
			var scaleY = targetSize.height / model.height;
			scale = Math.min(scaleX, scaleY);
			canvas.width = targetSize.width;
			canvas.height = targetSize.height;
		} else {
			scale = canvas.height / model.height;
			canvas.width = model.width;
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
	if (alignmentParam) {
		pio_alignment = alignmentParam;
	}

	if (targetWidth && targetHeight) {
		window.__pioTargetSize = { width: targetWidth, height: targetHeight };
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

// 检查模型是否有表情
function pio_check_model_expressions(model) {
	if (!model) return false;

	// 检查 pixi-live2d-display 的表情定义
	// 方式1: 检查 internalModel.settings.expressions (Cubism 4)
	if (model.internalModel && model.internalModel.settings) {
		var settings = model.internalModel.settings;
		if (settings.expressions && settings.expressions.length > 0) {
			console.log(
				"[Pio] Model has expressions:",
				settings.expressions.length,
			);
			return true;
		}
	}

	// 方式2: 检查 motionManager.definitions.expression
	if (model.internalModel && model.internalModel.motionManager) {
		var motionManager = model.internalModel.motionManager;
		if (
			motionManager.definitions &&
			motionManager.definitions.expression &&
			motionManager.definitions.expression.length > 0
		) {
			console.log(
				"[Pio] Model has expression motions:",
				motionManager.definitions.expression.length,
			);
			return true;
		}
	}

	console.log("[Pio] Model has no expressions");
	return false;
}

// 获取模型是否有表情
window.pio_get_has_expression = function () {
	return pio_has_expression;
};
