import ChevronLeft from './chevron-left.svg';
import ArrowLeft from './arrow-left.svg';
import ChevronUp from './chevron-up.svg';
import ChevronDown from './chevron-down.svg';
import DropDown from './dropDownArrow.svg';
import ChevronRight from './chevron-right.svg';


export const navigationIcons = {
	chevronLeft: ChevronLeft,
	ArrowLeft: ArrowLeft,
	chevronUp: ChevronUp,
	chevronDown: ChevronDown,
	dropDown:DropDown,
	chevronRight: ChevronRight,
} as const;

export type SystemIconName = keyof typeof navigationIcons;