import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useHeaderStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    header: {
      backgroundColor: theme.colors.surfaceInverse,
      justifyContent: 'space-between',
    },
    logo: {
      width: 250,
      height: 40,
      marginLeft: theme.spacing.sm,
    },
    leftSide: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    badge: {
      backgroundColor: theme.colors.surfaceInverse,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.colors.borderBase,
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.textInverse,
      lineHeight: 16,
      position: 'absolute',
      right: 5,
      top: 15,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 40,
      // mobile: {
      //   marginRight: 0,
      // }
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: theme.roundness.xl,
      marginBottom: theme.spacing.sm,
    },
    item_style: {
      marginLeft: theme.spacing.sm,
      color: theme.colors.textInverse,
    },
    color_black: {
      backgroundColor: theme.colors.surfaceInverse,
    },
    drawerSection: {
      backgroundColor: theme.colors.surfaceInverse,
      padding: theme.spacing.sm,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    breadcrumb: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    breadcrumbLabel: {
      color: theme.colors.textInverse,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
    },
    notificationbadge: {
      position: 'absolute',
      top: -5,
      right: 0,
    },
    productAdminSwitch: {
      backgroundColor: theme.colors.surfaceWarningBase,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      height: 40,
    },
  });
};
