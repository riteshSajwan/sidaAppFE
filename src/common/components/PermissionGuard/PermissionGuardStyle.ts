import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const usePermissionGuardStyle = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceBase,
      padding: theme.spacing.xl,
    },
    contentWrapper: {
      alignItems: 'center',
      maxWidth: 400,
    },
    errorCode: {
      fontSize: theme.fontSize.textHeadingMedium * 3,
    },
  });
};
