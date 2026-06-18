import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useOnBoardingStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    mt20: {
      marginTop: theme.spacing.lg,
    },
    inputAfexIcon: {
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textBodyMedium,
      marginLeft: theme.spacing.xs,
      lineHeight: theme.fontSize.textBodyMedium * 1.5,
      // backgroundColor: 'red',
    },
    inputAfex: {
      width: 60,
      borderRadius: 0,
      left: 5,
    },

    logoutBankView: {
      paddingBottom: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
    },

    btnTextPrimary: {
      alignItems: 'center',
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      textAlign: 'center',
      color: theme.colors.textBody,
      marginVertical: 0,
    },

    pageLoader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },

    my10: {
      marginVertical: theme.spacing.sm,
    },

    card: {
      backgroundColor: theme.colors.surfaceBase,
      marginBottom: theme.spacing.xxl,
    },

    alignItemsStart: {
      alignItems: 'flex-start',
    },

    countryModalView: {
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },

    countryText: {
      fontSize: theme.fontSize.textButtonSmall,
      marginTop: theme.spacing.md,
    },

    mb30: {
      marginBottom: theme.spacing.md * 2,
    },

    boxShadow: {
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 1, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: theme.roundness.md,
      elevation: 5,
    },

    itemImageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: theme.spacing.md,
    },

    labelText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textLabelSmall,
      color: theme.colors.textBody,
      lineHeight: theme.fontSize.textLabelSmall * 1.4,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },

    countryView: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: theme.roundness.sm,
      height: 55,
      borderColor: theme.colors.borderMedium,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.sm,
      columnGap: theme.spacing.sm,
    },

    errorBankView: {
      marginBottom: theme.spacing.md,
      marginTop: -theme.spacing.sm,
    },

    phoneNumberError: {
      paddingLeft: 110,
      marginTop: -theme.spacing.xl,
    },

    bankMainView: {
      marginBottom: 0,
      paddingBottom: 0,
    },

    reviewData: {
      textAlign: 'center',
      marginHorizontal: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
      fontSize: theme.fontSize.textBodyMedium,
    },

    btnGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      columnGap: 20,
    },
    noteText: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.regular,
      flexShrink: 1,
    },
    noteInnerText: {
      fontFamily: theme.fontFamily.semiBold,
      flexShrink: 1,
    },

    mb20: {
      marginBottom: theme.spacing.lg,
    },
  });
};
