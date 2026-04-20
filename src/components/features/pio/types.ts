export interface PioConfig {
	enable: boolean;
	mode?: string;
	hiddenOnMobile?: boolean;
	position?: "left" | "right";
	width?: number;
	height?: number;
	dialog?: Record<string, unknown>;
	models?: string[];
	minResolution?: {
		width?: number;
		height?: number;
	};
}

export interface PioProps {
	config?: Partial<PioConfig>;
}
