import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useDrawerStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    drawerItem: {
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderRadius: theme.roundness.sm,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderStyle: 'solid',
      height: 45,
      borderColor: theme.colors.borderLow,
      marginVertical: theme.spacing.xs,
    },
    drawerItemLabel: {
      fontSize: theme.fontSize.textButtonLarge,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
      minWidth: 250,
    },

    iconContainer: {
      // marginRight: -theme.spacing.lg,
      alignItems: 'center',
    },
    avatarImage: {
      width: 95,
      height: 95,
      borderRadius: theme.roundness.xxl * 2,
    },
  });
};
