import { useWindowDimensions } from "react-native";

export const useResponsive = () => {
	const { width } = useWindowDimensions();

	const isMobile = width < 500;
	const isTablet = width >= 500 && width < 1200;
	const isDesktop = width >= 1200;

	const responsiveStyle = <T,>({
		mobile,
		tablet,
		desktop,
	}: {
		mobile?: T;
		tablet?: T;
		desktop: T; 
	}): T => {
		if (isMobile && mobile !== undefined) return mobile;
		if (isTablet && tablet !== undefined) return tablet;
		return desktop; 
	};

	return { isMobile, isTablet, isDesktop, responsiveStyle };
};
