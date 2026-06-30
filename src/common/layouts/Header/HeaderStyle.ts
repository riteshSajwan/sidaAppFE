import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useHeaderStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    header: {
      // Light white header — matches the design reference
      backgroundColor: theme.colors.surfaceBase,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
      elevation: 0,
      shadowOpacity: 0,
    },
    logo: {
      width: 250,
      height: 40,
      marginLeft: theme.spacing.sm,
    },
    leftSide: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: theme.spacing.md,
    },
    badge: {
      backgroundColor: theme.colors.surfaceErrorDark,
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
      gap: theme.spacing.md,
      marginRight: theme.spacing.xl,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: theme.roundness.xl,
      marginBottom: theme.spacing.sm,
    },
    item_style: {
      marginLeft: theme.spacing.sm,
      color: theme.colors.textBody,
    },
    color_black: {
      backgroundColor: theme.colors.surfaceBase,
    },
    drawerSection: {
      backgroundColor: theme.colors.surfaceBase,
      padding: theme.spacing.sm,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Breadcrumb row
    breadcrumb: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      flexWrap: 'wrap',
    },
    // Parent crumb (muted grey, clickable)
    breadcrumbLabel: {
      color: theme.colors.textBodyLight,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
    },
    // Active / current crumb (dark, bold)
    breadcrumbLabelActive: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    // "/" separator between crumbs
    breadcrumbSeparator: {
      color: theme.colors.textBodyLight,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
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
    // Right-side profile pill (avatar circle + name + role)
    profilePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    avatarCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceInverse,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: {
      color: theme.colors.textInverse,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    profileName: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    profileRole: {
      color: theme.colors.textBodyLight,
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
    },
    notificationBtn: {
      position: 'relative',
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
