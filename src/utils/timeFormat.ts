/**
 * Format relative time for diary moments
 * @param dateString ISO date string
 * @param minutesAgo text for minutes
 * @param hoursAgo text for hours
 * @param daysAgo text for days
 *
 * 注意：相对时间 = 绝对时间戳差值，与时区无关。
 * 之前实现把当前时间按站点时区平移后再相减，在非 UTC+8 的运行环境
 * （如 CI 的 UTC）会多算 8 小时。已移除时区转换。
 */
export function formatRelativeTime(
	dateString: string,
	minutesAgo: string,
	hoursAgo: string,
	daysAgo: string,
): string {
	const now = new Date();
	const date = new Date(dateString);
	const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

	if (diffInMinutes < 60) {
		return `${diffInMinutes}${minutesAgo}`;
	}
	if (diffInMinutes < 1440) {
		const hours = Math.floor(diffInMinutes / 60);
		return `${hours}${hoursAgo}`;
	}
	const days = Math.floor(diffInMinutes / 1440);
	return `${days}${daysAgo}`;
}
