import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useTipStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    btnOuter: {
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 50,
      marginRight: theme.spacing.sm,
      minWidth: 70,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    selectedBtn: {
      borderColor: theme.colors.borderErrorInverse,
    },
    btnTxt: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.regular,
      textAlign: 'center'
    },
    selectedText: {
      color: theme.colors.textErrorDark,
    },
    btnOuterWrap: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
      alignItems: 'center',
      flexWrap: 'wrap'
    },
  });
}