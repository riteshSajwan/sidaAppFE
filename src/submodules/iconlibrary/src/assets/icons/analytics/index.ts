import Graphdown from "./graph-down.svg";
import StatsDownSquare from "./stats-down-square.svg";

export const analyticsIcons = {
	graphdown: Graphdown,
	statsDownSquare: StatsDownSquare,
} as const;

export type SystemIconName = keyof typeof analyticsIcons;