import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useProfilePreview = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    userImage: {
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderMedium,
      padding: theme.spacing.xs,
      maxWidth: 100,
    },
    userImageImg: {
      width: 90,
      height: 90,
      resizeMode: 'contain'
    },
    optionGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      gap: 12,
      marginHorizontal: 'auto',
    },
    optionLableBtn: {
      fontSize: theme.fontSize.textButtonLarge,
      lineHeight: theme.fontSize.textButtonLarge * 1.2,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textHeading,
      backgroundColor: theme.colors.surfaceLow,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderLow,
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      textAlign: 'center',
      height: 40,
    },
    optionBtn: {
      fontSize: theme.fontSize.textButtonLarge,
      lineHeight: theme.fontSize.textButtonLarge * 1.2,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      backgroundColor: theme.colors.surfaceWarningBase,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderLow,
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      textAlign: 'center',
      height: 40,
    },
    optionActive: {
      borderColor: theme.colors.borderErrorInverse,
    },
  });
}
