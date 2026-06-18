import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
export const useSupportStyle = () => {
    const {theme} = useAppTheme();
    return StyleSheet.create({
        chatting_contianer_main: {
            flex: 1,
        },
        ownMessage: {
            backgroundColor: theme.colors.surfaceMedium,
            borderTopLeftRadius: theme.roundness.lg,
            borderBottomRightRadius: theme.roundness.lg,
            borderBottomLeftRadius: theme.roundness.lg,
            padding: theme.spacing.md,
            margin: theme.spacing.xs,
            flexShrink: 1
        },
        otherMessage: {
            backgroundColor: theme.colors.surfaceLow,
            borderBottomLeftRadius: theme.roundness.lg,
            borderTopRightRadius: theme.roundness.lg,
            borderBottomRightRadius: theme.roundness.lg,
            borderWidth: 1,
            borderColor: theme.colors.borderMedium,
            padding: theme.spacing.md,
            margin: theme.spacing.xs,
            flexShrink: 1
        },
        message_item: {
            width: '80%',
            marginBottom: theme.spacing.sm,
        },
        adjust_action_cell: {
            maxWidth: 100
        },
        adminBadge: {
            borderRadius: theme.roundness.sm,
            backgroundColor: theme.colors.surfaceInverse,
            padding: 8,
        },
        chatWindow: {
            borderWidth: 1,
            borderColor: theme.colors.borderMedium,
            borderRadius: theme.roundness.sm,
            flex: 1,
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm
        },
        timeStamp: {
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.textBody,
        },
        otherMessageView: {
            alignSelf: 'flex-start'
        },
        ownMessageView: {
            alignSelf: 'flex-end'
        },
        chatConatiner: {
            marginVertical: theme.spacing.xs,
            padding: theme.spacing.xs,
            borderRadius: theme.roundness.md,
            maxWidth: '80%',
        },
        chatViewConatiner: {
            flex: 1,
        },
        dateText: {
            textAlign: 'center',
            backgroundColor: theme.colors.surfaceLow,
            borderRadius: theme.roundness.sm,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.md,
        },
        outerContainer: {
            flex: 1,
            flexDirection: 'row',
            gap: 7,
            paddingBottom: theme.spacing.sm,
            position: 'relative'
        },
        loaderContainer: {
            position: 'absolute',
            top: 0,
            bottom: 60,
            right: 0,
            zIndex: 999,
            left: 170,
        },
        errorView: {
            marginVertical: theme.spacing.sm,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        errorText: {
            fontSize: theme.fontSize.textHeadingLarge,
            color: theme.colors.textErrorDark
        },
        messagesContainer: {
            flex: 1,
        },
        messaagesOuterContainer: {
            flex: 1,
            backgroundColor: theme.colors.surfaceBase,
        },
        alignTextCenter: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.sm,
            borderTopWidth: 1,
            borderColor: theme.colors.borderMedium,
        },
        sidebar: {
            width: 350,
            backgroundColor: theme.colors.surfaceLow,
            borderRightWidth: 1,
            borderColor: theme.colors.borderLow,
        },
        userItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderBottomWidth: 1,
            borderColor: theme.colors.borderLow,
        },
        activeUserItem: {
            backgroundColor: theme.colors.surfaceBase,
            borderLeftWidth: theme.roundness.xs,
            borderLeftColor: theme.colors.borderInverse,
        },
        avatar: {
            width: 36,
            height: 36,
            borderRadius: 0,
            marginRight: theme.roundness.sm,
        },
        username: {
            fontSize: theme.fontSize.textBodyMedium,
            color: theme.colors.textBody,
        },
        userMessage: {
            fontSize: theme.fontSize.textBodyMedium,
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.textBodyLight,
        },
        userDateTime: {
            paddingLeft: theme.spacing.xs,
            fontSize: theme.fontSize.textCaptionS,
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.textBodyLight,
        },
        activeUsername: {
            fontFamily: theme.fontFamily.bold,
            color: theme.colors.textHeading,
        },
        initialWords: {
            color: theme.colors.textInverse,
            fontSize: theme.fontSize.S1Subtitle,
            alignSelf: 'center'
        },
        borderColorWidth: {
            borderRadius: theme.roundness.sm,
            borderWidth: 1,
            borderColor: theme.colors.borderLow
        },
        firstContainer: {
            alignItems: 'center',
            gap: 6,
            justifyContent: 'space-between'
        },
        secondContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: theme.spacing.xs
        },
        flexRow: {
            flexDirection: 'row'
        },
        flexCol: {
            flexDirection: 'column'
        },
        nameContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
        },
        tripChatHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderMedium,
            gap: theme.spacing.md,
        },
        tripChatUserSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
        }

    });
}