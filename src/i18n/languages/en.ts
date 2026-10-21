import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "Search",
	[Key.other]: "Other",

	// Navigation bar titles
	[Key.navLinks]: "Links",
	[Key.navMy]: "My",
	[Key.navAbout]: "About",
	[Key.navOthers]: "Others",

	[Key.tags]: "Tags",
	[Key.categories]: "Categories",
	[Key.recentPosts]: "Recent Posts",
	[Key.postList]: "Post List",
	[Key.tableOfContents]: "Table of Contents",
	[Key.tocEmpty]: "No table of contents",

	// Announcement
	[Key.announcement]: "Announcement",
	[Key.announcementClose]: "Close",

	[Key.friends]: "Friends",
	[Key.friendsSubtitle]: "Discover more great websites",
	[Key.friendsSearchPlaceholder]: "Search friend's name or description...",
	[Key.friendsFilterAll]: "All",
	[Key.friendsNoResults]: "No matching friends found",
	[Key.friendsVisit]: "Visit",
	[Key.friendsCopyLink]: "Copy Link",
	[Key.friendsCopySuccess]: "Copied",
	[Key.copyFailed]: "Copy failed, please copy manually",
	[Key.pageNumber]: "Page {n}",
	[Key.rssSubtitle]: "Subscribe with any RSS reader and new posts show up automatically.",
	[Key.rssLink]: "Feed URL",
	[Key.rssCopyToReader]: "Copy the URL below and paste it into your reader.",
	[Key.rssLatestPosts]: "Latest posts",
	[Key.rssWhatIsRss]: "What is RSS?",
	[Key.rssWhatIsRssDescription]: "RSS is a standard format for publishing site updates. Your reader checks it regularly and delivers new posts — no account, no email, no recommendation algorithm in between.",
	[Key.rssBenefit1]: "No sign-up and no marketing email",
	[Key.rssBenefit2]: "All your subscriptions in one reader, in chronological order",
	[Key.rssBenefit3]: "New posts sync automatically; older ones stay readable offline",
	[Key.rssBenefit4]: "Read state lives in your own reader, not on this site",
	[Key.rssHowToUse]: "How to use: copy the URL above and paste it into the add-feed dialog of Feedly, Inoreader, NetNewsWire, FreshRSS, or any other reader.",
	[Key.atomSubtitle]: "Subscribe with any Atom-capable reader and new posts sync automatically.",
	[Key.atomLink]: "Feed URL",
	[Key.atomCopyToReader]: "Copy the URL below and paste it into your reader.",
	[Key.atomLatestPosts]: "Latest posts",
	[Key.atomWhatIsAtom]: "What is Atom?",
	[Key.atomWhatIsAtomDescription]: "Atom is the modern alternative to RSS. Its specification is stricter, with clearer handling of dates, authors and content types, and every mainstream reader supports it.",
	[Key.atomBenefit1]: "No sign-up and no marketing email",
	[Key.atomBenefit2]: "All your subscriptions in one reader, in chronological order",
	[Key.atomBenefit3]: "New posts sync automatically; older ones stay readable offline",
	[Key.atomBenefit4]: "Stricter format means fewer wrong dates and authors",
	[Key.atomHowToUse]: "How to use: copy the URL above and add it as a feed in any Atom-capable reader.",
	[Key.uncategorized]: "Uncategorized",
	[Key.noTags]: "No Tags",

	[Key.wordCount]: "word",
	[Key.wordsCount]: "words",
	[Key.minuteCount]: "minute",
	[Key.minutesCount]: "minutes",
	[Key.postCount]: "post",
	[Key.postsCount]: "posts",

	[Key.themeColor]: "Theme Color",

	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",

	[Key.more]: "More",

	[Key.author]: "Author",
	[Key.publishedAt]: "Published at",
	[Key.license]: "License",
	[Key.anime]: "Anime",
	[Key.diary]: "Diary",

	// Anime Page
	[Key.animeTitle]: "My Anime List",
	[Key.animeSubtitle]: "Record my anime journey",
	[Key.animeStatusWatching]: "Watching",
	[Key.animeStatusCompleted]: "Completed",
	[Key.animeStatusPlanned]: "Planned",
	[Key.animeStatusOnHold]: "On Hold",
	[Key.animeStatusDropped]: "Dropped",
	[Key.animeFilterAll]: "All",
	[Key.animeYear]: "Year",
	[Key.animeStudio]: "Studio",
	[Key.animeEmpty]: "No anime data available",
	[Key.animeEmptyBangumi]:
		"Please check Bangumi configuration or network connection",
	[Key.animeEmptyBilibili]:
		"Please check Bilibili configuration or network connection",
	[Key.animeEmptyLocal]:
		"Please add anime information in src/data/anime.ts file",
	[Key.animeConfigBilibili]:
		"Please set your Bilibili vmid in the src/config.ts file",
	[Key.animeConfigBangumi]:
		"Please set your Bangumi userId in the src/config.ts file",

	// Diary Page
	[Key.diarySubtitle]: "Share life, anytime, anywhere",
	[Key.diaryNoResults]: "No matching moments",
	[Key.diaryCount]: "entries",

	[Key.diaryTips]: "Only show the latest 30 diary entries",
	[Key.diaryMinutesAgo]: "minutes ago",
	[Key.diaryHoursAgo]: "hours ago",
	[Key.diaryDaysAgo]: "days ago",

	// 404 Page
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "Page Not Found",
	[Key.notFoundDescription]:
		"Sorry, the page you visited does not exist or has been moved.",
	[Key.backToHome]: "Back to Home",

	// Music Player
	[Key.musicPlayer]: "Music Player",
	[Key.musicPlayerShow]: "Show Music Player",
	[Key.musicPlayerHide]: "Hide Music Player",
	[Key.musicPlayerExpand]: "Expand Music Player",
	[Key.musicPlayerCollapse]: "Collapse Music Player",
	[Key.musicPlayerPause]: "Pause",
	[Key.musicPlayerPlay]: "Play",
	[Key.musicPlayerVolume]: "Volume Control",
	[Key.musicPlayerProgress]: "Playback Progress",
	[Key.musicPlayerCover]: "Cover",
	[Key.musicPlayerPlaylist]: "Playlist",
	[Key.musicPlayerErrorPlaylist]: "Failed to fetch playlist",
	[Key.musicPlayerErrorSong]: "Failed to load current song, trying next",
	[Key.musicPlayerErrorEmpty]: "No available songs in playlist",
	[Key.unknownSong]: "Unknown Song",
	[Key.unknownArtist]: "Unknown Artist",

	// Albums Page
	[Key.albums]: "Albums",
	[Key.albumsSubtitle]: "Record beautiful moments in life",
	[Key.albumsEmpty]: "No content",
	[Key.albumsEmptyDesc]:
		"No albums have been created yet. Go add some beautiful memories!",
	[Key.albumsBackToList]: "Back to Albums",

	// Devices Page
	[Key.devices]: "My Devices",
	[Key.devicesSubtitle]: "Here are the devices I use in my daily life",
	[Key.devicesViewDetails]: "View Details",
	[Key.albumsPhotosCount]: "photos",
	[Key.albumsFilterAll]: "All",
	[Key.albumsNoResults]: "No matching albums",

	// Projects Page
	[Key.projects]: "Projects",
	[Key.projectsSubtitle]: "My development project portfolio",
	[Key.projectsWeb]: "Web Applications",
	[Key.projectsMobile]: "Mobile Applications",
	[Key.projectsDesktop]: "Desktop Applications",
	[Key.projectsOther]: "Other",
	[Key.projectsCompleted]: "Completed",
	[Key.projectsInProgress]: "In Progress",
	[Key.projectsPlanned]: "Planned",
	[Key.projectsVisit]: "Visit Project",
	[Key.rss]: "RSS Feed",
	[Key.atom]: "Atom Feed",
	[Key.wallpaperBanner]: "Banner Mode",
	[Key.wallpaperFullscreen]: "Fullscreen Mode",
	[Key.wallpaperNone]: "Hide Wallpaper",

	// Skills Page
	[Key.skills]: "Skills",
	[Key.skillsSubtitle]: "My technical skills and expertise",
	[Key.skillsFrontend]: "Frontend Development",
	[Key.skillsBackend]: "Backend Development",
	[Key.skillsDatabase]: "Database",
	[Key.skillsTools]: "Development Tools",
	[Key.skillsOther]: "Other Skills",
	[Key.skillYears]: "years",
	[Key.skillMonths]: "months",
	[Key.skillsExpert]: "Expert Level",
	[Key.skillsAdvanced]: "Advanced",
	[Key.skillsIntermediate]: "Intermediate",
	[Key.skillsBeginner]: "Beginner",
	[Key.noData]: "No data",

	// Timeline Page
	[Key.timeline]: "Timeline",
	[Key.timelineSubtitle]: "My growth journey and important milestones",
	[Key.timelineEducation]: "Education",
	[Key.timelineWork]: "Work Experience",
	[Key.timelineProject]: "Project Experience",
	[Key.timelineAchievement]: "Achievements",
	[Key.timelinePresent]: "Present",
	[Key.timelineMonths]: "months",
	[Key.timelineYears]: "years",
	[Key.timelineCurrent]: "Current Status",
	[Key.timelineAchievements]: "Achievements",
	[Key.passwordProtected]: "Password Protected",
	[Key.passwordProtectedDescription]:
		"Please enter the password to view the protected content",
	[Key.postEncrypted]: "Encrypted",
	[Key.passwordPlaceholder]: "Enter password",
	[Key.passwordUnlock]: "Unlock",
	[Key.passwordUnlocking]: "Unlocking...",
	[Key.passwordIncorrect]: "Incorrect password, please try again",
	[Key.passwordRequired]: "Please enter the password",
	[Key.passwordDecryptRetry]: "Decryption failed, please try again",
	[Key.decryptionError]: "An error occurred during decryption:",
	[Key.passwordHint]: "Hint",

	// Last Modified Time Card
	[Key.lastModifiedPrefix]: "Time since last edit: ",
	[Key.lastModifiedOutdated]: "Some information may be outdated",
	[Key.year]: "y",
	[Key.month]: "m",
	[Key.day]: "d",
	[Key.hour]: "h",
	[Key.minute]: "min",
	[Key.second]: "s",

	// Site Stats
	[Key.siteStats]: "Site Statistics",
	[Key.siteStatsPostCount]: "Posts",
	[Key.siteStatsCategoryCount]: "Categories",
	[Key.siteStatsTagCount]: "Tags",
	[Key.siteStatsTotalWords]: "Total Words",
	[Key.siteStatsRunningDays]: "Running Days",
	[Key.siteStatsLastUpdate]: "Last Activity",
	[Key.siteStatsDaysAgo]: "{days} days ago",
	[Key.siteStatsDays]: "{days} days",

	// Calendar Component
	[Key.calendarSunday]: "Sun",
	[Key.calendarMonday]: "Mon",
	[Key.calendarTuesday]: "Tue",
	[Key.calendarWednesday]: "Wed",
	[Key.calendarThursday]: "Thu",
	[Key.calendarFriday]: "Fri",
	[Key.calendarSaturday]: "Sat",
	[Key.calendarJanuary]: "Jan",
	[Key.calendarFebruary]: "Feb",
	[Key.calendarMarch]: "Mar",
	[Key.calendarApril]: "Apr",
	[Key.calendarMay]: "May",
	[Key.calendarJune]: "Jun",
	[Key.calendarJuly]: "Jul",
	[Key.calendarAugust]: "Aug",
	[Key.calendarSeptember]: "Sep",
	[Key.calendarOctober]: "Oct",
	[Key.calendarNovember]: "Nov",
	[Key.calendarDecember]: "Dec",

	// Share Functionality
	[Key.shareArticle]: "Share",
	[Key.generatingPoster]: "Generating poster...",
	[Key.copied]: "Copied",
	[Key.copyLink]: "Copy Link",
	[Key.savePoster]: "Save Poster",
	[Key.scanToRead]: "Scan to Read",
	[Key.shareOnSocial]: "Share",
	[Key.shareOnSocialDescription]:
		"If this article helped you, please share it with others!",

	// Profile Stats
	[Key.profileStatsLoading]: "Loading stats...",
	[Key.profileStatsPageViews]: "Page views",
	[Key.profileStatsVisits]: "Visits",
	[Key.pageViewsLoading]: "Loading stats...",
	[Key.switchToGridMode]: "Switch to Grid Mode",
	[Key.switchToListMode]: "Switch to List Mode",

	// Related Posts & Random Posts
	[Key.relatedPosts]: "Related Posts",
	[Key.randomPosts]: "Random Posts",
	[Key.smartRecommend]: "Smart",
	[Key.randomRecommend]: "Random",
};
