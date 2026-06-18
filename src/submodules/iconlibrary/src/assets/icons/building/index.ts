import Building from "./building.svg";

export const buildingIcons = {
	building: Building,
} as const;

export type SystemIconName = keyof typeof buildingIcons;