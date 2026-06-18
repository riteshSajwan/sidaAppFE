import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useManageStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    userImage: {
      borderRadius: theme.roundness.xxl * 3,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderMedium,
      padding: theme.spacing.xs,
      width: 90,
      height: 90,
    },
    userImageImg: {
      width: 80,
      height: 80,
      borderRadius: theme.roundness.xxl * 3,
    },
    dialogModal: {
      maxWidth: 580,
      width: '95%',
      marginHorizontal: 'auto',
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      marginTop: 0,
      gap: theme.spacing.md,
    },
    modalTitle: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    closeButton: {
      marginRight: theme.spacing.sm,
    },
    modalBody: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },

    infoOption: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: '100%',
      gap: 12,
      marginHorizontal: 'auto',
    },
    optionBtn: {
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderLow,
      borderRadius: 60,
      paddingVertical: 8,
      paddingHorizontal: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionLabel: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      textAlign: 'center',
    },
    optionLabelActive: {
      color: theme.colors.textErrorDark,
    },
    optionActive: {
      color: theme.colors.textErrorDark,
      borderColor: theme.colors.borderErrorInverse,
    }
  });

}
