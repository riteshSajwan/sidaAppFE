import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';


export const useUploadImageStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    dashedBorder: {
      borderWidth: 2,
      borderColor: theme.colors.borderInverse,
      borderStyle: 'dashed',
      height: 115,
      width: 115,
      borderRadius: theme.roundness.sm,
      justifyContent: 'center',
      alignItems: 'center',
      // mobile: {
      //   width: screenWidth / 3 - 30,
      //   height: screenWidth / 3 - 30,
      // },
    },

    dashedBorderpancard: {
      borderWidth: 2,
      borderColor: theme.colors.borderInverse,
      borderStyle: 'dashed',
      height: 111,
      width: '100%',
      borderRadius: theme.roundness.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textcolor: {
      color: theme.colors.textBody,
      textAlign: 'center',
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      paddingTop: theme.spacing.sm,
      // mobile: {
      //   fontSize: 13,
      // },
    },
    uploadImageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 12,
      rowGap: theme.spacing.md,
    },
    container: {
      position: 'relative',
      zIndex: 99
    },
    itemImageBox: {
      position: 'relative',
      borderRadius: theme.roundness.sm,
      backgroundColor: theme.colors.surfaceLow,
      width: 115,
      height: 115,
      // mobile: {
      //   width: screenWidth / 3 - 30,
      //   height: screenWidth / 3 - 30,
      // },
    },
    itemImage: {
      borderRadius: theme.roundness.sm,
      width: 100,
      height: 100,
      margin: 'auto',
      marginTop: theme.spacing.sm,

    },
    closeButton: {
      position: 'absolute',
      top: -11,
      right: -13,
      zIndex: 1,
      padding: 4,
      borderRadius: theme.roundness.lg,
      backgroundColor: theme.colors.surfaceErrorInverse
    },
    shadowbutton: {
      shadowColor: theme.colors.surfaceInverse,
      width: 25,
      height: 25,
      borderColor: theme.colors.borderBase,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceBase
    },
    uploaddirection: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    address: {
      position: 'absolute',
      right: 3,
    },
    pdfborder: {
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      borderRadius: theme.roundness.sm,
      padding: theme.spacing.xs,
    }
  });
}
