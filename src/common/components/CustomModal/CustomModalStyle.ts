import { Dimensions, StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const useModalStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    dialogContainer: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.sm,
      marginHorizontal: 'auto',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      marginTop: 0,
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
      paddingTop: 1,
      paddingBottom: 0
    },
    modalFooter: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
  });
}