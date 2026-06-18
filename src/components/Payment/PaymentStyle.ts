import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const usePaymentStyle = () => {
    const { theme } = useAppTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            margin: 'auto',
            marginHorizontal: 'auto',
            paddingTop: theme.spacing.md,
        },
        mainbgImg: {
            width: '100%',
            height: '100%',
        },
        userImg: {
            maxWidth: 330,
            width: '100%',
            height: '100%',
            maxHeight: 330,
            marginVertical: theme.spacing.lg,
        },
        containerWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: theme.spacing.lg,
        },
        paraText: {
            fontSize: theme.fontSize.textBodyMedium,
            color: theme.colors.textBody,
            fontFamily: theme.fontFamily.regular,
            lineHeight: theme.fontSize.textBodyMedium * 1.4,
            marginBottom: theme.spacing.sm,
        },
        button: {
            backgroundColor: theme.colors.surfaceErrorInverse,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: 70,
            borderRadius: theme.roundness.xl,
            elevation: 2,
            shadowColor: theme.colors.surfaceInverse,
            shadowOpacity: 0.15,
            shadowOffset: { width: 1, height: 2 },
            shadowRadius: theme.roundness.xs,
        },
        buttonText: {
            color: theme.colors.textInverse,
            fontSize: theme.fontSize.textButtonLarge,
            fontFamily: theme.fontFamily.semiBold,
        },
        userTitle: {
            fontSize: theme.fontSize.S1Subtitle,
            color: theme.colors.textBody,
            fontFamily: theme.fontFamily.bold,
            lineHeight: theme.fontSize.S1Subtitle * 1.3,
            marginBottom: theme.spacing.xs,
        }
    });

}