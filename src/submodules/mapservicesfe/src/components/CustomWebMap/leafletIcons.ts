import L from "leaflet";

export const createMarkerIcon = ({
	src,
	size = 36,
	width,
	height,
	offsetY = 0,
}: {
	src?: string;
	size?: number;
	width?: number;
	height?: number;
	offsetY?: number;
}) => {
	const finalWidth = width ?? size;
	const finalHeight = height ?? size;

	return L.icon({
		iconUrl: src ?? "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
		iconSize: [finalWidth, finalHeight],
		iconAnchor: [finalWidth / 2, finalHeight + offsetY],
		popupAnchor: [0, -(finalHeight / 2)],
	});
};

