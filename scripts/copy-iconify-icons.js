/**
 * 复制 Iconify 图标数据到 public 目录
 * 用于本地化图标加载，避免网络请求
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");
const publicDir = join(rootDir, "public", "cdn", "iconify", "icons");
const nodeModulesDir = join(rootDir, "node_modules");

// 需要复制的图标集
const iconSets = [
	"material-symbols",
	"mdi",
	"fa7-solid",
	"fa7-regular",
	"fa7-brands",
	"eos-icons",
	"simple-icons",
];

// 确保目标目录存在
if (!existsSync(publicDir)) {
	mkdirSync(publicDir, { recursive: true });
}

// 复制图标集
for (const iconSet of iconSets) {
	const sourceDir = join(nodeModulesDir, "@iconify-json", iconSet);
	const targetDir = join(publicDir, iconSet);

	if (!existsSync(sourceDir)) {
		console.log(`⚠️  图标集 ${iconSet} 不存在，跳过`);
		continue;
	}

	// 创建目标目录
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	// 复制 icons.json
	const iconsJsonPath = join(sourceDir, "icons.json");
	const targetIconsJsonPath = join(targetDir, "icons.json");

	if (existsSync(iconsJsonPath)) {
		copyFileSync(iconsJsonPath, targetIconsJsonPath);
		console.log(`✅ 已复制 ${iconSet}/icons.json`);
	}

	// 复制 chars.json (如果存在)
	const charsJsonPath = join(sourceDir, "chars.json");
	const targetCharsJsonPath = join(targetDir, "chars.json");

	if (existsSync(charsJsonPath)) {
		copyFileSync(charsJsonPath, targetCharsJsonPath);
		console.log(`✅ 已复制 ${iconSet}/chars.json`);
	}
}

// 创建 API 响应格式的索引文件
const apiDir = join(rootDir, "public", "cdn", "iconify", "api");
if (!existsSync(apiDir)) {
	mkdirSync(apiDir, { recursive: true });
}

// 为每个图标集创建 API 响应文件
for (const iconSet of iconSets) {
	const iconsJsonPath = join(publicDir, iconSet, "icons.json");
	if (!existsSync(iconsJsonPath)) {
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

console.log("\n🎉 图标数据复制完成！");
console.log(`📁 图标数据位置: ${publicDir}`);
console.log(`📁 API 数据位置: ${apiDir}`);