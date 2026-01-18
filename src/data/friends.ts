// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "thoelc blog",
		imgurl: "https://labwt.com/upload/favicon.png",
		desc: "QAQ",
		siteurl: "https://labwt.com",
		tags: ["Blog"],
	},
	{
		id: 2,
		title: "昆明湖 blog",
		imgurl: "https://blog.91vip.ink/_astro/avatar.Bp1MIY3n_113upO.webp",
		desc: "最喜欢宁宁",
		siteurl: "https://blog.91vip.ink",
		tags: ["Blog"],
	},

	{
		id: 3,
		title: "璃奈的小窝",
		imgurl: "https://arkn.icu/images/redefine-logo.png",
		desc: "欢迎来到猪咪的小窝喵！",
		siteurl: "https://arkn.icu/",
		tags: ["Blog"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
