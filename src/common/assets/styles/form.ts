import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';


export const useFormStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    formBoxLayout: {},
    formRow: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      position: 'relative',
      flexWrap: 'wrap',
      zIndex: 1,
    },
    formCol: {
      flex: 1,
      minWidth: 200
    },
    formField: {
      flexDirection: 'row',
      gap: 24,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
    },
    inputPlaceholderLabel: {
      color: theme.colors.textNeutral,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textBodyMedium,
      borderRadius: theme.roundness.xs
    },
    textInputLabel: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textHeading,
      lineHeight: theme.fontSize.textBodyMedium * 1.4,
      textAlignVertical: 'center',
      borderRadius: theme.roundness.sm,
      minWidth: 20,
      padding: 0,
    },
    inputFieldOuline: {
      borderRadius: theme.roundness.sm,
    },
    formCol50: {
      flex: 0.4,
      // mobile: {
      //   flex: 1,
      // },
    },
    formCol20: {
      flex: 0.1,
    },
    inputDisabled: {
      borderWidth: 0,
      backgroundColor: theme.colors.surfaceDisabled,
      borderColor: theme.colors.borderDisabled,
    },
    labelHeadTitle: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSize.S1Subtitle,
      color: theme.colors.textBody,
      lineHeight: theme.fontSize.S1Subtitle * 1.4,
      marginBottom: theme.spacing.sm,
    },
    labelTitle: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textHeading,
      letterSpacing: 0.32,
      lineHeight: theme.fontSize.S2Subtitle * 1.2,
      marginBottom: theme.spacing.sm,
      textTransform: 'capitalize',
    },
    adminSubTitle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.S2Subtitle,
      color: theme.colors.textBody,
      paddingTop: theme.spacing.sm,
      paddingBottom: 13
    },
    inputfieldicon: {
      paddingRight: 50,
    },
    inputField: {
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.sm,
      padding: 0,
      height: 50,
      minWidth: 20,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      borderWidth: 0,
    },
    inputLabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      padding: 0,
    },
    textFieldArea: {
      padding: 0,
      height: 100,
    },
    errorMessage: {
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textErrorDark,
      fontSize: theme.fontSize.textBodyMedium,
      lineHeight: theme.fontSize.textBodyMedium * 1.4,
      marginTop: theme.spacing.xs,
    },
    // errorGap: {
    //   height: 17,
    //   marginTop: 2,
    // },
    noMargin: {
      marginBottom: theme.spacing.xs,
    },
    formHeader: {
      marginBottom: theme.spacing.xxl,
    },
    skipText: {
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
      fontSize: theme.fontSize.S2Subtitle
    },
    formStep: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    stepItem: {
      flex: 1,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      height: 12,
      borderRadius: theme.roundness.xs,
      padding: theme.spacing.xs / 2,
    },
    stepBtn: {
      flex: 1,
      height: '100%',
      width: '100%',
      borderRadius: theme.roundness.xs,
      backgroundColor: 'transparent',
    },
    stepBtnCompleted: {
      backgroundColor: theme.colors.surfaceInverse,
      borderColor: theme.colors.textBody,
    },
    stepBtnActive: {
      backgroundColor: theme.colors.surfaceInverse,
      borderColor: theme.colors.textBody,
      width: '30%',
    },
    errorBorderColor: {
      borderColor: theme.colors.borderErrorInverse,
      borderRadius: theme.roundness.xs,
    },
    ConfigsubTitle: {
      fontSize: theme.fontSize.S2Subtitle,
      fontFamily: theme.fontFamily.medium,
      paddingTop: theme.spacing.md,
      color: theme.colors.textBody,
    },
    checkBoxItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minWidth: '25%',
    },
    mb0: {
      marginBottom: 0,
    },
    checkBoxlabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
    },
    noRetroLabel: {
      margin: 'auto',
      paddingVertical: 155
    },
    formInput: {
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
    },
    width48: {
      width: '48%',
      // mobile: {
      //   width: '100%',
      // },
    },
    width50: {
      width: '50%',
      // mobile: {
      //   width: '100%',
      // },
    },
    checkWrap: {
      maxWidth: '100%',
      height: 50,
    },
    w200: {
      width: 200,
    },
    justifySpace: {
      justifyContent: 'space-between',
    },
    asteriskTxt: {
      color: theme.colors.textErrorDark,
    },
    // bold: { theme.fontFamily.bold },
    bannerNoData: {
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.xs
    },
    flagPickerCustom: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 55,
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: theme.roundness.xs,
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
      paddingStart: theme.spacing.xs,
    },
    inputFieldAfix: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      lineHeight: theme.fontSize.textBodyMedium * 1.4,
      borderRadius: theme.roundness.sm,
      paddingTop: 12,
      paddingBottom: theme.spacing.sm,
      paddingHorizontal: 0,
      paddingVertical: 0,
      height: 23,
      backgroundColor: theme.colors.surfaceBase,
      width: 75,
      position: 'absolute',
      left: 2,
      top: 3,
      zIndex: 1,
    },
    countryFlagList: {
      position: 'absolute',
      top: 90,
      zIndex: 9999,
      backgroundColor: theme.colors.surfaceBase,
      width: 250,
      maxHeight: 200,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.sm,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    countryFlagContainer: {
      position: 'absolute',
      top: -1000,
      left: -1000,
      right: -1000,
      bottom: -1000,
      zIndex: 9998,
      backgroundColor: 'transparent',
    },
    flag: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.xs,
      marginRight: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minWidth: 60,
      justifyContent: 'center',
    },
    formBtnRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'center',
    },
    checkBox:{
      width: 22,
      height: 22,
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: theme.colors.surfaceBase,
      borderColor: theme.colors.borderInverse,
      borderRadius: theme.roundness.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkBoxChecked:{
      backgroundColor: theme.colors.surfaceInverse,
    },
  });
}
