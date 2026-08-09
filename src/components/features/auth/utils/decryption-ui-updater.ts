export interface UIUpdateStep {
	name: string;
	execute(): Promise<void> | void;
}

const highlightCodeStep: UIUpdateStep = {
	name: "highlight-code",
	execute() {
		if (!window.hljs) {
			return;
		}

		const contentDiv = document.getElementById("decrypted-content");
		if (!contentDiv) {
			return;
		}

		contentDiv.querySelectorAll("pre code").forEach((block) => {
			window.hljs!.highlightElement(block as HTMLElement);
		});
	},
};

const regenerateTOCStep: UIUpdateStep = {
	name: "regenerate-toc",
	execute() {
		const tocElement = document.querySelector("table-of-contents") as
			| (HTMLElement & { init?: () => void; regenerateTOC?: () => void })
			| null;
		if (!tocElement) {
			return;
		}

		if (typeof tocElement.regenerateTOC === "function") {
			tocElement.regenerateTOC();
		}
		if (typeof tocElement.init === "function") {
			tocElement.init();
		}
	},
};

const mobileTOCStep: UIUpdateStep = {
	name: "mobile-toc",
	execute() {
		if (typeof window.mobileTOCInit === "function") {
			window.mobileTOCInit();
		}
	},
};

const bindFancyboxStep: UIUpdateStep = {
	name: "bind-fancybox",
	execute() {
		if (typeof Fancybox === "undefined" || !Fancybox.bind) {
			return;
		}

		Fancybox.unbind("[data-fancybox]");
		Fancybox.bind("[data-fancybox]", {});
	},
};

const hashNavigationStep: UIUpdateStep = {
	name: "hash-navigation",
	execute() {
		if (!window.location.hash) {
			return;
		}

		const targetId = window.location.hash.substring(1);
		const targetElement = document.getElementById(targetId);
		if (targetElement) {
			targetElement.scrollIntoView({ behavior: "smooth" });
		}
	},
};

const imageLoadEventsStep: UIUpdateStep = {
	name: "image-load-events",
	execute() {
		const contentDiv = document.getElementById("decrypted-content");
		if (!contentDiv) {
			return;
		}

		const images = contentDiv.querySelectorAll("img");
		images.forEach((img) => {
			if (!img.complete) {
				img.addEventListener("load", () => {
					window.dispatchEvent(new Event("scroll"));
					window.dispatchEvent(new Event("resize"));
				});
			}
		});

		[0, 100, 300, 500, 1000, 2000].forEach((delay) => {
			setTimeout(() => {
				window.dispatchEvent(new Event("scroll"));
				window.dispatchEvent(new Event("resize"));
			}, delay);
		});
	},
};

const mermaidRenderStep: UIUpdateStep = {
	name: "mermaid-render",
	async execute() {
		if (typeof window.renderMermaidDiagrams !== "function") {
			return;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
		window.renderMermaidDiagrams();
	},
};

export function createDefaultUpdateSteps(): UIUpdateStep[] {
	return [
		highlightCodeStep,
		regenerateTOCStep,
		mobileTOCStep,
		bindFancyboxStep,
		hashNavigationStep,
		imageLoadEventsStep,
		mermaidRenderStep,
	];
}

export class DecryptionUIUpdater {
	private steps: UIUpdateStep[];
	private delay: number;

	constructor(steps: UIUpdateStep[], delay: number = 50) {
		this.steps = steps;
		this.delay = delay;
	}

	async execute(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(async () => {
				for (const step of this.steps) {
					try {
						await step.execute();
					} catch (error) {
						console.error(
							`[UIUpdater] Step "${step.name}" failed:`,
							error,
						);
					}
				}
				resolve();
			}, this.delay);
		});
	}

	addStep(step: UIUpdateStep): void {
		this.steps.push(step);
	}

	removeStep(name: string): void {
		this.steps = this.steps.filter((step) => step.name !== name);
	}
}

export function triggerPostDecryptUpdates(): Promise<void> {
	const updater = new DecryptionUIUpdater(createDefaultUpdateSteps());
	return updater.execute();
}
