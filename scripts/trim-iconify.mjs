#!/usr/bin/env node
/**
 * trim-iconify.mjs — 裁剪 Iconify 本地图标集为站点实际用到的子集
 *
 * 背景：Mizuki 主题把整个 Iconify 图标集静态打包在 public/cdn/iconify/api/*.json
 * （material-symbols.json 7.68MB / 16034 个图标），iconify-icon 按需请求
 * `?icons=xxx` 时静态服务器忽略 query 参数、整包返回，导致首屏下载 30MB+。
 *
 * 本脚本扫描 src/ 下所有图标引用，把每个集合裁剪成只含用到的图标（含 alias 递归解析），
 * 构建前执行即可，新增图标时无需手动维护。
 *
 * 用法：
 *   node scripts/trim-iconify.mjs          # 裁剪并写回
 *   node scripts/trim-iconify.mjs --check  # 只检查不写（CI 用）
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apiDir = join(root, "public", "cdn", "iconify", "api");
const srcDir = join(root, "src");
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
        const prefix = m[1], name = m[2];
        if (!refs.has(prefix)) refs.set(prefix, new Set());
        refs.get(prefix).add(name);
      }
    }
  }
}

// ---------- 2. 裁剪每个集合 ----------
function collectNeeded(full, wanted) {
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

let totalBefore = 0, totalAfter = 0;
const report = [];

for (const file of readdirSync(apiDir).filter((f) => f.endsWith(".json"))) {
  const path = join(apiDir, file);
  const full = JSON.parse(readFileSync(path, "utf-8"));
  const prefix = full.prefix || file.replace(/\.json$/, "");
  const wanted = refs.get(prefix) || new Set();

  const before = Buffer.byteLength(readFileSync(path));
  totalBefore += before;

  let after = before;
  if (wanted.size > 0) {
    const needed = collectNeeded(full, wanted);
    const trimmed = { ...full };
    trimmed.icons = Object.fromEntries(
      Object.entries(full.icons || {}).filter(([k]) => needed.has(k))
    );
    if (full.aliases) {
      trimmed.aliases = Object.fromEntries(
        Object.entries(full.aliases).filter(([k]) => needed.has(k))
      );
    }
    delete trimmed.chars; // 字符映射运行时用不到

    const out = JSON.stringify(trimmed);
    after = Buffer.byteLength(out);
    if (!CHECK_ONLY) writeFileSync(path, out);
  }

  totalAfter += after;
  const kept = wanted.size;
  report.push({
    file, prefix,
    before, after,
    kept: wanted.size,
    total: Object.keys(full.icons || {}).length,
    skipped: wanted.size === 0,
  });
}

// ---------- 3. 报告 ----------
console.log(`\n📦 Iconify 图标集裁剪报告 (${CHECK_ONLY ? "CHECK" : "WRITE"})`);
console.log("=".repeat(70));
for (const r of report) {
  const pct = r.before > 0 ? ((1 - r.after / r.before) * 100).toFixed(1) : "0";
  console.log(
    `${r.file.padEnd(28)} ${fmt(r.before).padStart(10)} → ${fmt(r.after).padStart(10)}` +
    `  (${r.skipped ? "⚠ 未扫描到引用,保持原样" : `-${pct}% · 用 ${r.kept}/${r.total}`})`
  );
}
console.log("=".repeat(70));
console.log(`合计: ${fmt(totalBefore)} → ${fmt(totalAfter)}  (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

if (CHECK_ONLY) {
  const ok = report.every((r) => r.skipped || r.after <= r.before);
  process.exit(ok ? 0 : 1);
}
