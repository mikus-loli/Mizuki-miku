import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Disallow: /
Allow: /$
Allow: /about/
Allow: /albums/
Allow: /anime/
Allow: /archive/
Allow: /devices/
Allow: /diary/
Allow: /friends/
Allow: /posts/
Allow: /projects/
Allow: /skills/
Allow: /timeline/

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
