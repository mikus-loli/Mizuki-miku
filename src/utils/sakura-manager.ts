import type { SakuraConfig } from "../types/config";

const SAKURA_DRAW_SIZE = 40;

class Sakura {
	x: number;
	y: number;
	s: number;
	r: number;
	a: number;
	fn: {
		x: (x: number, y: number) => number;
		y: (x: number, y: number) => number;
		r: (r: number) => number;
		a: (a: number) => number;
	};
	idx: number;
	img: HTMLImageElement;
	limitArray: number[];
	config: SakuraConfig;

	constructor(
		x: number,
		y: number,
		s: number,
		r: number,
		a: number,
		fn: {
			x: (x: number, y: number) => number;
			y: (x: number, y: number) => number;
			r: (r: number) => number;
			a: (a: number) => number;
		},
		idx: number,
		img: HTMLImageElement,
		limitArray: number[],
		config: SakuraConfig,
	) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.r = r;
		this.a = a;
		this.fn = fn;
		this.idx = idx;
		this.img = img;
		this.limitArray = limitArray;
		this.config = config;
	}

	draw(cxt: CanvasRenderingContext2D) {
		cxt.save();
		cxt.translate(this.x, this.y);
		cxt.rotate(this.r);
		cxt.globalAlpha = this.a;
		cxt.drawImage(
			this.img,
			0,
			0,
			SAKURA_DRAW_SIZE * this.s,
			SAKURA_DRAW_SIZE * this.s,
		);
		cxt.restore();
	}

	update() {
		this.x = this.fn.x(this.x, this.y);
		this.y = this.fn.y(this.y, this.x);
		this.r = this.fn.r(this.r);
		this.a = this.fn.a(this.a);

		if (
			this.x > window.innerWidth ||
			this.x < 0 ||
			this.y > window.innerHeight ||
			this.y < 0 ||
			this.a <= 0
		) {
			if (this.limitArray[this.idx] === -1) {
				this.resetPosition();
			} else {
				if (this.limitArray[this.idx] > 0) {
					this.resetPosition();
					this.limitArray[this.idx]--;
				}
			}
		}
	}

	private resetPosition() {
		if (Math.random() > 0.4) {
			this.x = getRandom("x", this.config);
			this.y = 0;
			this.s = getRandom("s", this.config);
			this.r = getRandom("r", this.config);
			this.a = getRandom("a", this.config);
		} else {
			this.x = window.innerWidth;
			this.y = getRandom("y", this.config);
			this.s = getRandom("s", this.config);
			this.r = getRandom("r", this.config);
			this.a = getRandom("a", this.config);
		}
	}
}

class SakuraList {
	list: Sakura[];

	constructor() {
		this.list = [];
	}

	push(sakura: Sakura) {
		this.list.push(sakura);
	}

	update() {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].update();
		}
	}

	draw(cxt: CanvasRenderingContext2D) {
		for (let i = 0, len = this.list.length; i < len; i++) {
			this.list[i].draw(cxt);
		}
	}

	get(i: number) {
		return this.list[i];
	}

	size() {
		return this.list.length;
	}
}

type RandomOption = "x" | "y" | "s" | "r" | "a" | "fnx" | "fny" | "fnr" | "fna";
type NumericOption = "x" | "y" | "s" | "r" | "a";
type FnOption = "fnx" | "fny" | "fnr" | "fna";

function getRandom(option: NumericOption, config: SakuraConfig): number;
function getRandom(
	option: FnOption,
	config: SakuraConfig,
): (...args: number[]) => number;
function getRandom(
	option: RandomOption,
	config: SakuraConfig,
): number | ((...args: number[]) => number) {
	let ret: number | ((...args: number[]) => number);
	let random: number;

	switch (option) {
		case "x":
			ret = Math.random() * window.innerWidth;
			break;
		case "y":
			ret = Math.random() * window.innerHeight;
			break;
		case "s":
			ret =
				config.size.min +
				Math.random() * (config.size.max - config.size.min);
			break;
		case "r":
			ret = Math.random() * 6;
			break;
		case "a":
			ret =
				config.opacity.min +
				Math.random() * (config.opacity.max - config.opacity.min);
			break;
		case "fnx":
			random =
				config.speed.horizontal.min +
				Math.random() *
					(config.speed.horizontal.max - config.speed.horizontal.min);
			ret = (x: number, _y: number) => x + random;
			break;
		case "fny":
			random =
				config.speed.vertical.min +
				Math.random() *
					(config.speed.vertical.max - config.speed.vertical.min);
			ret = (_x: number, y: number) => y + random;
			break;
		case "fnr":
			ret = (r: number) => r + config.speed.rotation;
			break;
		case "fna":
			ret = (alpha: number) => alpha - config.speed.fadeSpeed * 0.01;
			break;
	}
	return ret;
}

export class SakuraManager {
	private config: SakuraConfig;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private sakuraList: SakuraList | null = null;
	private animationId: number | null = null;
	private img: HTMLImageElement | null = null;
	private isRunning = false;
	private resizeTimeout: number | null = null;
	private boundResizeHandler: () => void;
	private boundVisibilityHandler: () => void;

