import Pickup from "./pin-alt.svg";
import MapsArrowDiagonal from "./maps-arrow-diagonal.svg";
import Position from "./position.svg";
import PinAlt from "./pin-alt.svg";

export const mapsIcons = {
	pickup: Pickup,
	mapsArrowDiagonal: MapsArrowDiagonal,
	position: Position,
	pinAlt: PinAlt,
} as const;

export type SystemIconName = keyof typeof mapsIcons;