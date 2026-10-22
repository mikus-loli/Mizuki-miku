import * as fs from "node:fs";
import path from "node:path";

import type { APIContext, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";

import { removeFileExtension } from "@/utils/url-utils";

import { profileConfig, siteConfig } from "../../config";

type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = "normal" | "italic";
interface FontOptions {
	data: Buffer | ArrayBuffer;
	name: string;
	weight?: Weight;
	style?: FontStyle;
	lang?: string;
}
export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
	if (!siteConfig.generateOgImages) {
		return [];
	}

	const allPosts = await getCollection("posts");
	const publishedPosts = allPosts.filter((post) => !post.data.draft);

	return publishedPosts.map((post) => {
		// 将 id 转换为 slug（移除扩展名）以匹配路由参数
		const slug = removeFileExtension(post.id);
		return {
			params: { slug },
			props: { post },
		};
	});
};

let fontCache: { regular: Buffer | null; bold: Buffer | null } | null = null;

// 本地 OG 字体（OFL 开源 Zen Maru Gothic，避免构建机访问 Google Fonts 失败/超时）
// 与博客正文使用的显示字体一致，保证 OG 图视觉统一。
// 用 process.cwd() 而不是 import.meta.url：endpoint 会被打包，相对 URL 在产物中不可靠。
const LOCAL_OG_FONT_PATH = path.join(
	process.cwd(),
	"public/assets/font/ZenMaruGothic-Medium.ttf",
);

function loadLocalFont(): Buffer | null {
	try {
		if (fs.existsSync(LOCAL_OG_FONT_PATH)) {
			return fs.readFileSync(LOCAL_OG_FONT_PATH);
		}
	} catch (err) {
		console.warn("Failed to load local OG font:", err);
	}
	return null;
}

async function fetchNotoSansSCFonts() {
	if (fontCache) {
		return fontCache;
	}

	// 1. 优先使用本地字体（OFL 开源，无网络依赖，国内构建稳定）
	const localFont = loadLocalFont();
	if (localFont) {
		fontCache = { regular: localFont, bold: localFont };
		return fontCache;
	}

	// 2. 降级：从 Google Fonts 拉取 Noto Sans SC（带超时，避免构建卡死）
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000);

		let cssResp: Response;
		try {
			cssResp = await fetch(
				"https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
				{ signal: controller.signal },
			);
		} finally {
			clearTimeout(timeoutId);
		}

		if (!cssResp.ok) {
			throw new Error("Failed to fetch Google Fonts CSS");
		}
		const cssText = await cssResp.text();

		const getUrlForWeight = (weight: number) => {
			const blockRe = new RegExp(
				`@font-face\\s*{[^}]*font-weight:\\s*${weight}[^}]*}`,
				"g",
			);
			const match = cssText.match(blockRe);
			if (!match || match.length === 0) {
				return null;
			}
			const urlMatch = match[0].match(/url\((https:[^)]+)\)/);
			return urlMatch ? urlMatch[1] : null;
		};

		const regularUrl = getUrlForWeight(400);
		const boldUrl = getUrlForWeight(700);

		if (!regularUrl || !boldUrl) {
			console.warn(
				"Could not find font urls in Google Fonts CSS; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const [rResp, bResp] = await Promise.all([
			fetch(regularUrl),
			fetch(boldUrl),
		]);
		if (!rResp.ok || !bResp.ok) {
			console.warn(
				"Failed to download font files from Google; falling back to no fonts.",
			);
			fontCache = { regular: null, bold: null };
			return fontCache;
		}

		const rBuf = Buffer.from(await rResp.arrayBuffer());
		const bBuf = Buffer.from(await bResp.arrayBuffer());

		fontCache = { regular: rBuf, bold: bBuf };
		return fontCache;
	} catch (err) {
		console.warn("Error fetching fonts:", err);
		fontCache = { regular: null, bold: null };
		return fontCache;
	}
}

// 1x1 透明 PNG：头像/图标缺失时占位，保持模板布局不变
const TRANSPARENT_PIXEL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/** 解析配置里的资源路径：/ 开头相对 public，其余相对 src。 */
function resolveAssetPath(assetPath: string): string | null {
	if (!assetPath) {
		return null;
	}
	if (/^https?:\/\//i.test(assetPath)) {
		// 远程图片不做同步读取，交给调用方回退
		return null;
	}
	if (assetPath.startsWith("/")) {
		return path.join(process.cwd(), "public", assetPath.slice(1));
	}
	return path.join(process.cwd(), "src", assetPath);
}

