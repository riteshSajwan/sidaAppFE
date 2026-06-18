import SunLight from "./sun-light.svg";

export const weatherIcons = {
	sunLight: SunLight,
} as const;

export type SystemIconName = keyof typeof weatherIcons;