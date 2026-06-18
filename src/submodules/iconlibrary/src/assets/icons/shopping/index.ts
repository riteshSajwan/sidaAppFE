import ShoppingBag from "./shopping-bag.svg";

export const shoppingIcons = {
	shoppingBag: ShoppingBag,
} as const;

export type SystemIconName = keyof typeof shoppingIcons;