/**
 * 读取本地图片并转成 PNG data URI。
 * 统一转 PNG 是因为 satori 对 svg/webp/ico data URI 的支持不一致。
 * 读取或解码失败返回 null，由调用方回退到透明像素。
 */
async function loadImageDataUri(assetPath: string): Promise<string | null> {
	const filePath = resolveAssetPath(assetPath);
	if (!filePath) {
		return null;
	}
	try {
		const source = fs.readFileSync(filePath);
		const png = await sharp(source).png().toBuffer();
		return `data:image/png;base64,${png.toString("base64")}`;
	} catch (err) {
		console.warn(`[og] Failed to load image asset ${assetPath}:`, err);
		return null;
	}
}

export async function GET({
	props,
}: APIContext<{ post: CollectionEntry<"posts"> }>) {
	const { post } = props;

	// Try to fetch fonts from Google Fonts (woff2) at runtime.
	const { regular: fontRegular, bold: fontBold } =
		await fetchNotoSansSCFonts();

	// Avatar + icon: 读取失败时回退到透明像素，避免整个 OG 生成因单个资源缺失而崩溃
	const avatarBase64 =
		(await loadImageDataUri(profileConfig.avatar ?? "")) ??
		TRANSPARENT_PIXEL;

	const configuredIcon =
		siteConfig.favicon[0]?.src ?? "/favicon/favicon.ico";
	let iconBase64 = await loadImageDataUri(configuredIcon);
	if (!iconBase64 && configuredIcon !== "/favicon/favicon.ico") {
		iconBase64 = await loadImageDataUri("/favicon/favicon.ico");
	}
	iconBase64 ??= TRANSPARENT_PIXEL;

	if (!fontRegular) {
		throw new Error(
			"[og] No usable font for OG image generation. Expected public/assets/font/ZenMaruGothic-Medium.ttf or network access to Google Fonts.",
		);
	}

	const hue = siteConfig.themeColor.hue;
	const primaryColor = `hsl(${hue}, 90%, 65%)`;
	const textColor = "hsl(0, 0%, 95%)";

	const subtleTextColor = `hsl(${hue}, 10%, 75%)`;
	const backgroundColor = `hsl(${hue}, 15%, 12%)`;

	const pubDate = post.data.published.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const description = post.data.description;

	const template = {
		type: "div",
		props: {
			style: {
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColor,
				fontFamily:
					'"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				padding: "60px",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							width: "100%",
							display: "flex",
							alignItems: "center",
							gap: "20px",
						},
						children: [
							{
								type: "img",
								props: {
									src: iconBase64,
									width: 48,
									height: 48,
									style: { borderRadius: "10px" },
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontSize: "36px",
										fontWeight: 600,
										color: subtleTextColor,
									},
									children: siteConfig.title,
								},
							},
						],
					},
				},

				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							flexGrow: 1,
							gap: "20px",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "flex-start",
									},
									children: [
										{
											type: "div",
											props: {
												style: {
													width: "10px",
													height: "68px",
													backgroundColor:
														primaryColor,
													borderRadius: "6px",
													marginTop: "14px",
												},
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "72px",
													fontWeight: 700,
													lineHeight: 1.2,
													color: textColor,
													marginLeft: "25px",
													display: "-webkit-box",
													overflow: "hidden",
													textOverflow: "ellipsis",
													lineClamp: 3,
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
												},
												children: post.data.title,
											},
										},
									],
								},
							},
							description && {
								type: "div",
								props: {
									style: {
										fontSize: "32px",
										lineHeight: 1.5,
										color: subtleTextColor,
										paddingLeft: "35px",
										display: "-webkit-box",
										overflow: "hidden",
										textOverflow: "ellipsis",
										lineClamp: 2,
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
									},
									children: description,
								},
							},
						],
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "20px",
									},
									children: [
										{
											type: "img",
											props: {
												src: avatarBase64,
												width: 60,
												height: 60,
												style: { borderRadius: "50%" },
											},
										},
										{
											type: "div",
											props: {
												style: {
													fontSize: "28px",
													fontWeight: 600,
													color: textColor,
												},
												children: profileConfig.name,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									style: {
										fontSize: "28px",
										color: subtleTextColor,
									},
									children: pubDate,
								},
							},
						],
					},
				},
			],
		},
	};

	const fonts: FontOptions[] = [];
	if (fontRegular) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontRegular,
			weight: 400,
			style: "normal",
		});
	}
	if (fontBold) {
		fonts.push({
			name: "Noto Sans SC",
			data: fontBold,
			weight: 700,
			style: "normal",
		});
	}

	const svg = await satori(template, {
		width: 1200,
		height: 630,
		fonts,
	});

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
