import Key from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

import {
	DEFAULT_METING_API,
	DEFAULT_METING_ID,
	DEFAULT_METING_SERVER,
	DEFAULT_METING_TYPE,
	DEFAULT_SONG,
	ERROR_DISPLAY_DURATION,
	FETCH_TIMEOUT_MS,
	LOCAL_PLAYLIST,
	SKIP_ERROR_DELAY,
	STORAGE_KEY_VOLUME,
	TIMEUPDATE_THROTTLE_MS,
} from "@/components/widgets/music-player/constants";
import type {
	MetingSong,
	RepeatMode,
	Song,
} from "@/components/widgets/music-player/types";
import { musicPlayerConfig } from "@/config";

export interface MusicPlayerState {
	currentSong: Song;
	playlist: Song[];
	currentIndex: number;
	isPlaying: boolean;
	isLoading: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isShuffled: boolean;
	isRepeating: RepeatMode;
	showPlaylist: boolean;
	errorMessage: string;
	showError: boolean;
	isExpanded: boolean;
	isHidden: boolean;
	autoplayFailed: boolean;
	willAutoPlay: boolean;
}

function getAssetPath(path: string): string {
	if (!path) {
		return "";
	}
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}
	if (path.startsWith("/")) {
		return path;
	}
	return `/${path}`;
}

function safeLocalStorageSetItem(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		console.warn(
			"localStorage.setItem failed — possibly in private browsing mode",
		);
	}
}

