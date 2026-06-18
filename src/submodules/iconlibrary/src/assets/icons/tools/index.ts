import Delete from "./delete-alt.svg";
import Search from "./search.svg";
import Filter from './filter.svg'

export const toolsIcons = {
	delete: Delete,
	search: Search,
	filter: Filter
} as const;

export type SystemIconName = keyof typeof toolsIcons;

