export {};

declare global {
	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
			regenerateTOC?: () => void;
		};
	}

	/**
	 * Swup hooks interface for type-safe swup access
	 */
	interface Swup {
		hooks: {
			on: (event: string, handler: (...args: unknown[]) => void) => void;
			off: (event: string, handler: (...args: unknown[]) => void) => void;
		};
		navigate?: (url: string, options?: { history?: boolean }) => void;
		preload?: (url: string) => Promise<void>;
	}

	/**
	 * Site config TOC section interface
	 */
	interface SiteConfigTOC {
		enable?: boolean;
		mode?: "float" | "sidebar";
		depth?: number;
		useJapaneseBadge?: boolean;
	}

	/**
	 * Site config interface for type-safe global siteConfig access
	 */
	interface SiteConfigWindow {
		lang?: string;
		toc?: SiteConfigTOC;
		wallpaperMode?: {
			defaultMode?: "banner" | "fullscreen" | "none";
		};
	}

	interface Window {
		swup: Swup | undefined;
		closeAnnouncement: () => void;
		pagefind: {
			search: (query: string) => Promise<{
				results: {
					data: () => Promise<SearchResult>;
				}[];
			}>;
		};

		loadPagefind?: () => Promise<void>;
		toggleFloatingTOC?: () => void;
		mobileTOCInit?: () => void;
		initSemifullScrollDetection?: () => void;
		iconifyLoaded?: boolean;

		CardTOC?: {
			manager: {
				init?: () => void;
				cleanup?: () => void;
			} | null;
		};

		tocInternalNavigation?: boolean;
		__iconifyLoader?: {
			load: (options?: { timeout?: number; retryCount?: number }) => Promise<void>;
			addToPreloadQueue: (icons: string | string[]) => void;
			onLoad: (callback: () => void) => void;
			isLoaded: boolean;
			isLoading: boolean;
			preloadIcons: (icons: string[]) => Promise<void>;
		};
		__iconifyLoaderInitialized?: boolean;
		__pioInstance?: unknown;
		__wallpaper_cleanup?: (() => void) | null;
		loadIconify?: () => Promise<void>;
		preloadIcons?: (icons: string[]) => void;
		onIconifyReady?: (callback: () => void) => void;
		siteConfig: SiteConfigWindow;
		hljs?: {
			highlightElement: (block: HTMLElement) => void;
		};
		renderMermaidDiagrams?: () => void;

		__mizukiSidebarResizeHandler?: () => void;
		__mizukiSidebarSwupHooked?: boolean;
		__mizukiSidebarManagerInitialized?: boolean;
		__mizukiRightSidebarResizeHandler?: () => void;
		__mizukiRightSidebarSwupHooked?: boolean;
		__mizukiRightSidebarManagerInitialized?: boolean;

		panelManager?: any;
		themeOptimizer?: any;
		CodeBlockCollapser?: any;
		codeBlockCollapser?: any;
		rightSidebarLayout?: any;
		sakuraInitialized?: boolean;
	}

	interface Fancybox {
		unbind: (selector: string) => void;
		bind: (selector: string, options: object) => void;
	}

	var Fancybox: Fancybox | undefined;
}

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: {
		element: string;
		id: string;
		text: string;
		location: number;
	}[];
	weighted_locations?: {
		weight: number;
		balanced_score: number;
		location: number;
	}[];
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}

export { SearchResult };
