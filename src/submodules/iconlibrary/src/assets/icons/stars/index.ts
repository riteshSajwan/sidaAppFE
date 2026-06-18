import StartOutline from "./star-outline.svg";
import Star from './star.svg'

export const startIcons = {
	startOutline: StartOutline,
	star: Star
} as const;

export type SystemIconName = keyof typeof startIcons;