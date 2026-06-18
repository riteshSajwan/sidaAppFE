import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useTimingStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      alignItems: 'center',
    },
    label: {
      marginBottom: 8,
      fontSize: theme.fontSize.S2Subtitle,
      color: theme.colors.textBody,
    },
    picker: {
      height: 50,
      width: 150,
    },
    labelclock: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      marginBottom: 8,
      fontFamily: theme.fontFamily.regular
    },
    timePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surfaceBase,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.roundness.sm,
      height: 48,
    },
    timeText: {
      fontSize: theme.fontSize.S2Subtitle,
      color: theme.colors.textBody,
      flex: 1,
    },

    icon: {
      margin: 0,
      padding: 0,
      width: 25,
      height: 25,
    },
    boxBorder: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: theme.roundness.xs,
      borderColor: theme.colors.borderMedium,
    }

  })
}