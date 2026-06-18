import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useResponsive } from 'src/common/hook/useResponsive';

export const useDashboardStyle = () => {
    const { theme } = useAppTheme();
    const { responsiveStyle } = useResponsive();
    return StyleSheet.create({
        container: {
            width: '100%',
            marginHorizontal: 'auto',
            paddingHorizontal: theme.spacing.md,
            flex: 1,
        },
        cardDashImgFlex: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,

        },
        CardHeightBox: {
            maxHeight: 150,
        },
        cardBoxLayout: {
            minWidth: 255,
            minHeight: 161,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        dashboardCardFlex: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            flexWrap: 'wrap',
        },
        dashBtn: {
            justifyContent: 'center',
            margin: 'auto',
            maxWidth: '100%',
            marginTop: 7
        },
        pickedUpColor: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderSuccessInverse,
            color: theme.colors.textSuccessDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },
        rejected: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderErrorInverse,
            color: theme.colors.textErrorDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },
        out_for_delivery: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderLinkInverse,
            color: theme.colors.textLinkDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },

        scheduled: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderSuccessInverse,
            color: theme.colors.textSuccessDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },

        preparation: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderErrorInverse,
            color: theme.colors.textErrorDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },

        delivered: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderSuccessInverse,
            color: theme.colors.textSuccessDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },

        cancelled: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderErrorInverse,
            color: theme.colors.textErrorDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },

        confirmed: {
            backgroundColor: theme.colors.surfaceLow,
            color: theme.colors.textHeading,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },
        ready_for_pickup: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderSuccessInverse,
            color: theme.colors.textSuccessDark,
            borderRadius: theme.roundness.xs,
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            textAlign: 'center',
            fontSize: theme.fontSize.textCaptionS,
        },
        heading2x: {
            fontSize: theme.fontSize.textHeadingLarge * 2,
        },
        flexbasic46: {
            flexBasis: '46%'
        },
        flexRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        flexRowCenter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        imageGraph: {
            width: '100%',
            aspectRatio: 16 / 9
        },
        lineHeight14: {
            lineHeight: 14
        },
        TextCard: {
            color: theme.colors.themeText,
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.textHeadingMedium
        },
        TextCardSubTitle: {
            fontSize: theme.fontSize.S2Subtitle,
            fontFamily: theme.fontFamily.semiBold,
            color: theme.colors.textNeutral,
            lineHeight: theme.fontSize.S2Subtitle * 1.3,
        },
        TextcardHeader: {
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.semiBold,
            color: theme.colors.textBody,
        },
        popupIcon: {
            position: 'absolute',
            top: 0,
            right: -4,
            zIndex: 1,
        },
        statusIcon: {
            padding: 0,
            margin: 0,
            width: 24,
            height: 24,
        },
        BottomDashboardText: {
            textAlign: 'center',
            marginTop: theme.spacing.sm,
            color: theme.colors.textBodyLight,
            fontFamily: theme.fontFamily.regular,
        },
        TextAlignCenter: {
            textAlign: 'center'
        },
        onGoingOrderList: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surfaceSuccessBase,
            padding: theme.spacing.sm,
            borderRadius: theme.roundness.md,
        },
        OnGoingOrderSublist: {
            backgroundColor: theme.colors.surfaceSuccessInverse,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: 7,
            borderRadius: theme.roundness.xs,
            width: 41,
            height: 41,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        OngoingBoxOuter: {
            borderWidth: 1,
            borderColor: theme.colors.borderLow,
            borderRadius: theme.roundness.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
        },
        OngoingMiniBoxes: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.lg,
            flexWrap: 'wrap',
            marginBottom: theme.spacing.sm
        },
        DashboardLeftRightLayout: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.lg,
        },
        RevenueBox: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            flexWrap: 'wrap',

        },
        mb12: {
            // tablet: {
            //     marginBottom: 12,
            // }
        },
        ongoingListItem: {
            fontFamily: theme.fontFamily.semiBold,
            color: theme.colors.textBodyLight
        },
        line: {
            backgroundColor: theme.colors.borderMedium,
            height: 1,
            flex: 1,
            opacity: .2

        },
        texttopperformer: {
            color: theme.colors.textBody,
            fontFamily: theme.fontFamily.semiBold,
            opacity: .3,
        },
        deliveryStyle: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            flexWrap: 'wrap'
        },
        segmentedButton: {
            marginRight: theme.spacing.xxl,
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.medium,
            color: theme.colors.textNeutral,
            paddingBottom: theme.spacing.sm,
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
            alignSelf: 'flex-start',
        },
        activeTab: {
            color: theme.colors.textHeading,
            borderBottomColor: theme.colors.borderInverse,
            borderBottomWidth: 2,
        },
        tabFlexRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        pending: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderWarningInverse,
            color: theme.colors.textWarningDark,
            borderRadius: theme.roundness.xs,
            textAlign: 'center',
            padding: theme.spacing.xs,
            fontFamily: theme.fontFamily.semiBold,
            fontSize: theme.fontSize.textCaptionS,
        },
        ratingWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surfaceBase,
            borderRadius: theme.roundness.lg,
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs / 2,
        },
        ratingTxt: {
            fontSize: theme.fontSize.textCaptionS,
            color: theme.colors.textBody,
            fontFamily: theme.fontFamily.regular,
            marginLeft: 2,
        },
        orderTxt: {
            color: theme.colors.textInverse,
            fontSize: theme.fontSize.textHeadingMedium,
            fontFamily: theme.fontFamily.bold,
        },
        orderInfo: {
            fontSize: theme.fontSize.S1Subtitle,
            fontFamily: theme.fontFamily.regular,
            color: theme.colors.textBody,
            marginLeft: theme.spacing.md,
        },
        justifyCenter: {
            justifyContent: 'center',
        },
        OuterWrap: {
            width: responsiveStyle({
                tablet: '100%',
                desktop: 'auto'
            }),
        },
        flexbasis100: {
            // tablet: {
            //     flexBasis: '100%',
            //     marginBottom: 12,
            // }
        },
        viewAllStatus: {
            fontFamily: theme.fontFamily.semiBold,
            alignSelf: 'flex-end',
            paddingTop: theme.spacing.sm,
            color: theme.colors.textBody,
            textDecorationLine: 'underline'
        },
        statusPadding: {
            padding: theme.spacing.xs,
            width: 130,
            fontSize: theme.fontSize.textBodyMedium
        },
        redirectOrder:{
            fontFamily: theme.fontFamily.medium,
            alignSelf: 'flex-end',
            paddingTop: 9,
            color: theme.colors.textBody,
            textDecorationLine: 'underline'
        },
        btnCircle: {
            width: 60,
            height: 60,
            borderRadius: theme.roundness.xl * 2,
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: theme.colors.borderMedium,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
}
