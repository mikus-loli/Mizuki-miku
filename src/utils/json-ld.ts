/**
 * 把 JSON 安全地嵌入 HTML `<script>` 上下文。
 *
 * Astro 的 `set:html` 不会转义内容，正文里的 `</script>` 会提前闭合标签；
 * 将 `<` 转成 JSON 转义 `\u003c` 后数据语义不变，也不会再形成结束标签。
 */
export function stringifyForInlineJson(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
