import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useTabStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    navHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 75,
      borderStyle: 'solid',
      borderBottomWidth: 1,
      borderColor: theme.colors.borderDisabled,
      marginBottom: theme.spacing.xxl,
      marginHorizontal: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    headerTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSize.textHeadingMedium,
      lineHeight: theme.fontSize.textHeadingMedium * 1.2,
      color: theme.colors.textBody,
      top: 3,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      columnGap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      width: '100%',
    },
    navTitle: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.S2Subtitle,
      lineHeight: theme.fontSize.S2Subtitle * 1.2,
      color: theme.colors.textErrorDark,
    },
    navIcon: {
      width: 32,
      height: 32,
    },
    badgeIcon: {
      backgroundColor: theme.colors.surfaceSuccessInverse,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.textCaptionS,
      lineHeight: theme.fontSize.textCaptionS * 1.2,
      position: 'absolute',
      right: -theme.spacing.sm,
      top: -theme.spacing.xs,
    },
  });
}