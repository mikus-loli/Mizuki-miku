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
	OnePlus: [
		{
			name: "红米 K60",
			image: "/images/device/k60.png",
			specs: "墨羽 / 8G + 256G",
			description:
				"骁龙8+，自研「狂暴引擎」性能强劲释放 以Pro配置重新定义标准版！",
			link: "https://www.mi.com/redmi-k60",
		},
	],
	Router: [
		{
			name: "小米路由器 AX3000T",
			image: "/images/device/ax3000t.png",
			specs: "1000Mbps / 1G",
			description:
				"满血 WiFi6疾速快人一步 3000兆级无线速率 加倍吞吐量 网速疾驰 4K电影拖拽秒缓冲",
			link: "https://www.mi.com/xiaomi-ax3000t",
		},
	],
};
