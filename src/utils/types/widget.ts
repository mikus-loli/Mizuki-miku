import type {
	WidgetComponentConfig,
} from "@/types/config";

/**
 * Widget 组件配置
 */
export interface WidgetConfig extends WidgetComponentConfig {
	customProps?: Record<string, unknown>;
}
