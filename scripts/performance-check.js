/**
 * 性能检查脚本
 * 比较当前性能与基准，检测性能回归
 */

import { readFileSync } from "fs";
import { join } from "path";
import { globSync } from "glob";

import { aggregateReports, isScoreMetric } from "./lhci-metrics.js";

const DEFAULT_THRESHOLDS = {
	performance: 0.85,
	"first-contentful-paint": 2000,
	"largest-contentful-paint": 4000,
	"cumulative-layout-shift": 0.1,
	"total-blocking-time": 500,
	"speed-index": 4000,
	interactive: 5000,
	regressionPercent: 10,
};

/**
 * 加载性能基准
 */
function loadBaseline(baselinePath) {
	try {
		const data = JSON.parse(readFileSync(baselinePath, "utf-8"));
		if (!data.baseline || typeof data.baseline !== "object") {
			throw new Error("missing baseline object");
		}
		return {
			baseline: data.baseline,
			thresholds: {
				...DEFAULT_THRESHOLDS,
				...(data.thresholds || {}),
			},
		};
	} catch (err) {
		console.error("Failed to load baseline file:", err.message);
		return { baseline: {}, thresholds: DEFAULT_THRESHOLDS };
	}
}

/**
 * 检查性能回归。
 * 分数类指标越高越好，耗时类指标越低越好；统一换算成"正数=变差"。
 * 同时检查相对阈值（regressionPercent）与 baseline 中的绝对预算。
 */
function checkPerformanceRegression(
	currentMetrics,
	baselineMetrics,
	thresholds,
) {
	const regressions = [];
	const regressionPercent = thresholds.regressionPercent ?? 10;

	for (const [metric, currentValue] of Object.entries(currentMetrics)) {
		if (typeof currentValue !== "number" || currentValue <= 0) {
			continue;
		}

		const baselineValue = baselineMetrics[metric];
		if (typeof baselineValue !== "number" || baselineValue <= 0) {
			continue;
		}

		const isScore = isScoreMetric(metric);
		const percentChange = isScore
			? ((baselineValue - currentValue) / baselineValue) * 100
			: ((currentValue - baselineValue) / baselineValue) * 100;

		const budget = thresholds[metric];
		const exceedsBudget =
			typeof budget === "number" &&
			(isScore ? currentValue < budget : currentValue > budget);

		if (percentChange > regressionPercent || exceedsBudget) {
			regressions.push({
				metric,
				current: currentValue,
				baseline: baselineValue,
				percent: percentChange,
				exceedsBudget,
				budget: typeof budget === "number" ? budget : undefined,
				isScore,
			});
		}
	}

	return regressions;
}

function formatValue(metric, value) {
	if (isScoreMetric(metric)) {
		return value.toFixed(2);
	}
	if (metric === "cumulative-layout-shift") {
		return value.toFixed(3);
	}
	return `${(value / 1000).toFixed(2)}s`;
}

/**
 * 主函数
 */
async function main() {
	const baselinePath = join(process.cwd(), "performance-baseline.json");
	const lhciDir = join(process.cwd(), ".lighthouseci");

	console.log("Loading baseline...");
	const { baseline, thresholds } = loadBaseline(baselinePath);

	const reportFiles = globSync(join(lhciDir, "lhr-*.json"));
	if (reportFiles.length === 0) {
		console.error(
			`No LHCI reports found in ${lhciDir}. Run 'pnpm lhci' first.`,
		);
		process.exit(1);
	}

	console.log("Extracting metrics from reports...");
	const { metrics: currentMetrics, runs } = aggregateReports(
		reportFiles,
		(path) => JSON.parse(readFileSync(path, "utf-8")),
	);

	if (Object.keys(currentMetrics).length === 0) {
		console.error("LHCI reports contained no usable results.");
		process.exit(1);
	}

	console.log("\n=== Performance Regression Check ===\n");

	let hasRegressions = false;
	let compared = 0;

	for (const [url, metrics] of Object.entries(currentMetrics)) {
		const urlKey = Object.keys(baseline).find(
			(key) => baseline[key].url === url,
		);
		if (!urlKey) {
			console.log(`⚠️  ${url} - no baseline entry, skipped`);
			continue;
		}

		compared++;
		const baselineMetrics = baseline[urlKey].metrics || {};
		const regressions = checkPerformanceRegression(
			metrics,
			baselineMetrics,
			thresholds,
		);

		if (regressions.length > 0) {
			hasRegressions = true;
			console.log(
				`Regressions found for: ${url} (${runs[url]} run${runs[url] > 1 ? "s" : ""})\n`,
			);

			for (const reg of regressions) {
				const direction = reg.isScore ? "下降" : "上升";
				const budget = reg.exceedsBudget
					? `，超出预算 ${formatValue(reg.metric, reg.budget)}`
					: "";
				console.log(`  ❌ ${reg.metric}`);
				console.log(
					`     Current: ${formatValue(reg.metric, reg.current)}`,
				);
				console.log(
					`     Baseline: ${formatValue(reg.metric, reg.baseline)}`,
				);
				console.log(
					`     Change: ${direction} ${reg.percent.toFixed(1)}%${budget}\n`,
				);
			}
		} else {
			console.log(
				`✅ ${url} - No regressions found (${runs[url]} run${runs[url] > 1 ? "s" : ""})`,
			);
		}
	}

	console.log("\n=== Summary ===");
	if (compared === 0) {
		console.error(
			"No current URL matched a baseline entry. Check the baseline URLs or regenerate it with 'pnpm performance:baseline -- --update'.",
		);
		process.exit(1);
	}
	if (hasRegressions) {
		console.log("⚠️  Performance regressions detected!");
		console.log("Please investigate and fix before merging.");
		process.exit(1);
	}

	console.log("✅ All performance checks passed!");
	process.exit(0);
}

main().catch((error) => {
	console.error("Error running performance check:", error);
	process.exit(1);
});
