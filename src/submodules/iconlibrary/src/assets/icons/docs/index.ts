import MultiplePagesAdd from './multiple-pages-add.svg';
import Page from './page.svg';



export const docsIcons = {
	multiplePagesAdd: MultiplePagesAdd,
	page: Page,
} as const;

export type SystemIconName = keyof typeof docsIcons;