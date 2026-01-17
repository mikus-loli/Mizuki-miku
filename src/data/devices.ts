// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	手机: [
		{
			name: "红米 K40",
			image: "/images/device/k40.png",
			specs: "墨羽 / 8G + 128G",
			description:
				"性能有点狠，搭载年度旗舰骁龙 870,屏幕有点狠，新一代 E4 直屏，更斩获A+评级，游戏体验有点狠，电竞级高刷超级触控，",
			link: "https://www.mi.com/redmik40",
		},
		{
			name: "红米 K60",
			image: "/images/device/k60.png",
			specs: "墨羽 / 8G + 256G",
			description:
				"骁龙8+，自研「狂暴引擎」性能强劲释放 以Pro配置重新定义标准版！",
			link: "https://www.mi.com/redmi-k60",
		},
	],
	路由器: [
		{
			name: "小米路由器 AX3000T",
			image: "/images/device/ax3000t.png",
			specs: "1000Mbps / 1G",
			description:
				"满血 WiFi6疾速快人一步 3000兆级无线速率 加倍吞吐量 网速疾驰 4K电影拖拽秒缓冲",
			link: "https://www.mi.com/xiaomi-ax3000t",
		},
	],

	音箱: [
		{
			name: "小米小爱音箱Play 增强版",
			image: "/images/device/Play.png",
			specs: "小米 MEssh 1.0 / WiFi 2.4,BT 5.0",
			description:
				"内置红外遥控，一句话控制传统家电内置红外遥控，一句话控制传统家电",
			link: "https://www.mi.com/shop/buy/detail?product_id=14596&cfrom=search",
		},

		{
			name: "小米AI音箱（第二代）",
			image: "/images/device/Ai-2.png",
			specs: "组合立体声 / 低频饱满",
			description: "经典延续，体验升级低频饱满有深度，人声清晰有细节 ",
			link: "https://www.mi.com/shop/buy/detail?product_id=13878&cfrom=search",
		},
	],

	外设: [
		{
			name: "迈从A7 Pro",
			image: "/images/device/A7Pro.png",
			specs: "DPI 26000 / PAW3950 Ultra",
			description: "响应超快，超轻量化，游戏&办公双巅峰",
			link: "https://www.maicong.cn/detail?link_product=c7188fb0a718de9d8a67c458471f5b06",
		},

		{
			name: "艾石头ND63 Pro",
			image: "/images/device/ND63Pro.png",
			specs: "480MHZ主控芯片 / 8KHZ回报率",
			description: "0.001MMRT精度，双死区可调 不断触",
			link: "https://www.irok.cn/item/366",
		},
	],
};
