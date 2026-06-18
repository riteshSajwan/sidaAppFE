import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useTableStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceBase,
    },
    tableScrollWidth:{
      minWidth: 810,
      width: '100%',
    },
    headerText: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSize.S2Subtitle,
      color: theme.colors.textBody,
      textAlign: 'left',
    },
    sortIcon: {
      fontSize: theme.fontSize.textCaptionS,
      color: theme.colors.iconNeutral,
      marginLeft: theme.spacing.xs,
    },
    statusText: {
      fontFamily: theme.fontFamily.bold,
      padding: theme.spacing.xs,
      borderRadius: theme.roundness.xs,
      textAlign: 'center',
    },
    statusActive: {
      backgroundColor: theme.colors.surfaceSuccessBase,
      color: theme.colors.textSuccessDark,
      fontFamily: theme.fontFamily.bold,
    },
    statusInactive: {
      backgroundColor: theme.colors.surfaceSecondaryInverse,
      color: theme.colors.textWarningDark,
      fontFamily: theme.fontFamily.bold,
    },
    actionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionText: {
      color: theme.colors.textErrorDark,
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSize.textLabelSmall,
    },
    actionIcon: {
      margin: 0,
    },
    locateMap: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    fs17: {
      fontSize: 17
    },
    cellStyle: {
      fontFamily: theme.fontFamily.regular,
      textTransform: 'capitalize',
      color: theme.colors.textBody,
      textAlign: 'left',
    },
    leftAlignedText: {
      width: '100%',
      textAlign: 'left',
    },
    cellPadding: {
      padding: 0,
    },
    orderstatus: {
      backgroundColor: theme.colors.surfaceSuccessInverse,
      padding: theme.spacing.xs,
      borderRadius: theme.roundness.xs,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textInverse,
      textAlign: 'center',
      fontSize: theme.fontSize.textCaptionTiny,
    },
    pagination: {
      top: -theme.spacing.lg,
    },
    w100:{
      width: '100%',
    },
  });
}
