import type { APIContext } from "astro";

import { profileConfig, siteConfig } from "@/config";
import { getSortedPosts } from "@/utils/content-utils";
import { renderFeedContent } from "@/utils/feed-content";
import { initPostIdMap } from "@/utils/permalink-utils";
import { getPostUrl } from "@/utils/url-utils";

/** XML 实体转义，防止 XML 注入 */
function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	// Use the same ordering as site listing (pinned first, then by published desc)
	// 过滤掉加密文章和草稿文章
	const posts = (await getSortedPosts()).filter(
		(post) => !post.data.encrypted && post.data.draft !== true,
	);

	// 初始化文章 ID 映射（用于 permalink 功能）
	initPostIdMap(posts);

	const siteUrl = context.site.href;
	const feedUrl = new URL("atom.xml", context.site).href;

	// 创建Atom feed头部
	let atomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${siteConfig.lang.replace("_", "-")}">
  <title>${escapeXml(siteConfig.title)}</title>
  <subtitle>${escapeXml(siteConfig.subtitle || "No description")}</subtitle>
  <link href="${escapeXml(siteUrl)}" rel="alternate" type="text/html"/>
  <link href="${escapeXml(feedUrl)}" rel="self" type="application/atom+xml"/>
  <id>${escapeXml(siteUrl)}</id>
  <updated>${new Date().toISOString()}</updated>
  <generator uri="https://astro.build/">Astro</generator>`;

	for (const post of posts) {
		const postUrl = new URL(getPostUrl(post), context.site).href;
		const safePostUrl = escapeXml(postUrl);
		const content = await renderFeedContent(post, context.site);
		// CDATA 中不能出现 ]]>，否则会提前结束块；用标准拆分写法保留原文
		const safeContent = content.replace(/\]\]>/g, "]]]]><![CDATA[>");

		atomFeed += `
  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${safePostUrl}" rel="alternate" type="text/html"/>
    <id>${safePostUrl}</id>
    <published>${post.data.published.toISOString()}</published>
    <updated>${post.data.updated?.toISOString() || post.data.published.toISOString()}</updated>
    <summary>${escapeXml(post.data.description || "")}</summary>
    <content type="html"><![CDATA[${safeContent}]]></content>
    <author>
      <name>${escapeXml(profileConfig.name)}</name>
    </author>`;

		// 添加分类标签
		if (post.data.category) {
			atomFeed += `
    <category term="${escapeXml(post.data.category)}"></category>`;
		}

		atomFeed += `
  </entry>`;
	}

	// 关闭Atom feed
	atomFeed += `
</feed>`;

	return new Response(atomFeed, {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
