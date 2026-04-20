<script lang="ts">
	import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";
	import Icon from "@iconify/svelte";
	import { getStoredTheme, setTheme } from "@utils/setting-utils";
	import { onDestroy,onMount } from "svelte";

	import type { LIGHT_DARK_MODE } from "@/types/config.ts";

	const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
	let mode: LIGHT_DARK_MODE = $state(DEFAULT_THEME);
	let isChanging = false;

	let cleanupFns: (() => void)[] = [];

	onMount(() => {
		mode = getStoredTheme();

		const handleContentReplace = () => {
			requestAnimationFrame(() => {
				const newMode = getStoredTheme();
				if (mode !== newMode) {
					mode = newMode;
				}
			});
		};

		const swup = (window as any).swup;
		if (swup?.hooks) {
			swup.hooks.on("content:replace", handleContentReplace);
			cleanupFns.push(() => {
				if ((window as any).swup?.hooks) {
					(window as any).swup.hooks.off("content:replace", handleContentReplace);
				}
			});
		} else {
			const onSwupEnable = () => {
				const swup = (window as any).swup;
				if (swup?.hooks) {
					swup.hooks.on("content:replace", handleContentReplace);
					cleanupFns.push(() => {
						if ((window as any).swup?.hooks) {
							(window as any).swup.hooks.off("content:replace", handleContentReplace);
						}
					});
				}
			};
			document.addEventListener("swup:enable", onSwupEnable);
			cleanupFns.push(() => {
				document.removeEventListener("swup:enable", onSwupEnable);
			});
		}

		const onDOMContentLoaded = () => {
			requestAnimationFrame(() => {
				const newMode = getStoredTheme();
				if (mode !== newMode) {
					mode = newMode;
				}
			});
		};
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
		cleanupFns.push(() => {
			document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
		});
	});

	onDestroy(() => {
		cleanupFns.forEach((fn) => fn());
		cleanupFns = [];
	});

	function switchScheme(newMode: LIGHT_DARK_MODE) {
		if (isChanging) {
			return;
		}

		isChanging = true;
		mode = newMode;
		setTheme(newMode);

		setTimeout(() => {
			isChanging = false;
		}, 50);
	}

	function toggleScheme() {
		if (isChanging) {
			return;
		}

		let i = 0;
		for (; i < seq.length; i++) {
			if (seq[i] === mode) {
				break;
			}
		}
		switchScheme(seq[(i + 1) % seq.length]);
	}
</script>

<button
	aria-label="Light/Dark Mode"
	class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn z-50"
	id="scheme-switch"
	onclick={toggleScheme}
	data-mode={mode}
>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== LIGHT_MODE}
		class:rotate-180={mode !== LIGHT_MODE}
	>
		<Icon
			icon="material-symbols:wb-sunny-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== DARK_MODE}
		class:rotate-180={mode !== DARK_MODE}
	>
		<Icon
			icon="material-symbols:dark-mode-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
</button>

<style>
	.theme-switch-btn::before {
		transition:
			transform 75ms ease-out,
			background-color 0ms !important;
	}
</style>
