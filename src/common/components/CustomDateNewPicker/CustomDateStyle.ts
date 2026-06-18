import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useDateStyle = () => {
    const {theme} = useAppTheme();
    return StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            paddingVertical: 2,
            paddingHorizontal: 5,
            justifyContent: 'space-between',
            borderColor: theme.colors.borderMedium,
            backgroundColor: theme.colors.surfaceBase,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.textBodyMedium,
            color: theme.colors.textBody,
            lineHeight: theme.fontSize.textBodyMedium * 1.2,
            borderRadius: theme.roundness.xs,
            height: 50,
        },
        inputText: {
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.regular,
            marginLeft: theme.spacing.sm,
        },
        iconOnlyTrigger: {
            width: 34,
            height: 34,
            borderRadius: theme.roundness.xxl,
            borderWidth: 1,
            borderColor: theme.colors.borderMedium,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceBase,
        },
        modalBackground: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContainer: {
            backgroundColor: theme.colors.surfaceBase,
            padding: theme.spacing.lg,
            borderRadius: theme.roundness.sm,
            width: 720,
            maxWidth: '100%',
            margin: 'auto'
        },
        cancelButton: {
            marginTop: theme.spacing.lg,
        },
        cancelText: {
            color: theme.colors.textErrorDark,
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.regular,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
        },
        clearButton: {
            marginTop: theme.spacing.lg,
            marginRight: theme.spacing.lg,
        },
        yearSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.borderLow,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.roundness.xs,
            width: '100%',
            marginBottom: theme.spacing.sm,
        },
        yearText: {
            fontSize: theme.fontSize.textBodyMedium,
            color: theme.colors.textErrorDark,
            fontFamily: theme.fontFamily.medium

        },
        yearList: {
            maxHeight: 330,
            width: '100%',
            borderRadius: theme.roundness.xs,
            marginBottom: theme.spacing.sm,
        },
        contextContainer: {
            borderWidth: 1,
            borderColor: theme.colors.borderLow,
            backgroundColor: theme.colors.surfaceBase,
            borderRadius: theme.roundness.xs,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
            gap: theme.spacing.xs,
        },
        contextTitle: {
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.medium,
            color: theme.colors.textBody,
        },
        contextSubtitle: {
            fontSize: theme.fontSize.textBodySmall,
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.textNeutral,
        },
        yearItem: {
            padding: theme.spacing.sm,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderMedium,
        },
        yearItemText: {
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.regular,
            color:theme.colors.textBody
        },
        selectedYear: {
            backgroundColor: theme.colors.surfaceErrorInverse,
            borderRadius: theme.roundness.xs,
            color: theme.colors.textInverse
        }
    });
}
