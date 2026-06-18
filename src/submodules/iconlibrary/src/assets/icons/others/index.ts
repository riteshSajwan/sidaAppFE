import Camera from './camera.svg';
import CloseAlt from './cross-alt.svg';
import Clock from './clock.svg';
import Tick from './tick.svg';
import Import from './import.svg';
import Legal from './legal-complaince.svg'
import Menu from './menu.svg'
import Car from './icon-car.svg'
import Edit from './icon-edit.svg'
import Pdf from './word-format.svg'
import Word from './pdf-format.svg'
import Steering from './steering.svg'
import Trophy from './trophy.svg'
import Restaurant from './restaurant-fill.svg'
import Timer from './timer.svg'

export const othersIcons = {
	camera: Camera,
	closeAlt: CloseAlt,
	clock: Clock,
	tick: Tick,
	import: Import,
	legal: Legal,
	menu: Menu,
	car: Car,
	edit: Edit,
	pdf: Pdf,
	word: Word,
	steering: Steering,
	trophy: Trophy,
	restaurant: Restaurant,
	timer: Timer,

} as const;

export type SystemIconName = keyof typeof othersIcons;