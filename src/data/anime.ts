// 本地番剧数据配置
export type AnimeItem = {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
};

const localAnimeList: AnimeItem[] = [
	{
		title: "轻音少女",
		status: "completed",
		rating: 9.9,
		cover: "/assets/anime/轻音少女.webp",
		description: "女孩子们的日常，甜美治愈",
		episodes: "12 episodes",
		year: "2015",
		genre: ["日常", "治愈"],
		studio: "京都动画",
		link: "https://www.bilibili.com/bangumi/media/md28220978",
		progress: 12,
		totalEpisodes: 12,
		startDate: "2022-07",
		endDate: "2022-09",
	},
];

export default localAnimeList;
