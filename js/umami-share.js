/**
 * 安全警告：此脚本暴露 API Key 在客户端。
 * 仅应在受信任的环境中使用，且 API Key 应具有最小权限（只读）。
 * 生产环境中建议通过服务端代理 API 请求，避免在客户端暴露凭证。
 */
((global) => {
	const cacheKey = "umami-share-cache";
	const cacheTTL = 60000; // 1min

	/**
	 * 获取网站统计数据
	 * @param {string} baseUrl - Umami API基础URL（例如：http://localhost:3000/api）
	 * @param {string} apiKey - API密钥（Bearer Token）
	 * @param {string} websiteId - 网站ID
	 * @returns {Promise<object>} 网站统计数据
	 */
	async function fetchWebsiteStats(baseUrl, apiKey, websiteId) {
		// 检查缓存
		const cached = localStorage.getItem(cacheKey);
		if (cached) {
			try {
				const parsed = JSON.parse(cached);
				if (Date.now() - parsed.timestamp < cacheTTL) {
					return parsed.value;
				}
			} catch {
				localStorage.removeItem(cacheKey);
			}
		}

		const currentTimestamp = Date.now();
		// 修改API路径，注意自建Umami没有/v1，而是直接/api
		const statsUrl = `${baseUrl}/websites/${websiteId}/stats?startAt=0&endAt=${currentTimestamp}`;

		const res = await fetch(statsUrl, {
			headers: {
				// 修改认证头为Bearer Token
				Authorization: `Bearer ${apiKey}`,
			},
		});

		if (!res.ok) {
			throw new Error("获取网站统计数据失败");
		}

		const stats = await res.json();

		// 缓存结果
		localStorage.setItem(
			cacheKey,
			JSON.stringify({ timestamp: Date.now(), value: stats }),
		);

		return stats;
	}

	/**
	 * 获取特定页面的统计数据
	 * @param {string} baseUrl - Umami API基础URL
	 * @param {string} apiKey - API密钥
	 * @param {string} websiteId - 网站ID
	 * @param {string} urlPath - 页面路径
	 * @param {number} startAt - 开始时间戳
	 * @param {number} endAt - 结束时间戳
	 * @returns {Promise<object>} 页面统计数据
	 */
	async function fetchPageStats(
		baseUrl,
		apiKey,
		websiteId,
		urlPath,
		startAt = 0,
		endAt = Date.now(),
	) {
		// 修改API路径
		const statsUrl = `${baseUrl}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}&path=${encodeURIComponent(urlPath)}`;

		const res = await fetch(statsUrl, {
			headers: {
				// 修改认证头为Bearer Token
				Authorization: `Bearer ${apiKey}`,
			},
		});

		if (!res.ok) {
			throw new Error("获取页面统计数据失败");
		}

		return await res.json();
	}

	/**
	 * 获取 Umami 网站统计数据
	 * @param {string} baseUrl - Umami API基础URL
	 * @param {string} apiKey - API密钥
	 * @param {string} websiteId - 网站ID
	 * @returns {Promise<object>} 网站统计数据
	 */
	global.getUmamiWebsiteStats = async (baseUrl, apiKey, websiteId) => {
		try {
			return await fetchWebsiteStats(baseUrl, apiKey, websiteId);
		} catch (err) {
			throw new Error(`获取Umami统计数据失败: ${err.message}`);
		}
	};

	/**
	 * 获取特定页面的 Umami 统计数据
	 * @param {string} baseUrl - Umami API基础URL
	 * @param {string} apiKey - API密钥
	 * @param {string} websiteId - 网站ID
	 * @param {string} urlPath - 页面路径
	 * @param {number} startAt - 开始时间戳（可选）
	 * @param {number} endAt - 结束时间戳（可选）
	 * @returns {Promise<object>} 页面统计数据
	 */
	global.getUmamiPageStats = async (
		baseUrl,
		apiKey,
		websiteId,
		urlPath,
		startAt,
		endAt,
	) => {
		try {
			return await fetchPageStats(
				baseUrl,
				apiKey,
				websiteId,
				urlPath,
				startAt,
				endAt,
			);
		} catch (err) {
			throw new Error(`获取Umami页面统计数据失败: ${err.message}`);
		}
	};

	global.clearUmamiShareCache = () => {
		localStorage.removeItem(cacheKey);
	};
})(window);
