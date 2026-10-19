import Key from "../i18nKey";
import type { Translation } from "../translation";

export const zh_CN: Translation = {
	[Key.home]: "主页",
	[Key.about]: "关于我们",
	[Key.archive]: "归档",
	[Key.search]: "搜索",
	[Key.other]: "其他",

	// 导航栏标题
	[Key.navLinks]: "链接",
	[Key.navMy]: "我的",
	[Key.navAbout]: "关于",
	[Key.navOthers]: "其他",

	[Key.tags]: "标签",
	[Key.categories]: "分类",
	[Key.recentPosts]: "最新文章",
	[Key.postList]: "文章列表",
	[Key.tableOfContents]: "目录",
	[Key.tocEmpty]: "当前页面没有目录",

	// 公告栏
	[Key.announcement]: "公告",
	[Key.announcementClose]: "关闭",

	[Key.comments]: "评论",
	[Key.friends]: "友链",
	[Key.friendsSubtitle]: "发现更多优质网站",
	[Key.friendsSearchPlaceholder]: "搜索友链名称或描述...",
	[Key.friendsFilterAll]: "全部",
	[Key.friendsNoResults]: "未找到匹配的友链",
	[Key.friendsVisit]: "访问",
	[Key.friendsCopyLink]: "复制链接",
	[Key.friendsCopySuccess]: "已复制",
	[Key.uncategorized]: "未分类",
	[Key.noTags]: "无标签",

	[Key.wordCount]: "字",
	[Key.wordsCount]: "字",
	[Key.minuteCount]: "分钟",
	[Key.minutesCount]: "分钟",
	[Key.postCount]: "篇文章",
	[Key.postsCount]: "篇文章",

	[Key.themeColor]: "主题色",

	[Key.lightMode]: "亮色",
	[Key.darkMode]: "暗色",

	[Key.more]: "更多",

	[Key.author]: "作者",
	[Key.publishedAt]: "发布于",
	[Key.license]: "许可协议",
	[Key.anime]: "追番",
	[Key.diary]: "日记",

	// 番剧页面
	[Key.animeTitle]: "我的追番记录",
	[Key.animeSubtitle]: "记录我的二次元之旅",
	[Key.animeStatusWatching]: "在看",
	[Key.animeStatusCompleted]: "看过",
	[Key.animeStatusPlanned]: "想看",
	[Key.animeStatusOnHold]: "搁置",
	[Key.animeStatusDropped]: "抛弃",
	[Key.animeFilterAll]: "全部",
	[Key.animeYear]: "年份",
	[Key.animeStudio]: "制作",
	[Key.animeEmpty]: "暂无追番数据",
	[Key.animeEmptyBangumi]: "请检查 Bangumi 配置或网络连接",
	[Key.animeEmptyBilibili]: "请检查 Bilibili 配置或网络连接",
	[Key.animeEmptyLocal]: "请在 src/data/anime.ts 文件中添加番剧信息",
	[Key.animeConfigBilibili]:
		"请在 src/config.ts 文件中设置您的 Bilibili vmid",
	[Key.animeConfigBangumi]:
		"请在 src/config.ts 文件中设置您的 Bangumi userId",

	// 短文页面
	[Key.diarySubtitle]: "随时随地，分享生活",
	[Key.diaryNoResults]: "没有匹配的日记",
	[Key.diaryCount]: "条日记",

	[Key.diaryTips]: "只展示最近30条日记",
	[Key.diaryMinutesAgo]: "分钟前",
	[Key.diaryHoursAgo]: "小时前",
	[Key.diaryDaysAgo]: "天前",

	// 404页面
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "页面未找到",
	[Key.notFoundDescription]: "抱歉，您访问的页面不存在或已被移动。",
	[Key.backToHome]: "返回首页",

	// 音乐播放器
	[Key.musicPlayer]: "音乐播放器",
	[Key.musicPlayerShow]: "显示音乐播放器",
	[Key.musicPlayerHide]: "隐藏播放器",
	[Key.musicPlayerExpand]: "展开音乐播放器",
	[Key.musicPlayerCollapse]: "收起播放器",
	[Key.musicPlayerPause]: "暂停",
	[Key.musicPlayerPlay]: "播放",
	[Key.musicPlayerVolume]: "音量控制",
	[Key.musicPlayerProgress]: "播放进度",
	[Key.musicPlayerCover]: "封面",
	[Key.musicPlayerPlaylist]: "播放列表",
	[Key.musicPlayerErrorPlaylist]: "播放列表获取失败",
	[Key.musicPlayerErrorSong]: "当前歌曲加载失败，尝试加载下一首",
	[Key.musicPlayerErrorEmpty]: "播放列表中没有可用的歌曲",
	[Key.unknownSong]: "未知歌曲",
	[Key.unknownArtist]: "未知艺术家",

	// 相册页面
	[Key.albums]: "相册",
	[Key.albumsSubtitle]: "记录生活中的美好瞬间",
	[Key.albumsEmpty]: "暂无内容",
	[Key.albumsEmptyDesc]: "还没有创建任何相册，快去添加一些美好的回忆吧！",
	[Key.albumsBackToList]: "返回相册",
	[Key.albumsPhotosCount]: "张照片",
	[Key.albumsFilterAll]: "全部",
	[Key.albumsNoResults]: "没有匹配的相册",

	// 设备页面
	[Key.devices]: "我的设备",
	[Key.devicesSubtitle]: "这里展示了我日常使用的各类设备",
	[Key.devicesViewDetails]: "查看详情",

	// 项目展示页面
	[Key.projects]: "项目展示",
	[Key.projectsSubtitle]: "我的开发项目作品集",
	[Key.projectsWeb]: "网页应用",
	[Key.projectsMobile]: "移动应用",
	[Key.projectsDesktop]: "桌面应用",
	[Key.projectsOther]: "其他",
	[Key.projectsCompleted]: "已完成",
	[Key.projectsInProgress]: "进行中",
	[Key.projectsPlanned]: "计划中",
	[Key.projectsVisit]: "前往",
	[Key.skills]: "技能展示",
	[Key.skillsSubtitle]: "我的技术技能和专业知识",
	[Key.skillsFrontend]: "前端开发",
	[Key.skillsBackend]: "后端开发",
	[Key.skillsDatabase]: "数据库",
	[Key.skillsTools]: "开发工具",
	[Key.skillsOther]: "其他技能",
	[Key.skillYears]: "年",
	[Key.skillMonths]: "个月",
	[Key.skillsExpert]: "专家级",
	[Key.skillsAdvanced]: "高级",
	[Key.skillsIntermediate]: "中级",
	[Key.skillsBeginner]: "初级",
	[Key.noData]: "暂无数据",

	// 时间线页面
	[Key.timeline]: "时间线",
	[Key.timelineSubtitle]: "我的成长历程和重要里程碑",
	[Key.timelineEducation]: "教育经历",
	[Key.timelineWork]: "工作经历",
	[Key.timelineProject]: "项目经历",
	[Key.timelineAchievement]: "成就荣誉",
	[Key.timelinePresent]: "至今",
	[Key.timelineMonths]: "个月",
	[Key.timelineYears]: "年",
	[Key.timelineCurrent]: "当前状态",
	[Key.timelineAchievements]: "成就荣誉",
	[Key.passwordProtected]: "密码保护",
	[Key.passwordProtectedDescription]: "请输入密码以查看受保护的内容",
	[Key.postEncrypted]: "已加密",
	[Key.passwordPlaceholder]: "请输入密码",
	[Key.passwordUnlock]: "解锁",
	[Key.passwordUnlocking]: "解锁中...",
	[Key.passwordIncorrect]: "密码错误，请重试",
	[Key.passwordRequired]: "请输入密码",
	[Key.passwordDecryptRetry]: "解密失败，请重试",
	[Key.decryptionError]: "解密过程中发生错误:",
	[Key.passwordHint]: "提示",

	//最后编辑时间卡片
	[Key.lastModifiedPrefix]: "距离上次编辑: ",
	[Key.lastModifiedOutdated]: "部分信息可能已经过时",
	[Key.year]: "年",
	[Key.month]: "月",
	[Key.day]: "天",
	[Key.hour]: "小时",
	[Key.minute]: "分",
	[Key.second]: "秒",

	// RSS 页面
	[Key.rss]: "RSS 订阅",
	[Key.atom]: "Atom 订阅",
	[Key.wallpaperBanner]: "横幅模式",
	[Key.wallpaperFullscreen]: "全屏模式",
	[Key.wallpaperNone]: "隐藏壁纸",

	// 站点统计
	[Key.siteStats]: "站点统计",
	[Key.siteStatsPostCount]: "文章",
	[Key.siteStatsCategoryCount]: "分类",
	[Key.siteStatsTagCount]: "标签",
	[Key.siteStatsTotalWords]: "总字数",
	[Key.siteStatsRunningDays]: "运行天数",
	[Key.siteStatsLastUpdate]: "最后活动",
	[Key.siteStatsDaysAgo]: "{days} 天前",
	[Key.siteStatsDays]: "{days} 天",

	// 日历组件
	[Key.calendarSunday]: "日",
	[Key.calendarMonday]: "一",
	[Key.calendarTuesday]: "二",
	[Key.calendarWednesday]: "三",
	[Key.calendarThursday]: "四",
	[Key.calendarFriday]: "五",
	[Key.calendarSaturday]: "六",
	[Key.calendarJanuary]: "1月",
	[Key.calendarFebruary]: "2月",
	[Key.calendarMarch]: "3月",
	[Key.calendarApril]: "4月",
	[Key.calendarMay]: "5月",
	[Key.calendarJune]: "6月",
	[Key.calendarJuly]: "7月",
	[Key.calendarAugust]: "8月",
	[Key.calendarSeptember]: "9月",
	[Key.calendarOctober]: "10月",
	[Key.calendarNovember]: "11月",
	[Key.calendarDecember]: "12月",

	// 分享功能
	[Key.shareArticle]: "分享",
	[Key.generatingPoster]: "正在生成海报...",
	[Key.copied]: "已复制",
	[Key.copyLink]: "复制链接",
	[Key.savePoster]: "保存海报",
	[Key.scanToRead]: "扫码阅读",
	[Key.shareOnSocial]: "分享",
	[Key.shareOnSocialDescription]:
		"如果这篇文章对你有帮助，欢迎分享给更多人！",

	// 个人资料
	[Key.profileStatsLoading]: "统计加载中...",
	[Key.profileStatsPageViews]: "浏览量",
	[Key.profileStatsVisits]: "访问次数",
	[Key.pageViewsLoading]: "统计加载中...",
	[Key.switchToGridMode]: "切换到网格模式",
	[Key.switchToListMode]: "切换到列表模式",

	// 相关文章与随机文章
	[Key.relatedPosts]: "相关文章",
	[Key.randomPosts]: "随机文章",
	[Key.smartRecommend]: "智能推荐",
	[Key.randomRecommend]: "随机推荐",
};
