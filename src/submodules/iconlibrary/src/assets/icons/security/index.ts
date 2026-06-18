import CheckBoxBlank from './checkbox-unchecked.svg';
import CheckBox from './checkbox-checked.svg';
import KeyAltBack from './key-alt-back.svg';
import Lock from './lock.svg'


export const securityIcons = {
	checkboxBlank: CheckBoxBlank,
	checkboxChecked: CheckBox,
	keyAltBack: KeyAltBack,
	lock: Lock
} as const;

export type SystemIconName = keyof typeof securityIcons;