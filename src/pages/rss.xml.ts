import type { RSSFeedItem } from "@astrojs/rss";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

import { siteConfig } from "@/config";
import { getSortedPosts } from "@/utils/content-utils";
import { renderFeedContent } from "@/utils/feed-content";
import { initPostIdMap } from "@/utils/permalink-utils";
import { getPostUrl } from "@/utils/url-utils";

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	// Use the same ordering as site listing (pinned first, then by published desc)
	const posts = (await getSortedPosts()).filter(
		(post) => !post.data.encrypted,
	);

	// 初始化文章 ID 映射（用于 permalink 功能）
	initPostIdMap(posts);

	const feed: RSSFeedItem[] = [];

	for (const post of posts) {
		feed.push({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.published,
			link: getPostUrl(post),
			content: await renderFeedContent(post, context.site),
		});
	}

	// RSS 2.0 用 RFC 1766 语言标签，下划线形式（zh_CN）不合规
	const lang = siteConfig.lang.replace("_", "-");
	const selfUrl = new URL("rss.xml", context.site).href;

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site,
		items: feed,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: [
			`<language>${lang}</language>`,
			`<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
			"<generator>Astro</generator>",
			`<atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>`,
		].join(""),
	});
}
