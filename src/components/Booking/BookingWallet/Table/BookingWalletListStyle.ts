import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useWalletStyle = () => {
    const { theme } = useAppTheme();
    return StyleSheet.create({
        refundedAmountText: {
            width: 120,
            color: theme.colors.textSuccessDark,
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.bold,
        },
        dateText: {
            color: theme.colors.textBody,
            fontFamily: theme.fontFamily.regular,
            fontSize: 16,
        },
        debitedAmountText: {
            // width: 120,
            color: theme.colors.textErrorDark,
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.bold
        },
        refundedStatus: {
            width: 80,
            color: theme.colors.textSuccessDark,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.textSuccessDark,
            fontWeight: '700',
            padding: theme.spacing.xs,
            borderRadius: theme.roundness.xs,
            textAlign: 'center',
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.textBodyMedium,
        },
        debitedStatus: {
            width: 80,
            borderWidth: 1,
            borderStyle: 'solid',
            color: theme.colors.textErrorDark,
            borderColor: theme.colors.textErrorDark,
            padding: theme.spacing.xs,
            borderRadius: theme.roundness.xs,
            textAlign: 'center',
            fontFamily: theme.fontFamily.bold
        },
    });
}