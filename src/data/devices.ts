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
			image: "/images/device/mt3000.png",
			specs: "1000Mbps / 2.5G",
			description:
				"Portable WiFi 6 router suitable for business trips and home use.",
			link: "https://www.gl-inet.cn/products/gl-mt3000/",
		},
	],
};
