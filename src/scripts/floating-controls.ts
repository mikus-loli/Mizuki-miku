/**
 * 悬浮控件（目录 / 回到首页 / 回到顶部）的可见性管理。
 *
 * 原先是 `components/control/FloatingControls.astro` 里的 215 行 is:inline 脚本：
 * 每页原样输出 5.4KB、不可压缩、不进类型检查。逻辑自包含、不参与首屏绘制，
 * 搬进模块后由 Vite 压缩，并与其它页面共用缓存。
 */

export function initFloatingControls(): void {
	const observers =
		(window.__floatingControlObservers ??= new Map<string, MutationObserver>());

	let isMusicPanelExpanded = false;
	let visibilityUpdateScheduled = false;
	const controlButtonIds = [
		"floating-toc-btn",
		"back-to-home-btn",
		"back-to-top-btn",
	];

	function isButtonVisible(id) {
		const element = document.getElementById(id);
		return Boolean(element && !element.classList.contains("hide"));
	}

	function updateFloatingControlVisibility() {
		if (isMusicPanelExpanded) {
			return;
		}

		const items = document.querySelectorAll(
			".floating-control-item[data-control-key]",
		);
		const totalItems = items.length;
		let hasVisibleItem = false;
		let visibleCount = 0;

		for (const item of items) {
			const key = item.getAttribute("data-control-key");
			let visible = true;

			if (key === "toc") {
				visible = isButtonVisible("floating-toc-btn");
			} else if (key === "home") {
				visible = isButtonVisible("back-to-home-btn");
			} else if (key === "top") {
				visible = isButtonVisible("back-to-top-btn");
			}

			item.classList.toggle("is-collapsed", !visible);
			item.classList.toggle("is-stacked", visible && hasVisibleItem);

			if (visible) {
				hasVisibleItem = true;
				visibleCount += 1;
			}
		}

		document.documentElement.style.setProperty(
			"--fab-visible-count",
			String(Math.max(visibleCount, 1)),
		);

		if (visibleCount >= totalItems) {
			document.documentElement.style.removeProperty("--fab-group-bottom");
		} else {
			const baseBottom = parseFloat(
				getComputedStyle(document.documentElement).getPropertyValue(
					"--fab-group-base-bottom",
				),
			);
			if (!isNaN(baseBottom) && totalItems > 0) {
				const minBottom = 1.5;
				const ratio = visibleCount / totalItems;
				const newBottom = minBottom + (baseBottom - minBottom) * ratio;
				document.documentElement.style.setProperty(
					"--fab-group-bottom",
					newBottom + "rem",
				);
			}
		}
	}

	function observeFloatingControlButton(id) {
		const target = document.getElementById(id);
		if (!target) {
			return;
		}

		const existing = observers.get(id);
		if (existing) {
			existing.disconnect();
		}

		const observer = new MutationObserver(() => {
			scheduleVisibilityUpdate();
		});

		observer.observe(target, {
			attributes: true,
			attributeFilter: ["class"],
		});

		observers.set(id, observer);
	}

	function initFloatingControlVisibility() {
		updateFloatingControlVisibility();
		observeFloatingControlButton("floating-toc-btn");
		observeFloatingControlButton("back-to-home-btn");
		observeFloatingControlButton("back-to-top-btn");
	}

	function lockFloatingControlVisibility() {
		document.documentElement.classList.add("fab-visibility-locked");

		const items = document.querySelectorAll(
			".floating-control-item[data-control-key]",
		);
		for (const item of items) {
			const key = item.getAttribute("data-control-key");
			const id =
				key === "toc"
					? "floating-toc-btn"
					: key === "home"
						? "back-to-home-btn"
						: key === "top"
							? "back-to-top-btn"
							: null;

			if (!id) {
				continue;
			}

			const button = document.getElementById(id);
			const isVisible = Boolean(
				button && !button.classList.contains("hide"),
			);
			item.classList.toggle("fab-lock-collapsed", !isVisible);
		}

		for (const id of controlButtonIds) {
			const button = document.getElementById(id);
			if (!button) {
				continue;
			}

			const isVisible = !button.classList.contains("hide");
			button.classList.toggle("fab-lock-visible", isVisible);
		}
	}

	function unlockFloatingControlVisibility() {
		document.documentElement.classList.remove("fab-visibility-locked");

		const items = document.querySelectorAll(
			".floating-control-item[data-control-key]",
		);
		for (const item of items) {
			item.classList.remove("fab-lock-collapsed");
		}

		for (const id of controlButtonIds) {
			const button = document.getElementById(id);
			button?.classList.remove("fab-lock-visible");
		}
	}

	function handleMusicPanelState(event) {
		const expanded = Boolean(event?.detail?.isExpanded);
		if (expanded === isMusicPanelExpanded) {
			return;
		}

		isMusicPanelExpanded = expanded;
		if (isMusicPanelExpanded) {
			lockFloatingControlVisibility();
		} else {
			unlockFloatingControlVisibility();
			updateFloatingControlVisibility();
		}
	}

	let mermaidRendering = false;
	let mermaidRenderTimer: ReturnType<typeof setTimeout> | null = null;

	function handleMermaidRenderStart() {
		mermaidRendering = true;
	}

	function handleMermaidRenderDone() {
		if (mermaidRenderTimer) {
			clearTimeout(mermaidRenderTimer);
		}
		mermaidRenderTimer = setTimeout(() => {
			mermaidRendering = false;
			updateFloatingControlVisibility();
		}, 120);
	}

	document.addEventListener(
		"DOMContentLoaded",
		initFloatingControlVisibility,
	);
	document.addEventListener("astro:page-load", initFloatingControlVisibility);
	window.addEventListener("music-sidebar:state", handleMusicPanelState);
	window.addEventListener("mermaid:render:start", handleMermaidRenderStart);
	window.addEventListener("mermaid:render:done", handleMermaidRenderDone);
	initFloatingControlVisibility();

	function scheduleVisibilityUpdate() {
		if (visibilityUpdateScheduled || mermaidRendering) {
			return;
		}
		visibilityUpdateScheduled = true;
		requestAnimationFrame(() => {
			visibilityUpdateScheduled = false;
			if (!mermaidRendering) {
				updateFloatingControlVisibility();
			}
		});
	}
}
