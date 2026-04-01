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
		title: "超天酱",
		imgurl: "https://www.pr80.bid/ctos/icon/exe.png",
		desc: "超绝最可爱天使酱",
		siteurl: "https://www.pr80.bid",
		tags: ["Blog"],
	},

	{
		id: 3,
		title: "璃奈的小窝",
		imgurl: "https://easyimage.mikus.ink/i/u/2026/01/18/xksikg.webp",
		desc: "欢迎来到猪咪的小窝喵！",
		siteurl: "https://arkn.icu/",
		tags: ["Blog"],
	},

	{
		id: 4,
		title: "WitchCat",
		imgurl: "https://www.witchcat.cn/api/proxy-image?url=http%3A%2F%2F121.40.94.142%3A9000%2Fwitchcat-files%2Fsite_images%2Fprofile%2F8567d1f6-62a3-412e-b9b1-76d2f9c10c6c.jpg",
		desc: "可爱的女巫的折耳猫的小站",
		siteurl: "https://www.witchcat.cn",
		tags: ["Blog"],
	},

	{
		id: 5,
		title: "昆明湖 blog",
		imgurl: "https://blog.91vip.ink/favicon/avatar.webp",
		desc: "最喜欢宁宁",
		siteurl: "https://blog.91vip.ink",
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
