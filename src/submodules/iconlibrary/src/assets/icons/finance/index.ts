import Wallet from "./wallet.svg";
import CreditCard from "./credit-card.svg";
import Cash from "./cash.svg";
import CreditCards from "./credit-cards.svg";
import Dollar from "./dollar.svg";
import Discount from "./discount.svg";
import Coin from "./coin.svg";

export const financeIcons = {
	wallet: Wallet,
	creditCard: CreditCard,
	cash: Cash,
	creditCards: CreditCards,
	dollar: Dollar,
	discount: Discount,
	coin: Coin
} as const;

export type SystemIconName = keyof typeof financeIcons;