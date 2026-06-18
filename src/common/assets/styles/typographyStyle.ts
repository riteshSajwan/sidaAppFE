import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useTypographyStyle = () => {
	const { theme } = useAppTheme();

	return StyleSheet.create({
		heading: {
			fontFamily: theme.fontFamily.bold,
			color: theme.colors.textHeading,
			fontSize: theme.fontSize.textHeadingLarge,
			lineHeight: theme.fontSize.textHeadingLarge * 1.2,
		},
		subHeading: {
			fontFamily: theme.fontFamily.semiBold,
			color: theme.colors.textHeading,
			fontSize: theme.fontSize.textHeadingMedium,
			lineHeight: theme.fontSize.textHeadingMedium * 1.2,
		},
		body: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textBody,
			fontSize: theme.fontSize.textBodyMedium,
			lineHeight: theme.fontSize.textBodyMedium * 1.4,
			flexShrink:1
		},
		anchorText: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textLinkDark,
			fontSize: theme.fontSize.textBodyMedium,
			lineHeight: theme.fontSize.textBodyMedium * 1.4,
		},
		termsText: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textBody,
			fontSize: theme.fontSize.textBodyMedium,
			lineHeight: theme.fontSize.textBodyMedium * 1.4,
		},
		chipText: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textBody,
			alignItems: 'center',
			textAlign: 'center',
			fontSize: theme.fontSize.textBodyMedium,
			lineHeight: theme.fontSize.textBodyMedium * 1.4,
		},
		btnText: {
			fontFamily: theme.fontFamily.semiBold,
			color: theme.colors.textBody,
			borderRadius: theme.roundness.sm,
			paddingHorizontal: theme.spacing.lg,
			alignItems: 'center',
			textAlign: 'center',
			fontSize: theme.fontSize.textButtonLarge,
			lineHeight: theme.fontSize.textButtonLarge * 1.8,
		},
		errorMessage: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textErrorDark,
			fontSize: theme.fontSize.textBodyMedium,
			lineHeight: theme.fontSize.textBodyMedium * 1.4,
			marginTop: theme.spacing.xs,
		},
		subTitle: {
			fontFamily: theme.fontFamily.semiBold,
			color: theme.colors.textHeading,
			fontSize: theme.fontSize.S1Subtitle,
			lineHeight: theme.fontSize.S1Subtitle * 1.2,
		},
		textLabel: {
			fontFamily: theme.fontFamily.regular,
			color: theme.colors.textBody,
			fontSize: theme.fontSize.textLabelSmall,
			lineHeight: theme.fontSize.textLabelSmall * 1.4,
		},
	});
};