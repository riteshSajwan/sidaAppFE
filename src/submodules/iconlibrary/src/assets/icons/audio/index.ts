import Mic from "./mic.svg";

export const audioIcons = {
	mic: Mic,
} as const;

export type SystemIconName = keyof typeof audioIcons;