import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import sanitizeHtml from "sanitize-html";

/**
 * RSS 与 Atom 共用：把文章 markdown 渲染成可直接进 feed 的 HTML。
 *
 * 文章里的图片可能是相对路径（./img.png、../assets/x.jpg）或站内绝对路径（/images/y.webp），
 * 订阅阅读器拿不到这些相对路径，所以这里统一改写成构建产物里的绝对 URL。
 */
const markdownParser = new MarkdownIt();

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/**/*.{jpeg,jpg,png,gif,webp}",
);

/** 把 src 解析成 /src/content 下的实际文件路径；无法判定时返回 null */
function resolveContentImagePath(postId: string, src: string): string | null {
	// 文章可能在子目录里（bestimageapi/index.md），相对路径要带上这层目录
	const postDir = postId.includes("/") ? postId.split("/")[0] : "";

	if (src.startsWith("./")) {
		const rest = src.slice(2);
		return postDir
			? `/src/content/posts/${postDir}/${rest}`
			: `/src/content/posts/${rest}`;
	}

	if (src.startsWith("../")) {
		return `/src/content/${src.replace(/^\.\.\//, "")}`;
	}

	// 直接写文件名，按「与文章同目录」处理
	return postDir
		? `/src/content/posts/${postDir}/${src}`
		: `/src/content/posts/${src}`;
}

export async function renderFeedContent(
	post: { id: string; body?: string | null },
	site: URL,
): Promise<string> {
	const html = htmlParser.parse(markdownParser.render(String(post.body ?? "")));

	for (const img of html.querySelectorAll("img")) {
		const src = img.getAttribute("src");
		if (!src) {
			continue;
		}

		if (src.startsWith("/")) {
			// public/ 下的资源，补成绝对地址即可
			img.setAttribute("src", new URL(src, site).href);
			continue;
		}

		if (src.startsWith("http")) {
			continue;
		}

		const importPath = resolveContentImagePath(post.id, src);
		const imageMod = await imagesGlob[importPath]?.().then(
			(res) => res.default,
		);

		if (!imageMod) {
			 
			console.warn(`Feed image not found: ${importPath} (post: ${post.id})`);
			continue;
		}

		const optimized = await getImage({ src: imageMod });
		img.setAttribute("src", new URL(optimized.src, site).href);
	}

	return sanitizeHtml(html.toString(), {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
	});
}
