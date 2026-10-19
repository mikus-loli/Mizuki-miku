export interface CalendarPost {
	id: string;
	title: string;
	date: string;
}

export interface CalendarStats {
	hasPostInYear: Record<number, boolean>;
	hasPostInMonth: Record<string, boolean>;
	minYear: number;
	maxYear: number;
}

export interface CalendarGridCell {
	day: number;
	dateKey: string;
	posts: CalendarPost[];
	hasPost: boolean;
	postCount: number;
	isToday: boolean;
	isSelected: boolean;
	isEmpty: boolean;
}