function safeLocalStorageGetItem(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

class MusicPlayerStore {
	private audio: HTMLAudioElement | null = null;
	private state: MusicPlayerState;
	private isInitialized = false;
	private unregisterInteraction: (() => void) | undefined;
	private listeners = new Set<(state: MusicPlayerState) => void>();
	private lastTimeupdateBroadcast = 0;
	private timeupdateRafId: number | null = null;

	constructor() {
		this.state = this.createInitialState();
	}

	private createInitialState(): MusicPlayerState {
		return {
			currentSong: { ...DEFAULT_SONG },
			playlist: [],
			currentIndex: 0,
			isPlaying: false,
			isLoading: false,
			currentTime: 0,
			duration: 0,
			volume: 0.7,
			isMuted: false,
			isShuffled: false,
			isRepeating: 0,
			showPlaylist: false,
			errorMessage: "",
			showError: false,
			isExpanded: false,
			isHidden: false,
			autoplayFailed: false,
			willAutoPlay: false,
		};
	}

	private createSnapshot(): MusicPlayerState {
		return {
			...this.state,
			currentSong: { ...this.state.currentSong },
			playlist: this.state.playlist,
		};
	}

	getState(): MusicPlayerState {
		return this.createSnapshot();
	}

	getAudio(): HTMLAudioElement | null {
		return this.audio;
	}

	subscribe(listener: (state: MusicPlayerState) => void): () => void {
		this.listeners.add(listener);
		listener(this.createSnapshot());
		return () => {
			this.listeners.delete(listener);
		};
	}

	async initialize(): Promise<void> {
		if (typeof window === "undefined" || this.isInitialized) {
			return;
		}
		this.isInitialized = true;

		if (!musicPlayerConfig.enable) {
			return;
		}

		this.audio = new Audio();
		this.audio.preload = "metadata";
		this.setupAudioListeners();
		this.loadVolumeFromStorage();
		this.registerInteractionHandler();
		await this.loadPlaylist();
	}

	private setupAudioListeners(): void {
		if (!this.audio) {
			return;
		}

		this.audio.volume = this.state.volume;
		this.audio.muted = this.state.isMuted;

		this.audio.addEventListener("play", () => {
			this.state.isPlaying = true;
			this.broadcastState();
		});

		this.audio.addEventListener("pause", () => {
			this.state.isPlaying = false;
			this.broadcastState();
		});

		this.audio.addEventListener("timeupdate", () => {
			if (!this.audio) {
				return;
			}
			this.state.currentTime = this.audio.currentTime;
			const now = performance.now();
			if (now - this.lastTimeupdateBroadcast >= TIMEUPDATE_THROTTLE_MS) {
				this.lastTimeupdateBroadcast = now;
				this.broadcastState();
			} else if (!this.timeupdateRafId) {
				this.timeupdateRafId = requestAnimationFrame(() => {
					this.timeupdateRafId = null;
					this.broadcastState();
				});
			}
		});

		this.audio.addEventListener("ended", () => {
			this.handleAudioEnded();
		});

		this.audio.addEventListener("error", () => {
			this.handleAudioError();
		});

		this.audio.addEventListener("loadeddata", () => {
			this.handleAudioLoaded();
		});

		this.audio.addEventListener("loadstart", () => {
			this.state.isLoading = true;
			this.broadcastState();
		});
	}

	private handleAudioEnded(): void {
		if (this.state.isRepeating === 1) {
			if (this.audio) {
				this.audio.currentTime = 0;
				this.audio.play().catch((err) => {
					console.warn("Audio replay failed:", err);
				});
			}
		} else {
			this.next(true);
		}
	}

	private handleAudioError(): void {
		this.state.isLoading = false;
		this.showError(i18n(Key.musicPlayerErrorSong));

		if (this.state.playlist.length > 1) {
			setTimeout(() => this.next(true), SKIP_ERROR_DELAY);
		} else if (this.state.playlist.length <= 1) {
			this.showError(i18n(Key.musicPlayerErrorEmpty));
		}
		this.broadcastState();
	}

	private handleAudioLoaded(): void {
		this.state.isLoading = false;
		if (this.audio?.duration && this.audio.duration > 1) {
			this.state.duration = Math.floor(this.audio.duration);
			this.state.currentSong = {
				...this.state.currentSong,
				duration: this.state.duration,
			};
		}

		if (this.state.willAutoPlay || this.state.isPlaying) {
			const playPromise = this.audio?.play();
			if (playPromise !== undefined) {
				playPromise.catch((err) => {
					console.warn("Autoplay blocked:", err);
					this.state.autoplayFailed = true;
					this.state.isPlaying = false;
				});
			}
		}
		this.broadcastState();
	}

	private loadVolumeFromStorage(): void {
		const savedVolume = safeLocalStorageGetItem(STORAGE_KEY_VOLUME);
		if (savedVolume) {
			const volume = parseFloat(savedVolume);
			if (!isNaN(volume) && volume >= 0 && volume <= 1) {
				this.state.volume = volume;
				this.state.isMuted = volume === 0;
				if (this.audio) {
					this.audio.volume = volume;
					this.audio.muted = this.state.isMuted;
				}
			}
		}
	}

	private registerInteractionHandler(): void {
		const handler = () => {
			if (this.state.autoplayFailed && this.audio) {
				const playPromise = this.audio.play();
				if (playPromise !== undefined) {
					playPromise
						.then(() => {
							this.state.autoplayFailed = false;
						})
						.catch((err) => {
							console.warn("Interaction play failed:", err);
						});
				}
			}
		};
		document.addEventListener("click", handler, { once: true });
		document.addEventListener("keydown", handler, { once: true });
		this.unregisterInteraction = () => {
			document.removeEventListener("click", handler);
			document.removeEventListener("keydown", handler);
		};
	}

	private async loadPlaylist(): Promise<void> {
		const mode = musicPlayerConfig.mode ?? "meting";
		const meting_api = musicPlayerConfig.meting_api ?? DEFAULT_METING_API;
		const meting_id = musicPlayerConfig.id ?? DEFAULT_METING_ID;
		const meting_server = musicPlayerConfig.server ?? DEFAULT_METING_SERVER;
		const meting_type = musicPlayerConfig.type ?? DEFAULT_METING_TYPE;

		if (mode === "meting") {
			await this.fetchMetingPlaylist(
				meting_api,
				meting_server,
				meting_type,
				meting_id,
			);
		} else {
			this.loadLocalPlaylist();
		}
	}

	private async fetchMetingPlaylist(
		api: string,
		server: string,
		type: string,
		id: string,
	): Promise<void> {
		if (!api || !id) {
			return;
		}

		this.state.isLoading = true;
		this.broadcastState();

		const apiUrl = api
			.replace(":server", server)
			.replace(":type", type)
			.replace(":id", id)
			.replace(":auth", "")
			.replace(":r", Date.now().toString());

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(
				() => controller.abort(),
				FETCH_TIMEOUT_MS,
			);
			const res = await fetch(apiUrl, { signal: controller.signal });
			clearTimeout(timeoutId);

			if (!res.ok) {
				throw new Error(`Meting API error: ${res.status}`);
			}
			const list: MetingSong[] = await res.json();
			this.state.playlist = list.map((song) =>
				this.convertMetingSong(song),
			);
			this.state.isLoading = false;

			if (this.state.playlist.length > 0) {
				this.loadSong(this.state.playlist[0], false);
			}
		} catch (e) {
			console.warn("Failed to fetch Meting playlist:", e);
			this.showError(i18n(Key.musicPlayerErrorPlaylist));
			this.state.isLoading = false;
		}
		this.broadcastState();
	}

	private convertMetingSong(song: MetingSong): Song {
		const title = song.name ?? song.title ?? i18n(Key.unknownSong);
		const artist = song.artist ?? song.author ?? i18n(Key.unknownArtist);
		let dur = song.duration ?? 0;
		if (typeof dur === "string") {
			dur = parseInt(dur, 10);
		}
		if (dur > 10000) {
			dur = Math.floor(dur / 1000);
		}
		if (!Number.isFinite(dur) || dur <= 0) {
			dur = 0;
		}

		return {
			id:
				typeof song.id === "string"
					? parseInt(song.id, 10)
					: (song.id ?? 0),
			title,
			artist,
			cover: song.pic ?? "",
			url: song.url ?? "",
			duration: dur,
		};
	}

	private loadLocalPlaylist(): void {
		this.state.playlist = [...LOCAL_PLAYLIST];
		if (this.state.playlist.length === 0) {
			this.showError("本地播放列表为空");
		} else {
			this.loadSong(this.state.playlist[0], false);
		}
	}

	private loadSong(song: Song, autoPlay = true): void {
		if (!song) {
			return;
		}
		if (song.url !== this.state.currentSong.url) {
			this.state.currentSong = { ...song };
			if (song.url) {
				this.state.isLoading = true;
			} else {
				this.state.isLoading = false;
			}
		}
		this.state.willAutoPlay = autoPlay;
		if (this.audio) {
			if (this.audio.src && song.url) {
				this.audio.src = "";
			}
			this.audio.src = getAssetPath(song.url);
			this.audio.load();
		}
		this.broadcastState();
	}

	private showError(message: string): void {
		this.state.errorMessage = message;
		this.state.showError = true;
		setTimeout(() => {
			this.state.showError = false;
			this.broadcastState();
		}, ERROR_DISPLAY_DURATION);
		this.broadcastState();
	}

	hideError(): void {
		this.state.showError = false;
		this.broadcastState();
	}

	toggle(): void {
		if (!this.audio || !this.state.currentSong.url) {
			return;
		}
		if (this.state.isPlaying) {
			this.audio.pause();
		} else {
			this.audio.play().catch((err) => {
				console.warn("Toggle play failed:", err);
			});
		}
	}

	play(): void {
		if (!this.audio || !this.state.currentSong.url) {
			return;
		}
		this.audio.play().catch((err) => {
			console.warn("Play failed:", err);
		});
	}

	pause(): void {
		if (!this.audio) {
			return;
		}
		this.audio.pause();
	}

	next(autoPlay = true): void {
		if (this.state.playlist.length <= 1) {
			return;
		}

		let newIndex: number;
		if (this.state.isShuffled) {
			do {
				newIndex = Math.floor(
					Math.random() * this.state.playlist.length,
				);
			} while (
				newIndex === this.state.currentIndex &&
				this.state.playlist.length > 1
			);
		} else {
			newIndex =
				this.state.currentIndex < this.state.playlist.length - 1
					? this.state.currentIndex + 1
					: 0;
		}

		this.state.currentIndex = newIndex;
		this.loadSong(this.state.playlist[newIndex], autoPlay);
	}

	prev(): void {
		if (this.state.playlist.length <= 1) {
			return;
		}
		const newIndex =
			this.state.currentIndex > 0
				? this.state.currentIndex - 1
				: this.state.playlist.length - 1;
		this.state.currentIndex = newIndex;
		this.loadSong(this.state.playlist[newIndex], true);
	}

	playIndex(index: number): void {
		if (index < 0 || index >= this.state.playlist.length) {
			return;
		}
		this.state.currentIndex = index;
		this.loadSong(this.state.playlist[index], true);
	}

	seek(time: number): void {
		if (!this.audio) {
			return;
		}
		if (time >= 0 && time <= this.state.duration) {
			this.audio.currentTime = time;
			this.state.currentTime = time;
			this.broadcastState();
		}
	}

	setVolume(volume: number): void {
		const clampedVolume = Math.max(0, Math.min(1, volume));
		this.state.volume = clampedVolume;
		this.state.isMuted = clampedVolume === 0;
		if (this.audio) {
			this.audio.volume = clampedVolume;
			this.audio.muted = this.state.isMuted;
		}
		safeLocalStorageSetItem(STORAGE_KEY_VOLUME, String(clampedVolume));
		this.broadcastState();
	}

	toggleMute(): void {
		this.state.isMuted = !this.state.isMuted;
		if (this.audio) {
			this.audio.muted = this.state.isMuted;
		}
		this.broadcastState();
	}

	toggleShuffle(): void {
		this.state.isShuffled = !this.state.isShuffled;
		if (this.state.isShuffled) {
			this.state.isRepeating = 0;
		}
		this.broadcastState();
	}

	toggleRepeat(): void {
		this.state.isRepeating = ((this.state.isRepeating + 1) %
			3) as RepeatMode;
		if (this.state.isRepeating !== 0) {
			this.state.isShuffled = false;
		}
		this.broadcastState();
	}

	toggleMode(): void {
		if (this.state.isShuffled) {
			this.toggleShuffle();
			return;
		}
		if (this.state.isRepeating === 2) {
			this.toggleRepeat();
			this.toggleShuffle();
			return;
		}
		this.toggleRepeat();
	}

	togglePlaylist(): void {
		this.state.showPlaylist = !this.state.showPlaylist;
		this.broadcastState();
	}

	toggleExpanded(): void {
		this.state.isExpanded = !this.state.isExpanded;
		if (this.state.isExpanded) {
			this.state.showPlaylist = false;
			this.state.isHidden = false;
		}
		this.broadcastState();
	}

	toggleHidden(): void {
		this.state.isHidden = !this.state.isHidden;
		if (this.state.isHidden) {
			this.state.isExpanded = false;
			this.state.showPlaylist = false;
		}
		this.broadcastState();
	}

	canSkip(): boolean {
		return this.state.playlist.length > 1;
	}

	setProgress(percent: number): void {
		if (!this.audio) {
			return;
		}
		const newTime = percent * this.state.duration;
		this.audio.currentTime = newTime;
		this.state.currentTime = newTime;
		this.broadcastState();
	}

	private broadcastState(): void {
		const snapshot = this.createSnapshot();

		for (const listener of this.listeners) {
			listener(snapshot);
		}

		if (typeof window === "undefined") {
			return;
		}
		window.dispatchEvent(
			new CustomEvent("music-sidebar:state", {
				detail: snapshot,
			}),
		);
	}

	destroy(): void {
		if (this.unregisterInteraction) {
			this.unregisterInteraction();
		}
		if (this.timeupdateRafId !== null) {
			cancelAnimationFrame(this.timeupdateRafId);
			this.timeupdateRafId = null;
		}
		if (this.audio) {
			this.audio.pause();
			this.audio.src = "";
			this.audio = null;
		}
		// 重置状态，确保重新 initialize 时是干净状态
		this.state = this.createInitialState();
		this.isInitialized = false;
	}
}

export const musicPlayerStore = new MusicPlayerStore();