	constructor(config: SakuraConfig) {
		this.config = config;
		this.boundResizeHandler = this.handleResize.bind(this);
		this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
	}

	async init(): Promise<void> {
		if (!this.config.enable || this.isRunning) {
			return;
		}

		this.img = new Image();
		this.img.src = "/sakura.png";

		await new Promise<void>((resolve, reject) => {
			if (this.img) {
				this.img.onload = () => resolve();
				this.img.onerror = () =>
					reject(new Error("Failed to load sakura image"));
			}
		});

		this.createCanvas();
		this.createSakuraList();
		this.startAnimation();
		this.isRunning = true;

		document.addEventListener(
			"visibilitychange",
			this.boundVisibilityHandler,
		);
	}

	private handleVisibilityChange(): void {
		if (document.hidden) {
			this.pauseAnimation();
		} else {
			this.resumeAnimation();
		}
	}

	private pauseAnimation(): void {
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	private resumeAnimation(): void {
		if (this.isRunning && this.animationId === null) {
			this.startAnimation();
		}
	}

	private createCanvas(): void {
		this.canvas = document.createElement("canvas");
		this.canvas.height = window.innerHeight;
		this.canvas.width = window.innerWidth;
		this.canvas.setAttribute(
			"style",
			`position: fixed; left: 0; top: 0; pointer-events: none; z-index: ${this.config.zIndex}; contain: strict;`,
		);
		this.canvas.setAttribute("id", "canvas_sakura");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		window.addEventListener("resize", this.boundResizeHandler, {
			passive: true,
		});
	}

	private createSakuraList(): void {
		if (!this.img || !this.ctx) {
			return;
		}

		this.sakuraList = new SakuraList();
		const limitArray = new Array(this.config.sakuraNum).fill(
			this.config.limitTimes,
		);

		for (let i = 0; i < this.config.sakuraNum; i++) {
			const randomX = getRandom("x", this.config);
			const randomY = getRandom("y", this.config);
			const randomS = getRandom("s", this.config);
			const randomR = getRandom("r", this.config);
			const randomA = getRandom("a", this.config);
			const randomFnx = getRandom("fnx", this.config);
			const randomFny = getRandom("fny", this.config);
			const randomFnR = getRandom("fnr", this.config);
			const randomFnA = getRandom("fna", this.config);

			const sakura = new Sakura(
				randomX,
				randomY,
				randomS,
				randomR,
				randomA,
				{
					x: randomFnx,
					y: randomFny,
					r: randomFnR,
					a: randomFnA,
				},
				i,
				this.img,
				limitArray,
				this.config,
			);

			sakura.draw(this.ctx);
			this.sakuraList.push(sakura);
		}
	}

	private startAnimation(): void {
		if (!this.ctx || !this.canvas || !this.sakuraList) {
			return;
		}

		const animate = () => {
			if (!this.ctx || !this.canvas || !this.sakuraList) {
				return;
			}

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.sakuraList.update();
			this.sakuraList.draw(this.ctx);
			this.animationId = requestAnimationFrame(animate);
		};

		this.animationId = requestAnimationFrame(animate);
	}

	private handleResize(): void {
		if (this.resizeTimeout) {
			cancelAnimationFrame(this.resizeTimeout);
		}
		this.resizeTimeout = requestAnimationFrame(() => {
			if (this.canvas) {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}
		});
	}

	stop(): void {
		this.pauseAnimation();

		if (this.resizeTimeout) {
			cancelAnimationFrame(this.resizeTimeout);
			this.resizeTimeout = null;
		}

		if (this.canvas) {
			document.body.removeChild(this.canvas);
			this.canvas = null;
		}

		window.removeEventListener("resize", this.boundResizeHandler);
		document.removeEventListener(
			"visibilitychange",
			this.boundVisibilityHandler,
		);
		this.isRunning = false;
	}

	toggle(): void {
		if (this.isRunning) {
			this.stop();
		} else {
			this.init();
		}
	}

	updateConfig(newConfig: SakuraConfig): void {
		const wasRunning = this.isRunning;
		if (wasRunning) {
			this.stop();
		}
		this.config = newConfig;
		if (wasRunning && newConfig.enable) {
			this.init();
		}
	}

	getIsRunning(): boolean {
		return this.isRunning;
	}
}

let globalSakuraManager: SakuraManager | null = null;

export function initSakura(config: SakuraConfig): void {
	if (globalSakuraManager) {
		globalSakuraManager.updateConfig(config);
	} else {
		globalSakuraManager = new SakuraManager(config);
		if (config.enable) {
			globalSakuraManager.init();
		}
	}
}

export function toggleSakura(): void {
	if (globalSakuraManager) {
		globalSakuraManager.toggle();
	}
}

export function stopSakura(): void {
	if (globalSakuraManager) {
		globalSakuraManager.stop();
		globalSakuraManager = null;
	}
}

export function getSakuraStatus(): boolean {
	return globalSakuraManager ? globalSakuraManager.getIsRunning() : false;
}
