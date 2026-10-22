/**
 * LHCI 报告解析与聚合工具。
 *
 * `lhr-*.json` 是单个 Lighthouse Result（顶层 requestedUrl/categories/audits），
 * 而部分手工 fixture 或旧脚本会包一层 `{ results: [...] }`，这里两者都兼容。
 */

export const SCORE_METRICS = new Set([
	"performance",
	"accessibility",
	"best-practices",
	"seo",
]);

const MS_METRICS = new Set([
	"first-contentful-paint",
	"largest-contentful-paint",
	"total-blocking-time",
	"speed-index",
	"interactive",
]);

export function isScoreMetric(metric) {
	return SCORE_METRICS.has(metric);
}

export function isMsMetric(metric) {
	return MS_METRICS.has(metric);
}

/** 把一份报告规范化为 LHR 数组。 */
export function extractLhrResults(report) {
	if (Array.isArray(report?.results)) {
		return report.results;
	}
	if (report && (report.requestedUrl || report.categories || report.audits)) {
		return [report];
	}
	return [];
}

export function extractMetricsFromLhr(lhr) {
	const categories = lhr.categories || {};
	const audits = lhr.audits || {};

	return {
		performance: categories.performance?.score ?? 0,
		"first-contentful-paint":
			audits["first-contentful-paint"]?.numericValue ?? 0,
		"largest-contentful-paint":
			audits["largest-contentful-paint"]?.numericValue ?? 0,
		"cumulative-layout-shift":
			audits["cumulative-layout-shift"]?.numericValue ?? 0,
		"total-blocking-time":
			audits["total-blocking-time"]?.numericValue ?? 0,
		"speed-index": audits["speed-index"]?.numericValue ?? 0,
		interactive: audits["interactive"]?.numericValue ?? 0,
		accessibility: categories.accessibility?.score ?? 0,
		"best-practices": categories["best-practices"]?.score ?? 0,
		seo: categories.seo?.score ?? 0,
	};
}

export function extractResourceSizes(lhr) {
	const resourceSummary = lhr.audits?.["resource-summary"];
	const resourceSizes = {
		totalJsKB: 0,
		totalCssKB: 0,
		htmlKB: 0,
		totalKB: 0,
	};

	if (resourceSummary?.details?.items) {
		for (const item of resourceSummary.details.items) {
			const sizeKB = (item.size || 0) / 1024;
			switch (item.resourceType) {
				case "script":
					resourceSizes.totalJsKB += sizeKB;
					break;
				case "stylesheet":
					resourceSizes.totalCssKB += sizeKB;
					break;
				case "document":
					resourceSizes.htmlKB = sizeKB;
					break;
			}
			resourceSizes.totalKB += sizeKB;
		}
	}

	return resourceSizes;
}

/**
 * 聚合多个报告：同一 URL 的多次运行按**该 URL 的运行次数**取平均，
 * 而不是按全部报告文件数。
 *
 * @param {string[]} reportPaths
 * @param {(path: string) => unknown} readJson
 */
export function aggregateReports(reportPaths, readJson) {
	/** @type {Record<string, Record<string, number>>} */
	const metricSums = {};
	/** @type {Record<string, Record<string, number>>} */
	const resourceSums = {};
	/** @type {Record<string, number>} */
	const runs = {};

	for (const reportPath of reportPaths) {
		let report;
		try {
			report = readJson(reportPath);
		} catch (err) {
			console.error(
				`Failed to parse LHCI report ${reportPath}:`,
				err.message,
			);
			continue;
		}

		for (const lhr of extractLhrResults(report)) {
			const url = lhr.requestedUrl || lhr.finalUrl;
			if (!url) {
				continue;
			}

			runs[url] = (runs[url] || 0) + 1;
			metricSums[url] ||= {};
			resourceSums[url] ||= {
				totalJsKB: 0,
				totalCssKB: 0,
				htmlKB: 0,
				totalKB: 0,
			};

			const metrics = extractMetricsFromLhr(lhr);
			for (const [key, value] of Object.entries(metrics)) {
				if (typeof value === "number") {
					metricSums[url][key] = (metricSums[url][key] || 0) + value;
				}
			}

			const resourceSizes = extractResourceSizes(lhr);
			for (const [key, value] of Object.entries(resourceSizes)) {
				resourceSums[url][key] = (resourceSums[url][key] || 0) + value;
			}
		}
	}

	const metrics = {};
	const resourceSizes = {};
	for (const [url, count] of Object.entries(runs)) {
		metrics[url] = {};
		for (const [key, value] of Object.entries(metricSums[url])) {
			metrics[url][key] = value / count;
		}
		resourceSizes[url] = {};
		for (const [key, value] of Object.entries(resourceSums[url])) {
			resourceSizes[url][key] = value / count;
		}
	}

	return { metrics, resourceSizes, runs };
}
