import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useCarouselStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: -theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    dot: {
      width: 12,
      height: 10,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceBase,
      marginHorizontal: theme.spacing.xs,
    },
    activeDot: {
      backgroundColor: theme.colors.surfaceSuccessInverse,
      width: 30,
    },
  });

}
