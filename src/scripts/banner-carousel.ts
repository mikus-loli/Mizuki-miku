/**
 * 首页 Banner 轮播（桌面 / 移动两组图，淡入淡出 + Ken Burns + 触摸滑动）。
 *
 * 原先是 `components/layout/Banner.astro` 里的 255 行 is:inline 脚本：
 * 每页原样输出 8.2KB、不可压缩、不进类型检查。它不依赖 Astro props，
 * 首帧由标记里的 opacity 决定，脚本只负责启动定时器，因此延后到模块
 * 执行不会影响首屏呈现。
 */

export function initBannerCarousel(): void {
	const container = document.getElementById('banner-carousel');
	if (!container) {return;}
	// 闭包里 TS 不保留 null 收窄，这里固定成非空引用
	const root: HTMLElement = container;

	// swup 只替换 <main>，Banner 是持久节点：换页时脚本会被重新执行，
	// 但 DOM 已是处理过的形态（模板已转成帧），再跑一次会重复克隆帧。
	if (root.dataset.carouselReady === "1") {
		return;
	}
	root.dataset.carouselReady = "1";

	const mobileCount = parseInt(root.dataset.mobileCount || '0', 10);
	const desktopCount = parseInt(root.dataset.desktopCount || '0', 10);
	const interval = parseInt(root.dataset.carouselInterval || '6000', 10);
	const FADE_MS = parseInt(root.dataset.fadeMs || '1500', 10);

	if (mobileCount <= 1 && desktopCount <= 1) {return;}

	if (window.__bannerCarouselCleanup) {
		window.__bannerCarouselCleanup();
		window.__bannerCarouselCleanup = null;
	}

	const index = (window.__bannerCarouselIndex ??= {
		mobile: 0,
			desktop: 0,
	});

	const frameElements = { mobile: [], desktop: [] };

	function buildFrameElements(slotClass, tplClass, type) {
		if (frameElements[type].length > 0) {return;}

		const initialSlot = root.querySelector('.' + slotClass);
		if (!initialSlot) {return;}

		// 隐藏的那一组图即使 display:none，浏览器仍会下载（实测桌面端白下 715KB）。
		// 因此只构建当前断点可见的一组，跨断点由 media query 监听补建。
		if (isSlotHiddenByBreakpoint(initialSlot)) {return;}

		const baseClass = initialSlot.className.replace(/\bbanner-kb\b/g, '').trim();
		const templates = root.querySelectorAll('.' + tplClass);

		// 收集帧源元素（先存引用，再移除原节点）
		const sourceFrames = [initialSlot].concat(Array.from(templates));

		initialSlot.remove();
		for (let t = 0; t < templates.length; t++) {
			(templates[t] as Element).remove();
		}

		// 用 cloneNode 复制帧结构（避免 innerHTML 序列化-反序列化）
		// 注意：模板帧是 <template> 元素，其内容在 document fragment 中，
		// 直接克隆 <template> 元素不会渲染内容（空白 bug），
		// 必须克隆 template.content
		for (let f = 0; f < sourceFrames.length; f++) {
			const el = document.createElement('div');
			el.className = baseClass;
			const src = sourceFrames[f];
			if (src.tagName === 'TEMPLATE') {
				el.appendChild((src as HTMLTemplateElement).content.cloneNode(true));
			} else {
				el.appendChild(src.cloneNode(true));
			}
			el.style.opacity = '0';
			el.style.pointerEvents = 'none';
			root.appendChild(el);
			frameElements[type].push(el);
		}

		// 索引跨页保留，而新页面的帧数可能更少 —— 越界就回落，避免读 undefined.style
		const startIdx = Math.min(index[type], frameElements[type].length - 1);
		index[type] = startIdx;
		frameElements[type][startIdx].style.opacity = '1';
		frameElements[type][startIdx].style.pointerEvents = '';
	}

	buildFrameElements('banner-image-slot-mobile', 'banner-tpl-mobile', 'mobile');
	buildFrameElements('banner-image-slot-desktop', 'banner-tpl-desktop', 'desktop');

	function isSlotHiddenByBreakpoint(el) {
		const cl = el.classList;
		const isMd = window.matchMedia('(min-width: 768px)').matches;
		if (cl.contains('md:hidden') && isMd) {return true;}
		if (cl.contains('hidden') && !cl.contains('md:hidden') && !isMd) {return true;}
		return false;
	}

	function applyKB(el) {
		if (!el || isSlotHiddenByBreakpoint(el)) {return;}
		el.classList.remove('banner-kb');
		void el.offsetWidth;
		el.classList.add('banner-kb');
	}

	let isCrossfading = { mobile: false, desktop: false };

	function crossfadeToIndex(slotClass, totalCount, type, targetIndex) {
		if (totalCount <= 1) {return;}
		if (isCrossfading[type]) {return;}

		const frames = frameElements[type];
		if (!frames || frames.length === 0) {return;}

		const currentIndex = index[type];
		if (currentIndex === targetIndex) {return;}

		const oldEl = frames[currentIndex];
		const newEl = frames[targetIndex];
		if (!oldEl || !newEl) {return;}
		if (isSlotHiddenByBreakpoint(oldEl)) {return;}

		isCrossfading[type] = true;
		index[type] = targetIndex;

		newEl.style.transition = 'opacity ' + FADE_MS + 'ms ease-in-out';
		newEl.style.opacity = '0';
		newEl.style.pointerEvents = 'none';

		requestAnimationFrame(function() {
			requestAnimationFrame(function() {
				newEl.style.opacity = '1';
				newEl.style.pointerEvents = '';
				newEl.classList.add('banner-kb');
			});
		});

		setTimeout(function() {
			oldEl.style.transition = '';
			oldEl.style.opacity = '0';
			oldEl.style.pointerEvents = 'none';
			oldEl.classList.remove('banner-kb');
			newEl.style.transition = '';
			isCrossfading[type] = false;
		}, FADE_MS + 50);
	}

	function crossfade(slotClass, totalCount, type) {
		const frames = frameElements[type];
		if (!frames || frames.length === 0) {return;}
		const currentIndex = index[type];
		const nextIndex = (currentIndex + 1) % frames.length;
		crossfadeToIndex(slotClass, totalCount, type, nextIndex);
	}

	let timerId: ReturnType<typeof setTimeout> | null = null;
	let isPaused = false;

	let touchStartX = 0;
	let touchStartY = 0;
	let isSwiping = false;

	function startCarousel() {
		stopCarousel();
		if (isPaused) {return;}

		const mobileIdx = index.mobile;
		const desktopIdx = index.desktop;
		if (frameElements.mobile[mobileIdx]) {applyKB(frameElements.mobile[mobileIdx]);}
		if (frameElements.desktop[desktopIdx]) {applyKB(frameElements.desktop[desktopIdx]);}

		timerId = setInterval(function() {
			if (!isPaused) {
				crossfade('banner-image-slot-mobile', mobileCount, 'mobile');
				crossfade('banner-image-slot-desktop', desktopCount, 'desktop');
			}
		}, interval);
	}

	function stopCarousel() {
		if (timerId !== null) { clearInterval(timerId); timerId = null; }
	}

	const visibilityHandler = function() {
		if (document.hidden) {
			stopCarousel();
		} else if (!isPaused) {
			startCarousel();
		}
	};
	document.addEventListener('visibilitychange', visibilityHandler);

	const onTouchStart = function(e) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isSwiping = false;
		isPaused = true;
		stopCarousel();
	};

	const onTouchMove = function(e) {
		if (!touchStartX || !touchStartY) {return;}
		const diffX = Math.abs(e.touches[0].clientX - touchStartX);
		const diffY = Math.abs(e.touches[0].clientY - touchStartY);
		if (diffX > diffY && diffX > 30) {
			isSwiping = true;
			e.preventDefault();
		}
	};

	const onTouchEnd = function(e) {
		if (!touchStartX || !touchStartY || !isSwiping) {
			isPaused = false;
			startCarousel();
			return;
		}

		const endX = e.changedTouches[0].clientX;
		const diffX = touchStartX - endX;
		const isMobile = window.innerWidth < 768;
		const type = isMobile ? 'mobile' : 'desktop';
		const count = isMobile ? mobileCount : desktopCount;
		const current = index[type];

		if (Math.abs(diffX) > 50) {
			if (diffX > 0) {
				const next = (current + 1) % count;
				crossfadeToIndex('', count, type, next);
			} else {
				const prev = (current - 1 + count) % count;
				crossfadeToIndex('', count, type, prev);
			}
		}

		touchStartX = 0;
		touchStartY = 0;
		isSwiping = false;
		isPaused = false;
		startCarousel();
	};

	const onMouseEnter = function() {
		isPaused = true;
		stopCarousel();
	};

	const onMouseLeave = function() {
		isPaused = false;
		startCarousel();
	};

	if ('ontouchstart' in window) {
		root.addEventListener('touchstart', onTouchStart, { passive: true });
		root.addEventListener('touchmove', onTouchMove, { passive: false });
		root.addEventListener('touchend', onTouchEnd, { passive: true });
	}

	root.addEventListener('mouseenter', onMouseEnter);
	root.addEventListener('mouseleave', onMouseLeave);

	startCarousel();

	const desktopQuery = window.matchMedia('(min-width: 768px)');
	const onBreakpointChange = function() {
		buildFrameElements('banner-image-slot-mobile', 'banner-tpl-mobile', 'mobile');
		buildFrameElements('banner-image-slot-desktop', 'banner-tpl-desktop', 'desktop');
		startCarousel();
	};
	desktopQuery.addEventListener('change', onBreakpointChange);

	window.__bannerCarouselCleanup = function() {
		desktopQuery.removeEventListener('change', onBreakpointChange);
		stopCarousel();
		document.removeEventListener('visibilitychange', visibilityHandler);
		if ('ontouchstart' in window) {
			root.removeEventListener('touchstart', onTouchStart);
			root.removeEventListener('touchmove', onTouchMove);
			root.removeEventListener('touchend', onTouchEnd);
		}
		root.removeEventListener('mouseenter', onMouseEnter);
		root.removeEventListener('mouseleave', onMouseLeave);
		isCrossfading = { mobile: false, desktop: false };
	};
}
