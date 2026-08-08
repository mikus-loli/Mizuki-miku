/**
 * 生成 Iconify API 数据到 public 目录
 * 用于本地化图标加载，避免网络请求
 *
 * 直接从 node_modules/@iconify-json/* 读取完整图标集，
 * 生成 API 响应格式文件（public/cdn/iconify/api/<set>.json）。
 * 不再复制完整的 icons/ 目录（17.5MB 整包）到 public ——
 * 完整包只被构建时引用，运行时 iconify-icon 只请求 api/ 文件。
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const nodeModulesDir = join(rootDir, "node_modules");

// 需要生成的图标集
const iconSets = [
	"material-symbols",
	"mdi",
	"fa7-solid",
	"fa7-regular",
	"fa7-brands",
	"eos-icons",
	"simple-icons",
];

// 创建 API 响应格式的索引文件
const apiDir = join(rootDir, "public", "cdn", "iconify", "api");
if (!existsSync(apiDir)) {
	mkdirSync(apiDir, { recursive: true });
}

// 为每个图标集创建 API 响应文件
for (const iconSet of iconSets) {
	const iconsJsonPath = join(nodeModulesDir, "@iconify-json", iconSet, "icons.json");
	if (!existsSync(iconsJsonPath)) {
		console.log(`⚠️  图标集 ${iconSet} 不存在，跳过`);
		continue;
	}

	try {
		const iconsData = JSON.parse(readFileSync(iconsJsonPath, "utf-8"));

		// 创建符合 Iconify API 格式的响应
		const apiResponse = {
			prefix: iconSet,
			...iconsData,
		};

		const apiFilePath = join(apiDir, `${iconSet}.json`);
		writeFileSync(apiFilePath, JSON.stringify(apiResponse));
		console.log(`✅ 已创建 API 文件 ${iconSet}.json`);
	} catch (error) {
		console.error(`❌ 处理 ${iconSet} 时出错:`, error.message);
	}
}

console.log("\n🎉 图标 API 数据生成完成！");
console.log(`📁 API 数据位置: ${apiDir}`);
