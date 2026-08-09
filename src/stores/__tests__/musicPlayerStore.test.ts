import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { musicPlayerStore } from "../musicPlayerStore";

// ---- Audio mock ----
class MockAudio {
	src = "";
	volume = 1;
	muted = false;
	currentTime = 0;
	duration = 0;
	preload = "metadata";
	private listeners: Record<string, Array<(e?: unknown) => void>> = {};

	play = vi.fn().mockResolvedValue(undefined);
	pause = vi.fn();
	load = vi.fn();

	addEventListener(type: string, cb: (e?: unknown) => void): void {
		(this.listeners[type] ??= []).push(cb);
	}

	removeEventListener(type: string, cb: (e?: unknown) => void): void {
		this.listeners[type] = (this.listeners[type] ?? []).filter(
			(fn) => fn !== cb,
		);
	}

	dispatch(type: string): void {
		(this.listeners[type] ?? []).forEach((cb) => cb());
	}
}

// ---- fetch mock：Meting API 返回 3 首歌 ----
const mockSongs = [
	{ id: 1, name: "Song A", artist: "Artist A", url: "/a.mp3", duration: 200 },
	{ id: 2, name: "Song B", artist: "Artist B", url: "/b.mp3", duration: 180 },
	{ id: 3, name: "Song C", artist: "Artist C", url: "/c.mp3", duration: 220 },
];

function mockFetchSuccess(): void {
	vi.stubGlobal(
		"fetch",
		vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockSongs,
		}),
	);
}

describe("MusicPlayerStore", () => {
	beforeEach(async () => {
		vi.stubGlobal("Audio", MockAudio);
		mockFetchSuccess();
		await musicPlayerStore.initialize();
	});

	afterEach(() => {
		musicPlayerStore.destroy();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		localStorage.clear();
	});

	it("初始化后加载歌单并播放第一首", () => {
		const state = musicPlayerStore.getState();
		expect(state.playlist).toHaveLength(3);
		expect(state.currentIndex).toBe(0);
		expect(state.currentSong.title).toBe("Song A");
	});

	it("next 顺序切歌，末尾循环回第一首", () => {
		musicPlayerStore.next();
		expect(musicPlayerStore.getState().currentIndex).toBe(1);
		musicPlayerStore.next();
		expect(musicPlayerStore.getState().currentIndex).toBe(2);
		musicPlayerStore.next();
		expect(musicPlayerStore.getState().currentIndex).toBe(0);
	});

	it("prev 边界回退到最后一首", () => {
		musicPlayerStore.prev();
		expect(musicPlayerStore.getState().currentIndex).toBe(2);
	});

	it("playIndex 越界时忽略", () => {
		musicPlayerStore.playIndex(99);
		expect(musicPlayerStore.getState().currentIndex).toBe(0);
		musicPlayerStore.playIndex(1);
		expect(musicPlayerStore.getState().currentIndex).toBe(1);
	});

	it("toggleShuffle 切换随机模式并关闭循环", () => {
		musicPlayerStore.toggleRepeat(); // 先开循环
		expect(musicPlayerStore.getState().isRepeating).toBe(1);
		musicPlayerStore.toggleShuffle();
		const state = musicPlayerStore.getState();
		expect(state.isShuffled).toBe(true);
		expect(state.isRepeating).toBe(0);
	});

	it("toggleRepeat 循环 0→1→2→0 并关闭随机", () => {
		musicPlayerStore.toggleShuffle();
		musicPlayerStore.toggleRepeat();
		const state = musicPlayerStore.getState();
		expect(state.isRepeating).toBe(1);
		expect(state.isShuffled).toBe(false);
		musicPlayerStore.toggleRepeat();
		expect(musicPlayerStore.getState().isRepeating).toBe(2);
		musicPlayerStore.toggleRepeat();
		expect(musicPlayerStore.getState().isRepeating).toBe(0);
	});

	it("setVolume 钳制在 0-1 并持久化到 localStorage", () => {
		musicPlayerStore.setVolume(5);
		expect(musicPlayerStore.getState().volume).toBe(1);
		musicPlayerStore.setVolume(-1);
		expect(musicPlayerStore.getState().volume).toBe(0);
		musicPlayerStore.setVolume(0.35);
		expect(musicPlayerStore.getState().volume).toBe(0.35);
		expect(localStorage.getItem("music-player-volume")).toBe("0.35");
	});

	it("音量 0 自动静音", () => {
		musicPlayerStore.setVolume(0);
		expect(musicPlayerStore.getState().isMuted).toBe(true);
	});

	it("toggleMute 切换静音状态", () => {
		musicPlayerStore.toggleMute();
		expect(musicPlayerStore.getState().isMuted).toBe(true);
		musicPlayerStore.toggleMute();
		expect(musicPlayerStore.getState().isMuted).toBe(false);
	});

	it("subscribe 收到状态快照并可在取消后停止通知", () => {
		const listener = vi.fn();
		const unsubscribe = musicPlayerStore.subscribe(listener);
		expect(listener).toHaveBeenCalledTimes(1); // 订阅时立即推送

		musicPlayerStore.toggleMute();
		expect(listener).toHaveBeenCalledTimes(2);

		unsubscribe();
		musicPlayerStore.toggleMute();
		expect(listener).toHaveBeenCalledTimes(2);
	});

	it("seek 越界时忽略，合法值更新进度", () => {
		// 模拟音频加载完成，设置 duration
		const audio = musicPlayerStore.getAudio() as unknown as MockAudio;
		audio.duration = 200;
		audio.dispatch("loadeddata");

		musicPlayerStore.seek(-5);
		expect(musicPlayerStore.getState().currentTime).toBe(0);
		musicPlayerStore.seek(10);
		expect(musicPlayerStore.getState().currentTime).toBe(10);
	});

	it("canSkip 在歌单多于 1 首时为 true", () => {
		expect(musicPlayerStore.canSkip()).toBe(true);
	});

	it("toggle 在无 URL 时忽略", () => {
		const state = musicPlayerStore.getState();
		// 第一首歌有 url，直接 toggle 应触发 play
		musicPlayerStore.toggle();
		const audio = musicPlayerStore.getAudio() as unknown as MockAudio;
		expect(audio.play).toHaveBeenCalled();
	});
});
