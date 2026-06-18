import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useResponsive } from 'src/common/hook/useResponsive';
export const useRestroStyle = () => {
    const { theme } = useAppTheme();
    const { responsiveStyle } = useResponsive();
    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        filterContainer:{
            flexDirection: responsiveStyle({
                tablet: 'column',
                desktop: 'row'
            }),
            columnGap: theme.spacing.md,
            backgroundColor: theme.colors.surfaceMedium,
            paddingVertical: theme.spacing.md,
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        searchFilterContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            flex: 1,
            minWidth: 400,
            width: '100%',
        },
        filterrow: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        searchbar: {
            borderRadius: theme.roundness.sm,
            borderWidth: 1,
            borderColor: theme.colors.borderBase,
            height: 40,
            minWidth: 250,
            width: '50%',
            backgroundColor: theme.colors.surfaceBase,
        },
        searchbarInput: {
            minHeight: 0,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.textBodyMedium,
            zIndex: 1,
            color:theme.colors.textBody,
        },
        restaurantContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        restaurantDetails: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginTop: theme.spacing.md,
        },
        restaurantTextContainer: {
            gap: 6,
        },
        ratingBox: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            backgroundColor: theme.colors.surfaceErrorBase,
            borderRadius: theme.roundness.xl,
            width: 45,
            height: 20,
        },
        ratingText: {
            marginLeft: -10,
        },
        actionButtons: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.roundness.sm,
        },
        breadcrumbContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            flexShrink: 1,
            gap: 4,
            paddingHorizontal: theme.spacing.md,

        },
        breadcrumb: {
            fontSize: theme.fontSize.S1Subtitle,
            color: theme.colors.textNeutral,
            fontFamily: theme.fontFamily.regular
        },
        bredcrumActive: {
            color: theme.colors.textHeading
        },
        scrollTop: {
            width: 50,
            height: 50,
            backgroundColor: theme.colors.surfaceInverse,
            borderRadius: 50,
            position: 'absolute',
            bottom: 14,
            right: 24,
            padding: theme.spacing.sm,
            justifyContent: 'center',
            alignItems: 'center',
        },
        userImage: {
            borderRadius: theme.roundness.sm,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.borderErrorBase,
            padding: theme.spacing.xs,
            maxWidth: 100,
        },
        userImageImg: {
            width: 100,
            height: 100,
        },
        userLicenceImage: {
            flexDirection: 'row',
            gap: theme.spacing.sm,
            maxWidth: 50
        },
        searchStatusDropdown: {
            justifyContent: 'flex-end'
        },
        flexDirectionRow: {
            flexDirection: 'row'
        },
        balance: {
            fontSize: theme.fontSize.textHeadingMedium,
            marginLeft: theme.spacing.xs,
            color: theme.colors.textSuccessDark,
            alignSelf: 'center'
        },
        dropDown: {
            height: 35,
            width: 185,
            backgroundColor: theme.colors.surfaceBase,
            alignItems: 'center'
        },
    });
}