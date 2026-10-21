import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
	[Key.home]: "ホーム",
	[Key.about]: "このブログについて",
	[Key.archive]: "アーカイブ",
	[Key.search]: "検索",
	[Key.other]: "その他",

	// ナビゲーションバータイトル
	[Key.navLinks]: "リンク",
	[Key.navMy]: "私の",
	[Key.navAbout]: "情報",
	[Key.navOthers]: "その他",

	[Key.tags]: "タグ",
	[Key.categories]: "カテゴリー",
	[Key.recentPosts]: "最近の投稿",
	[Key.postList]: "投稿の一覧",
	[Key.tableOfContents]: "目次",
	[Key.tocEmpty]: "目次はありません",

	// お知らせ
	[Key.announcement]: "お知らせ",
	[Key.announcementClose]: "閉じる",

	[Key.friends]: "友達",
	[Key.friendsSubtitle]: "もっと素敵なウェブサイトを見つける",
	[Key.friendsSearchPlaceholder]: "友達の名前または説明を検索...",
	[Key.friendsFilterAll]: "すべて",
	[Key.friendsNoResults]: "一致する友達が見つかりません",
	[Key.friendsVisit]: "訪問",
	[Key.friendsCopyLink]: "リンク",
	[Key.friendsCopySuccess]: "コピーしました",
	[Key.copyFailed]: "コピーに失敗しました。手動でコピーしてください",
	[Key.uncategorized]: "未分類",
	[Key.noTags]: "タグはありません",

	[Key.wordCount]: "文字",
	[Key.wordsCount]: "文字",
	[Key.minuteCount]: "分",
	[Key.minutesCount]: "分",
	[Key.postCount]: "件の投稿",
	[Key.postsCount]: "件の投稿",

	[Key.themeColor]: "テーマの色",

	[Key.lightMode]: "ライト",
	[Key.darkMode]: "ダーク",

	[Key.more]: "詳細を表示",

	[Key.author]: "著者",
	[Key.publishedAt]: "公開日",
	[Key.license]: "ライセンス",
	[Key.anime]: "視聴したアニメ",
	[Key.diary]: "日記",

	// アニメページ
	[Key.animeTitle]: "視聴したアニメ",
	[Key.animeSubtitle]: "アニメの旅の記録です",
	[Key.animeStatusWatching]: "視聴中",
	[Key.animeStatusCompleted]: "完了",
	[Key.animeStatusPlanned]: "検討中",
	[Key.animeStatusOnHold]: "保留中",
	[Key.animeStatusDropped]: "中断",
	[Key.animeFilterAll]: "すべて",
	[Key.animeYear]: "年",
	[Key.animeStudio]: "スタジオ",
	[Key.animeEmpty]: "アニメのデータはありません",
	[Key.animeEmptyBangumi]:
		"Bangumiの構成またはネットワークを接続を確認してください",
	[Key.animeEmptyBilibili]:
		"Bilibiliの構成またはネットワーク接続を確認してください",
	[Key.animeEmptyLocal]:
		"src/data/anime.tsのファイルにアニメの情報を追加してください",
	[Key.animeConfigBilibili]:
		"src/config.tsファイルでBilibili vmidを設定してください",
	[Key.animeConfigBangumi]:
		"src/config.tsファイルでBangumi userIdを設定してください",

	// 日記ページ
	[Key.diarySubtitle]: "いつでも、どこでも生活を共有",
	[Key.diaryNoResults]: "一致する日記がありません",
	[Key.diaryCount]: "件の日記",

	[Key.diaryTips]: "最新の30件の日記のエントリーのみを表示",
	[Key.diaryMinutesAgo]: "分前",
	[Key.diaryHoursAgo]: "時間前",
	[Key.diaryDaysAgo]: "日前",

	// 404ページ
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "ページが見つかりません",
	[Key.notFoundDescription]:
		"申し訳ありません、アクセスしたページは存在しないか移動されています。",
	[Key.backToHome]: "ホームに戻る",

	// 音楽プレーヤー
	[Key.musicPlayer]: "音楽プレーヤー",
	[Key.musicPlayerShow]: "音楽プレーヤーを表示",
	[Key.musicPlayerHide]: "音楽プレーヤーを非表示",
	[Key.musicPlayerExpand]: "音楽プレーヤーを展開",
	[Key.musicPlayerCollapse]: "音楽プレーヤーを折りたたむ",
	[Key.musicPlayerPause]: "一時停止",
	[Key.musicPlayerPlay]: "再生",
	[Key.musicPlayerVolume]: "音量コントロール",
	[Key.musicPlayerProgress]: "再生状況",
	[Key.musicPlayerCover]: "カバー",
	[Key.musicPlayerPlaylist]: "プレイリスト",
	[Key.musicPlayerErrorPlaylist]: "プレイリストを取得できませんでした。",
	[Key.musicPlayerErrorSong]:
		"曲の読み込みに失敗しました。次の曲を再生します。",
	[Key.musicPlayerErrorEmpty]: "プレイリストに利用可能な曲がありません。",
	[Key.unknownSong]: "不明な曲",
	[Key.unknownArtist]: "不明なアーティスト",

	// アルバムページ
	[Key.albums]: "アルバム",
	[Key.albumsSubtitle]: "人生の美しい瞬間の記録です",
	[Key.albumsEmpty]: "コンテンツはありません",
	[Key.albumsEmptyDesc]:
		"まだアルバムが作成されていません。美しい思い出を追加しましょう!",
	[Key.albumsBackToList]: "アルバムに戻る",

	// デバイスページ
	[Key.devices]: "デバイス",
	[Key.devicesSubtitle]: "日常的に使用しているデバイスを紹介",
	[Key.devicesViewDetails]: "詳細を表示",
	[Key.albumsPhotosCount]: "件の写真",
	[Key.albumsFilterAll]: "すべて",
	[Key.albumsNoResults]: "一致するアルバムがありません",

	// プロジェクトページ
	[Key.projects]: "プロジェクト",
	[Key.projectsSubtitle]: "開発プロジェクトのポートフォリオ",
	[Key.projectsWeb]: "ウェブアプリ",
	[Key.projectsMobile]: "モバイルアプリ",
	[Key.projectsDesktop]: "デスクトップアプリ",
	[Key.projectsOther]: "その他",
	[Key.projectsCompleted]: "完了",
	[Key.projectsInProgress]: "進行中",
	[Key.projectsPlanned]: "計画中",
	[Key.projectsVisit]: "プロジェクトを開く",
	[Key.rss]: "RSSフィード",
	[Key.atom]: "Atomフィード",
	[Key.wallpaperBanner]: "バナーモード",
	[Key.wallpaperFullscreen]: "フルスクリーンモード",
	[Key.wallpaperNone]: "壁紙を非表示",

	// スキルページ
	[Key.skills]: "スキル",
	[Key.skillsSubtitle]: "技術スキルと専門知識",
	[Key.skillsFrontend]: "フロントエンド開発",
	[Key.skillsBackend]: "バックエンド開発",
	[Key.skillsDatabase]: "データベース",
	[Key.skillsTools]: "開発ツール",
	[Key.skillsOther]: "その他のスキル",
	[Key.skillYears]: "年",
	[Key.skillMonths]: "ヶ月",
	[Key.skillsExpert]: "エキスパートレベル",
	[Key.skillsAdvanced]: "上級者",
	[Key.skillsIntermediate]: "中級者",
	[Key.skillsBeginner]: "初心者",
	[Key.noData]: "データなし",

	// タイムラインページ
	[Key.timeline]: "タイムライン",
	[Key.timelineSubtitle]: "成長への旅と重要なマイルストーン",
	[Key.timelineEducation]: "教育",
	[Key.timelineWork]: "実務経験",
	[Key.timelineProject]: "プロジェクト経験",
	[Key.timelineAchievement]: "実績",
	[Key.timelinePresent]: "現在",
	[Key.timelineMonths]: "ヶ月",
	[Key.timelineYears]: "年",
	[Key.timelineCurrent]: "現在のステータス",
	[Key.timelineAchievements]: "実績",
	[Key.passwordProtected]: "パスワードで保護されています",
	[Key.passwordProtectedDescription]:
		"保護されたコンテンツを表示するにはパスワードを入力してください。",
	[Key.postEncrypted]: "暗号化",
	[Key.passwordPlaceholder]: "パスワードを入力",
	[Key.passwordUnlock]: "ロックを解除",
	[Key.passwordUnlocking]: "ロックを解除中...",
	[Key.passwordIncorrect]: "パスワードが間違っています。再度お試しください。",
	[Key.passwordRequired]: "パスワードを入力してください。",
	[Key.passwordDecryptRetry]: "復号に失敗しました。再度お試しください。",
	[Key.decryptionError]: "復号中にエラーが発生しました:",
	[Key.passwordHint]: "ヒント",

	// 最終更新時間カード
	[Key.lastModifiedPrefix]: "最終編集からの時間: ",
	[Key.lastModifiedOutdated]: "一部の情報は古い可能性があります",
	[Key.year]: "年",
	[Key.month]: "月",
	[Key.day]: "日",
	[Key.hour]: "時間",
	[Key.minute]: "分",
	[Key.second]: "秒",

	// 統計情報
	[Key.siteStats]: "統計情報",
	[Key.siteStatsPostCount]: "投稿",
	[Key.siteStatsCategoryCount]: "カテゴリー",
	[Key.siteStatsTagCount]: "タグ",
	[Key.siteStatsTotalWords]: "文字数の合計",
	[Key.siteStatsRunningDays]: "稼働日数",
	[Key.siteStatsLastUpdate]: "最終更新",
	[Key.siteStatsDaysAgo]: "{days}日前",
	[Key.siteStatsDays]: "{days}日",

	// カレンダーコンポーネント
	[Key.calendarSunday]: "日",
	[Key.calendarMonday]: "月",
	[Key.calendarTuesday]: "火",
	[Key.calendarWednesday]: "水",
	[Key.calendarThursday]: "木",
	[Key.calendarFriday]: "金",
	[Key.calendarSaturday]: "土",
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

	// 共有機能
	[Key.shareArticle]: "共有",
	[Key.generatingPoster]: "ポスターを生成中...",
	[Key.copied]: "コピーしました",
	[Key.copyLink]: "リンクをコピー",
	[Key.savePoster]: "ポスターを保存",
	[Key.scanToRead]: "スキャンで読み込む",
	[Key.shareOnSocial]: "共有",
	[Key.shareOnSocialDescription]:
		"この記事が役に立ったときは、ぜひ他の人に共有してください!",

	// プロフィールの統計
	[Key.profileStatsLoading]: "統計を読み込み中...",
	[Key.profileStatsPageViews]: "ページの閲覧",
	[Key.profileStatsVisits]: "訪問",
	[Key.pageViewsLoading]: "統計を読み込み中...",
	[Key.switchToGridMode]: "グリッド表示に切り替え",
	[Key.switchToListMode]: "リスト表示に切り替え",

	// 関連記事とランダム記事
	[Key.relatedPosts]: "関連記事",
	[Key.randomPosts]: "ランダム記事",
	[Key.smartRecommend]: "スマート",
	[Key.randomRecommend]: "ランダム",
};
