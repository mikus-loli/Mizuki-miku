/**
 * 性能基准更新脚本
 * 从 LHCI 报告更新性能基准
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { globSync } from "glob";

import {
	aggregateReports,
	isMsMetric,
	isScoreMetric,
} from "./lhci-metrics.js";

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

function loadBaseline(baselinePath) {
	try {
		return JSON.parse(readFileSync(baselinePath, "utf-8"));
	} catch {
		return {
			baseline: {},
			thresholds: DEFAULT_THRESHOLDS,
			schemaVersion: "1.0.0",
			createdAt: new Date().toISOString(),
		};
	}
}

function formatValue(metric, value) {
	if (isScoreMetric(metric)) {
		return value.toFixed(2);
	}
	if (metric === "cumulative-layout-shift") {
		return value.toFixed(3);
	}
	if (isMsMetric(metric)) {
		return `${(value / 1000).toFixed(2)}s`;
	}
	return value.toFixed(2);
}

async function main() {
	const updateMode = process.argv.slice(2).includes("--update");

	const baselinePath = join(process.cwd(), "performance-baseline.json");
	const lhciDir = join(process.cwd(), ".lighthouseci");

	console.log("Loading baseline...");
	const baselineData = loadBaseline(baselinePath);
	baselineData.baseline ||= {};
	baselineData.thresholds ||= DEFAULT_THRESHOLDS;

	console.log("Looking for LHCI reports...");

	const reportFiles = globSync(join(lhciDir, "lhr-*.json"));
	if (reportFiles.length === 0) {
		console.error("No LHCI reports found. Run 'pnpm lhci' first.");
		process.exit(1);
	}

	const { metrics, resourceSizes, runs } = aggregateReports(
		reportFiles,
		(path) => JSON.parse(readFileSync(path, "utf-8")),
	);

	const urls = Object.keys(metrics);
	if (urls.length === 0) {
		console.error("LHCI reports contained no usable results.");
		process.exit(1);
	}

	// 更新基准：同一 URL 的多次运行已在 aggregateReports 中按该 URL 运行次数平均
	for (const url of urls) {
		const urlKey =
			url.replace("http://localhost:4321", "").replace(/\/$/, "") ||
			"homepage";
		baselineData.baseline[urlKey] = {
			url,
			metrics: metrics[url],
			resourceSizes: resourceSizes[url],
		};
	}

	baselineData.createdAt = new Date().toISOString();

	if (updateMode) {
		console.log("\nUpdating baseline file...");
		writeFileSync(baselinePath, `${JSON.stringify(baselineData, null, 2)}\n`);
		console.log("✅ Baseline updated successfully!");
		return;
	}

	console.log("\n=== Current Performance Metrics ===\n");
	for (const url of urls) {
		console.log(`\n${url} (${runs[url]} runs averaged):`);
		for (const [key, value] of Object.entries(metrics[url])) {
			if (typeof value === "number") {
				console.log(`  ${key}: ${formatValue(key, value)}`);
			}
		}
		const rs = resourceSizes[url];
		console.log(
			`  Resource sizes: ${rs.totalKB.toFixed(1)}KB (JS: ${rs.totalJsKB.toFixed(1)}KB, CSS: ${rs.totalCssKB.toFixed(1)}KB)`,
		);
	}

	console.log("\n\nUse --update flag to save these metrics as the new baseline:");
	console.log("  pnpm performance:baseline -- --update");
}

main().catch((error) => {
	console.error("Error updating baseline:", error);
	process.exit(1);
});
