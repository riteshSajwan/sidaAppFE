import { StyleSheet, Dimensions } from 'react-native'
import { useAppTheme } from 'src/common/context/AppTheme';
export const useSegmentStyle = () => {
  const {theme} = useAppTheme();
  return StyleSheet.create({
    btnContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.xxl,
    },
    button: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.colors.borderMedium,
      minHeight: 40,
    },
    label: {
      textAlign: 'center',
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.regular,
      flexShrink: 1,
    },
  });
}