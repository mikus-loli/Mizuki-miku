#!/usr/bin/env node
/**
 * trim-iconify.mjs — 从 node_modules 生成站点实际用到的图标子集
 *
 * 背景：Iconify 的整套 material-symbols 有 7.68MB / 16034 个图标。以前的做法是
 * 「copy-iconify-icons.js 先把整套写进 public/cdn/iconify/api/，再由本脚本裁剪」，
 * 中间那步纯属浪费：整套文件一度真的上过线（30MB+ 首屏），而且两个脚本一旦
 * 执行顺序出错就会静默退回全集。
 *
 * 现在只做一遍：扫 src 里的图标引用 → 从 @iconify-json/<prefix> 读全集 →
 * 裁剪（含 alias 递归）→ 直接写 public/cdn/iconify/api/<prefix>.json。
 * 没有被任何源码引用的图标集不会生成，历史遗留的旧文件会被清掉。
 *
 * 用法：
 *   node scripts/trim-iconify.mjs          # 生成/更新
 *   node scripts/trim-iconify.mjs --check  # 只检查产物是否最新（CI 用）
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apiDir = join(root, "public", "cdn", "iconify", "api");
const srcDir = join(root, "src");
const pkgDir = join(root, "node_modules", "@iconify-json");
const CHECK_ONLY = process.argv.includes("--check");

const SRC_EXTS = new Set([".astro", ".svelte", ".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".json", ".html"]);

// ---------- 1. 扫描 src 下的图标引用 ----------
// 匹配优先级：icon="prefix:name" > name="prefix:name" > 任意引号字符串（覆盖三元表达式字面量）
const REGEXES = [
	/icon=["']([a-z0-9-]+):([a-z0-9-]+)["']/g,
	/name=["']([a-z0-9-]+):([a-z0-9-]+)["']/g,
	/["']([a-z0-9-]+):([a-z0-9-]+)["']/g,
];

function walk(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (entry.startsWith(".") || entry === "node_modules") continue;
		if (statSync(full).isDirectory()) walk(full, out);
		else if (SRC_EXTS.has(extname(full))) out.push(full);
	}
	return out;
}

const refs = new Map(); // prefix -> Set(name)
if (existsSync(srcDir)) {
	for (const file of walk(srcDir)) {
		const content = readFileSync(file, "utf-8");
		for (const re of REGEXES) {
			re.lastIndex = 0;
			let m;
			while ((m = re.exec(content)) !== null) {
				const prefix = m[1],
					name = m[2];
				if (!refs.has(prefix)) refs.set(prefix, new Set());
				refs.get(prefix).add(name);
			}
		}
	}
}

// 第三条正则会把 Tailwind 变体名（md:、lg:、hover:、group-hover:…）也抓进来。
// 判据很简单：node_modules 里没有这个图标集，就不是图标引用，直接丢弃。
const ignoredPrefixes = [];
for (const prefix of [...refs.keys()]) {
	if (!existsSync(join(pkgDir, prefix, "icons.json"))) {
		ignoredPrefixes.push(prefix);
		refs.delete(prefix);
	}
}

// ---------- 2. 裁剪每个集合 ----------
// 导出供单元测试使用：递归解析 alias，保留被引用的父图标
export function collectNeeded(full, wanted) {
	const needed = new Set(wanted);
	const aliases = full.aliases || {};
	let changed = true;
	while (changed) {
		changed = false;
		for (const [alias, def] of Object.entries(aliases)) {
			if (needed.has(alias) && def.parent && !needed.has(def.parent)) {
				needed.add(def.parent);
				changed = true;
			}
		}
	}
	return needed;
}

if (!CHECK_ONLY && !existsSync(apiDir)) mkdirSync(apiDir, { recursive: true });

let totalBefore = 0,
	totalAfter = 0;
const report = [];
// 产物目录里已有的文件，处理完还在的算「不再被引用」，要清掉
const stale = existsSync(apiDir) ? new Set(readdirSync(apiDir).filter((f) => f.endsWith(".json"))) : new Set();

for (const [prefix, wanted] of [...refs].sort((a, b) => a[0].localeCompare(b[0]))) {
	const pkgPath = join(pkgDir, prefix, "icons.json");
	if (!existsSync(pkgPath)) {
		report.push({ prefix, missingPkg: true, kept: wanted.size });
		continue;
	}

	const iconsData = JSON.parse(readFileSync(pkgPath, "utf-8"));
	// 与旧 copy 脚本产出的结构保持一致：prefix 在最前，其余字段原样展开
	const full = { prefix, ...iconsData };
	const needed = collectNeeded(full, wanted);
	// 源码引用了但图标集里没有的名字——构建不会失败，线上那个位置会永远是空白框
	const missing = [...wanted].filter((n) => !full.icons?.[n] && !full.aliases?.[n]);

	const trimmed = { ...full };
	trimmed.icons = Object.fromEntries(Object.entries(full.icons || {}).filter(([k]) => needed.has(k)));
	if (full.aliases) {
		trimmed.aliases = Object.fromEntries(Object.entries(full.aliases).filter(([k]) => needed.has(k)));
	}
	delete trimmed.chars; // 字符映射运行时用不到

	const out = JSON.stringify(trimmed);
	const path = join(apiDir, `${prefix}.json`);
	const before = Buffer.byteLength(JSON.stringify(full));
	const after = Buffer.byteLength(out);

	totalBefore += before;
	totalAfter += after;
	stale.delete(`${prefix}.json`);

	const current = existsSync(path) ? readFileSync(path, "utf-8") : null;
	const changed = current !== out;
	if (!CHECK_ONLY && changed) writeFileSync(path, out);

	report.push({
		prefix,
		before,
		after,
		kept: Object.keys(trimmed.icons).length,
		total: Object.keys(full.icons || {}).length,
		changed,
		missing,
	});
}

// ---------- 3. 清掉不再被引用的旧图标集 ----------
for (const file of stale) {
	if (!CHECK_ONLY) unlinkSync(join(apiDir, file));
}

// ---------- 4. 报告 ----------
console.log(`\n📦 Iconify 图标集裁剪报告 (${CHECK_ONLY ? "CHECK" : "WRITE"})`);
console.log("=".repeat(70));
for (const r of report) {
	if (r.missingPkg) {
		console.log(`${(r.prefix + ".json").padEnd(28)} ⚠ 未安装 @iconify-json/${r.prefix}，已跳过（${r.kept} 个引用）`);
		continue;
	}
	const pct = r.before > 0 ? ((1 - r.after / r.before) * 100).toFixed(1) : "0";
	console.log(
		`${(r.prefix + ".json").padEnd(28)} ${fmt(r.before).padStart(10)} → ${fmt(r.after).padStart(10)}` +
			`  (-${pct}% · 用 ${r.kept}/${r.total}${r.changed ? "" : " · 无变化"})`,
	);
	if (r.missing.length) {
		console.log(`   ⚠ 图标集里没有这些名字（线上会是空白）: ${r.missing.slice(0, 10).join(", ")}${r.missing.length > 10 ? ` …共 ${r.missing.length} 个` : ""}`);
	}
}
if (ignoredPrefixes.length) {
	console.log(`ℹ️  忽略 ${ignoredPrefixes.length} 个非图标前缀（Tailwind 变体等）: ${ignoredPrefixes.slice(0, 12).join(", ")}`);
}
if (stale.size) {
	console.log(`🧹 删除不再被引用: ${[...stale].join(", ")}`);
}
console.log("=".repeat(70));
console.log(`合计: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);

function fmt(bytes) {
	if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
	if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
	return bytes + " B";
}

if (CHECK_ONLY) {
	const ok = report.every((r) => r.missingPkg || !r.changed) && stale.size === 0;
	process.exit(ok ? 0 : 1);
}
