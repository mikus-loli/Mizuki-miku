/* ----

# Pio SDK 2/3/4 support
# By: jupiterbjy
# Last Update: 2021.4.22

To use this, you need to include following sources to your HTML file first.
With this script, you don't have to include `l2d.js`. Testing is done without it.
Basic usage is same with Paul-Pio.

Make sure to call `pio_refresh_style()` upon changing styles on anything related to 'pio-container' and it's children.

To change alignment, modify variable `pio_alignment` to either `left` or `right", then call "pio_refresh_style()".

<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>

If you have trouble setting up this, check following example's sources.
https://jupiterbjy.github.io/PaulPio_PIXI_Demo/

---- */
var app;
var currentModel = null;
var __pioTargetSize = null;

function loadlive2d(canvas_id, json_object_or_url) {
	var canvas = document.getElementById(canvas_id);

	if (canvas.width === 0) {
		canvas.removeAttribute("height");
	}

	try {
		app.stage.removeChildAt(0);
	} catch (error) {}

	var model = PIXI.live2d.Live2DModel.fromSync(json_object_or_url);

	model.once("load", () => {
		currentModel = model;
		app.stage.addChild(model);

		var targetSize = __pioTargetSize;
		var scale;

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
		} else {
			scale = canvas.height / model.height;
			canvas.width = model.width;
		}

		model.scale.set(scale);

		var pioContainer = document
			.getElementsByClassName("pio-container")
			.item(0);
		if (pioContainer) {
			pioContainer.classList.remove("left", "right");
			pioContainer.classList.add(pio_alignment);
		}

		if (pioContainer && pioContainer.className.includes("left")) {
			model.x = 0;
		} else {
			model.x = canvas.width - model.width * scale;
		}

		model.on("hit", (hitAreas) => {
			if (hitAreas.includes("body")) {
				model.motion("tap_body");
			} else if (hitAreas.includes("Body")) {
				model.motion("Tap");
			} else if (hitAreas.includes("head") || hitAreas.includes("Head")) {
				model.expression();
			}
		});
	});
}

var pio_alignment = "right";

function pio_refresh_style() {
	var pioContainer = document.getElementsByClassName("pio-container").item(0);
	if (!pioContainer) return;

	pioContainer.classList.remove("left", "right");
	pioContainer.classList.add(pio_alignment);
}

window.pio_change_expression = function () {
	if (currentModel) {
		currentModel.expression();
	}
};

window.initPioPixi = function (alignmentParam, targetWidth, targetHeight) {
	if (alignmentParam) {
		pio_alignment = alignmentParam;
	}

	if (typeof targetWidth === "number" && typeof targetHeight === "number") {
		__pioTargetSize = { width: targetWidth, height: targetHeight };
	}

	if (typeof PIXI === "undefined") {
		return;
	}

	if (app) {
		var canvas = document.getElementById("pio");
		if (canvas && __pioTargetSize) {
			canvas.width = __pioTargetSize.width;
			canvas.height = __pioTargetSize.height;
		}
		pio_refresh_style();
		return;
	}

	var canvas = document.getElementById("pio");

	if (__pioTargetSize) {
		canvas.width = __pioTargetSize.width;
		canvas.height = __pioTargetSize.height;
	}

	app = new PIXI.Application({
		view: canvas,
		transparent: true,
		autoStart: true,
	});

	pio_refresh_style();
};
