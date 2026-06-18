import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useButtonStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    btn: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      fontSize: theme.fontSize.textButtonMedium,
      lineHeight: theme.fontSize.textButtonMedium * 1.5,
      fontFamily: theme.fontFamily.medium,
      textAlign: 'center',
      borderRadius: theme.roundness.sm,
    },
    btnBase: {
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      fontSize: theme.fontSize.textButtonLarge,
      fontFamily: theme.fontFamily.semiBold,
      lineHeight: theme.fontSize.textButtonLarge * 1.7,
      textAlign: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'transparent',
      height: 50,
    },
    btnMd:{
      height: 40,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    btnfilter: {
      minWidth: 0,
      width: 42,
      height: 42,
      padding: 0,
      margin: 0,
      borderRadius: theme.roundness.sm,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
    },
    btnOutlinePrimary: {
      borderColor: theme.colors.borderInverse,
      backgroundColor: theme.colors.surfaceBase,
      color: theme.colors.textHeading,
    },
    btnPrimary: {
      borderColor: theme.colors.borderInverse,
      backgroundColor: theme.colors.surfaceInverse,
      color: theme.colors.textInverse,
    },
    btnInfo: {
      borderColor: theme.colors.borderSecondaryInverse,
      backgroundColor: theme.colors.surfaceSecondaryInverse,
      color: theme.colors.textHeading,
    },
    btnDanger: {
      borderColor: theme.colors.borderErrorInverse,
      backgroundColor: theme.colors.surfaceErrorInverse,
      color: theme.colors.textInverse,
    },
    btnSuccess: {
      borderColor: theme.colors.borderSuccessInverse,
      backgroundColor: theme.colors.surfaceSuccessInverse,
      color: theme.colors.textInverse,
    },
    btnDisabled: {
      backgroundColor: theme.colors.surfaceMedium,
      borderColor: theme.colors.surfaceMedium,
      color: theme.colors.textDisabled,
    },
    btnOutlineDanger: {
      borderColor: theme.colors.borderErrorInverse,
      backgroundColor: theme.colors.surfaceBase,
      color: theme.colors.textErrorDark,
    },
    btnOutlineDefault: {
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
      color: theme.colors.textBodyLight,
    },
    btnOutlineSuccess: {
      borderColor: theme.colors.borderSuccessInverse,
      backgroundColor: theme.colors.surfaceBase,
      color: theme.colors.textSuccessDark,
    },
    btnOulineDisabled: {
      borderColor: theme.colors.borderDisabled,
      backgroundColor: theme.colors.surfaceDisabled,
      color: theme.colors.textDisabled,
    },
    button_md: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    btnIcon: {
      minWidth: 0,
      width: 46,
      height: 46,
      padding: 0,
      margin: 0,

    },
    btnclose: {
      minWidth: 0,
      width: 50,
      height: 51,
      padding: 0,
      margin: 0,
    },
    btnWrapper: {
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterBtn: {
      lineHeight: 26,
      borderRadius: theme.roundness.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.semiBold,
      textAlign: 'center',
    },
    btn250: {
      minWidth: 250,
    },
    btnCircle: {
      borderRadius: '50%',
      width: 40,
      height: 40,
      margin: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });
}