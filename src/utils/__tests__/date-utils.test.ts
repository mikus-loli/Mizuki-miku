import { describe, expect, it } from "vitest";

import { formatDateI18n, formatDateToYYYYMMDD } from "../date-utils";
import { formatRelativeTime } from "../timeFormat";

describe("formatDateToYYYYMMDD", () => {
	it("格式化为 YYYY-MM-DD", () => {
		expect(formatDateToYYYYMMDD(new Date("2026-08-08T12:00:00Z"))).toBe(
			"2026-08-08",
		);
	});

	it("UTC 边界日期正确", () => {
		expect(formatDateToYYYYMMDD(new Date("2026-12-31T23:59:59Z"))).toBe(
			"2026-12-31",
		);
	});
});

describe("formatDateI18n", () => {
	it("zh_CN 返回中文日期格式", () => {
		const result = formatDateI18n("2026-08-08T00:00:00Z");
		expect(result).toContain("2026");
		expect(result).toContain("8");
	});
});

describe("formatRelativeTime", () => {
	it("1 小时内返回分钟数", () => {
		const now = new Date();
		const past = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
		expect(formatRelativeTime(past, "分钟前", "小时前", "天前")).toBe(
			"30分钟前",
		);
	});

	it("24 小时内返回小时数", () => {
		const now = new Date();
		const past = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
		expect(formatRelativeTime(past, "分钟前", "小时前", "天前")).toBe(
			"3小时前",
		);
	});

	it("超过 24 小时返回天数", () => {
		const now = new Date();
		const past = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
		expect(formatRelativeTime(past, "分钟前", "小时前", "天前")).toBe(
			"3天前",
		);
	});
});
