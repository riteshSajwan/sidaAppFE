import Home from "./home.svg";

export const homeIcons = {
	home: Home,
} as const;

export type SystemIconName = keyof typeof homeIcons;