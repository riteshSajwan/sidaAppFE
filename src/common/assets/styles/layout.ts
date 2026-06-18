import { Dimensions, StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
const screenHeight = Dimensions.get('window').height;

export const useLayoutStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: theme.colors.surfaceLow,
    },
    pageBg: {
      backgroundColor: theme.colors.surfaceLow,
    },
    body: {
      fontFamily: theme.fontFamily.regular,
    },
    mainContainer: {
      flexDirection: 'row',
      flex: 1,
      position: 'relative',
      backgroundColor: theme.colors.surfaceLow,
      padding: theme.spacing.xl,
    },
    container: {
      maxWidth: '100%',
    },
    leftCol: {
      width: 300,
      backgroundColor: theme.colors.surfaceBase,
      height: '100%',
      paddingVertical: theme.spacing.lg * 3,
    },
    rightCol: {
      flex: 1,
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },
    cardBox: {
      backgroundColor: theme.colors.surfaceBase,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      position: 'relative',
      shadowOpacity: 0.5,
      shadowRadius: 2.22,
      elevation: 3,
      overflow: 'hidden',
    },
    cardRoundNess: {
      borderRadius: theme.roundness.md,
    },
    tableContainer: {
      borderWidth: 1,
      paddingHorizontal: theme.spacing.md,
      borderColor: theme.colors.borderDisabled,
      paddingBottom: 0,
    },
    cardHeader: {
      paddingTop: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
      paddingRight: theme.spacing.md,
      paddingLeft: 0,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.bold,
      backgroundColor: theme.colors.surfaceBase,
      fontSize: theme.fontSize.S1Subtitle,
      lineHeight: theme.fontSize.S1Subtitle * 1.4,
      marginTop: 0,
      marginBottom: 0,
    },
    cardBorder: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
    },
    flexDirectionColumn: {
      flexDirection: 'column',
    },
    alignCenter: {
      alignItems: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    cardBody: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    h1Title: {
      fontSize: theme.fontSize.textHeadingMedium,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.semiBold,
      lineHeight: theme.fontSize.textHeadingMedium * 1.4,
      marginBottom: theme.spacing.md,
    },
    mainTitle: {
      fontSize: theme.fontSize.textHeadingMedium,
      marginBottom: 0,
    },
    Adminh1Title: {
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
      fontSize: theme.fontSize.textHeadingMedium,
      lineHeight: theme.fontSize.textHeadingMedium * 1.4,
    },
    paraText: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.regular,
      lineHeight: theme.fontSize.textBodyMedium * 1.5,
      marginBottom: theme.spacing.sm,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    accordionListItem: {
      maxHeight: screenHeight - 200,
    },
    accordionTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    accordionLogo: {
      width: 40,
      height: 40,
      borderRadius: theme.roundness.xl * 2,
      borderStyle: 'solid',
      borderWidth: 4,
      borderColor: theme.colors.borderSuccessBase,
    },
    accordionTitle: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      padding: 0,
    },
    fs20: {
      fontSize: theme.fontSize.S1Subtitle,
    },
    accordionTitleHeader: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.textHeadingMedium,
      fontFamily: theme.fontFamily.semiBold,
      padding: 0,
    },
    CountrySeviceFont: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
    },
    accordionSubTitle: {
      color: theme.colors.textBodyLight,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
    },
    flexDirectionRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    mb0: {
      marginBottom: 0,
    },
    flexCol: {
      flex: 1,
    },
    flexColItem: {
      flexDirection: 'column',
      rowGap: 12,
    },
    flexmarginottom: {
      flexDirection: 'column',
      gap: 12,
      marginBottom: 12,
    },
    alignRight: {
      justifyContent: 'flex-end',
    },
    alignItemCenter: {
      alignItems: 'center',
    },
    seperator: {
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.borderMedium,
    },
    DividerSperator: {
      backgroundColor: theme.colors.borderDisabled,
      marginBottom: 8,
      marginTop: theme.spacing.md,
    },
    listItemRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    listTitle: {
      color: theme.colors.textBody,
      fontSize: theme.fontSize.S2Subtitle,
      fontFamily: theme.fontFamily.medium,
    },
    listDesc: {
      color: theme.colors.textBodyLight,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      textAlign: 'right',
    },
    linkBadge: {
      backgroundColor: theme.colors.surfaceLinkBase,
      borderColor: theme.colors.borderLinkBase,
      borderWidth: 1,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    sideBarDrawer: {
      width: 300,
      backgroundColor: theme.colors.surfaceBase,
      position: 'absolute',
      zIndex: 100,
      minHeight: screenHeight,
      top: 0,
      left: 0,
      paddingVertical: 60,
    },
    sideBarLogo: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderDisabled,
      paddingHorizontal: theme.spacing.sm,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.lg,
      paddingLeft: theme.spacing.lg,
      marginBottom: theme.spacing.xxl * 2,
      gap: theme.spacing.md,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    adminrow: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    addStaffAlign: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    sideBarLogoImg: {
      maxWidth: 135,
      height: 35,
    },
    crossIcon: {
      margin: 0,
    },
    sideBarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftNavItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.roundness.xs,
    },
    navItemAnchor: {
      fontSize: theme.fontSize.textBodyLarge,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
    },
    closeIcon: {
      color: theme.colors.iconBase,
    },
    marBottom30: {
      marginBottom: theme.spacing.md * 2,
    },
    marBottom20: {
      marginBottom: theme.spacing.lg,
    },
    marRight: {
      marginRight: theme.spacing.lg,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
    },
    searchBar: {
      color: theme.colors.textBody,
      borderRadius: theme.roundness.sm,
      elevation: 0,
      backgroundColor: theme.colors.surfaceBase,
      height: 48,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
    },
    inputStyle: {
      fontSize: theme.fontSize.textBodyMedium,
      lineHeight: 0.16,
      fontFamily: theme.fontFamily.regular,
      height: 48,
      minHeight: 48,
    },
    paddinghor17: {
      paddingHorizontal: 17,
    },
    containerPadding: {
      paddingHorizontal: 17,
    },
    paddingTop26: {
      paddingTop: 26,
    },
    addmanagertext: {
      color: theme.colors.textErrorDark,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    mt10: {
      marginTop: theme.spacing.sm,
    },
    // dropdown
    dropdown: {
      borderColor: theme.colors.borderMedium,
      borderWidth: 1,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceBase,
      height: 50,
    },
    dropdownHeight: {
      height: 55,
    },
    disabledDropdown: {
      backgroundColor: theme.colors.surfaceDisabled,
    },
    placeholderStyle: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
    },
    selectedTextStyle: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
      fontFamily: theme.fontFamily.regular,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      paddingHorizontal: theme.spacing.sm,
    },
    dropDownItem: {
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceBase,
      borderColor: theme.colors.borderDisabled,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    scene: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.colors.textBody,
      fontSize: theme.fontSize.S1Subtitle,
    },
    addBtn: {
      position: 'relative',
      bottom: -50,
      // mobile: {
      //   bottom: -35,
      // },
    },
    //loader css
    loader: {
      position: 'absolute',
      minHeight: screenHeight - 100,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    loaderframe: {
      height: screenHeight - 200,
    },
    borderbottomtiming: {
      height: 2,
      width: '100%',
      backgroundColor: theme.colors.surfaceLow,
      marginTop: 0,
    },
    cardheight: {
      height: screenHeight - 100,
    },
    cardAddBox: {
      maxWidth: 550,
      width: '100%',
      marginHorizontal: 'auto',
    },
    btnend: {
      marginBottom: 12,
    },
    borderRadius0: {
      borderRadius: 0,
    },
    customStyleField: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    optionGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      gap: 12,
      marginHorizontal: 'auto',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    optionLableBtn: {
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderLow,
      borderRadius: 60,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      textAlign: 'center',
      height: 35,
    },
    optionBtn: {
      fontSize: theme.fontSize.textButtonLarge,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      backgroundColor: theme.colors.surfaceLow,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderLow,
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      textAlign: 'center',
      height: 40,
    },
    optionActive: {
      borderColor: theme.colors.borderInverse,
    },
    RestroBtnBottom: {
      position: 'absolute',
      bottom: 70,
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100%',
      paddingHorizontal: theme.spacing.sm,
    },
    RestroList: {
      paddingVertical: theme.spacing.xs,
      height: 89,
    },
    serviceTopHeader: {
      fontSize: theme.fontSize.textHeadingMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    flexmarginBottom: {
      marginVertical: theme.spacing.sm,
    },
    opacity_light_grey: {
      opacity: 0.7,
    },
    sectionSpace: {
      paddingRight: theme.spacing.xl,
      // tablet: {
      //   paddingRight: 17
      // }
    },
    btnRgt: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 24,
    },
    btnCenter: {
      width: 234,
      justifyContent: 'center',
      marginHorizontal: 'auto',
    },
    listWrapper: {
      height: screenHeight - 200,
    },
    mb10: {
      marginBottom: theme.spacing.sm,
    },
    dialogFooter: {
      padding: theme.spacing.md,
      paddingTop: 0,
      gap: 8,
    },
    txtUpperCase: {
      textTransform: 'uppercase',
    },
    pb0: {
      paddingBottom: 0,
    },
    modalView: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalClose: {
      position: 'absolute',
      top: -8,
      right: -9,
      backgroundColor: theme.colors.iconErrorDark,
      width: 28,
      height: 28,
      borderRadius: theme.roundness.xl,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    modalText: {
      color: theme.colors.textInverse,
      fontSize: theme.fontSize.S2Subtitle,
      top: 2,
      justifyContent: 'center',
      right: 6,
      position: 'absolute',
    },
    imageContainer: {
      position: 'relative',
    },

    modalImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    imageInsideContainer: {
      width: 500,
      height: 500,
      margin: 'auto',
      backgroundColor: theme.colors.surfaceLow,
    },
    notificationlist: {
      marginRight: theme.spacing.sm,
      alignItems: 'center',
      padding: 12,
      borderRadius: theme.roundness.md,
    },
    addressList: {
      position: 'absolute',
      top: 52,
      left: 0,
      right: 0,
      zIndex: 999,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.xs,
      maxHeight: 140,
      paddingVertical: theme.spacing.xs,
      elevation: 5,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: theme.roundness.xs,
      paddingBottom: theme.spacing.lg,
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    ticketPadding: {
      borderWidth: 1,
      paddingHorizontal: theme.spacing.xxl,
      borderColor: theme.colors.borderMedium,
      paddingBottom: 0,
    },
    loaderonboard: {
      backgroundColor: theme.colors.surfaceErrorInverse,
      position: 'absolute',
      top: 23,
      zIndex: 99,
      left: 0,
      right: 0,
    },
    restaurantborder: {
      borderWidth: 1,
      paddingHorizontal: theme.spacing.xxl,
      borderColor: theme.colors.borderDisabled,
      paddingBottom: 0,
    },
    restroflex: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    removebtndimension: {
      width: 'auto',
      marginLeft: 'auto',
    },
    imagenotification: {
      height: 48,
      width: 48,
      borderRadius: theme.roundness.xl * 2,
      borderWidth: 3,
      borderColor: theme.colors.borderInverse,
      alignItems: 'center',
      justifyContent: 'center',
    },
    renderMultiSelect: {
      padding: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceBase,
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    justifyBetween: {
      justifyContent: 'space-between',
    },
    justifyEnd: {
      justifyContent: 'flex-end',
    },
    cardTabSize: {
      minWidth: 500,
    },
    flexShrink: {
      flexShrink: 1,
    },
    flexNoWrap: {
      flexWrap: 'nowrap',
    },
    statusMessage: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.borderSuccessInverse,
      color: theme.colors.textSuccessDark,
      borderRadius: theme.roundness.xl,
    },
    cancelStatus: {
      borderColor: theme.colors.borderErrorInverse,
      color: theme.colors.textErrorDark,
    },
    mapSearch: {
      flexDirection: 'row',
      position: 'absolute',
      left: 15,
      right: 15,
      columnGap: 15,
      backgroundColor: theme.colors.surfaceMedium,
      padding: theme.spacing.md,
      top: 20,
      alignItems: 'center',
      marginHorizontal: theme.spacing.xxl,
    },
    searchTitle: {
      color: theme.colors.textBody,
    },
    customerListTable: {
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: theme.roundness.xs,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textCaptionS,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.surfaceDisabled,
    },
    pV_10: {
      paddingVertical: theme.spacing.sm,
    },
    padding_10: {
      padding: theme.spacing.sm,
    },
    borderWidth: {
      borderWidth: 1,
    },
    addDriverWarning: {
      paddingTop: 0,
      maxWidth: 400,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingTitle: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceLow,
      borderRadius: theme.spacing.xs,
    },
    driverSearchContainer: {
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.xs,
    },
    listItemContainer: {
      flex: 1,
      backgroundColor: theme.colors.surfaceBase
    },
    searchHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceBase,
      elevation: 4,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    headerTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      minHeight: 36,
    },
    listItem: {
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginVertical: 0,
      marginHorizontal: 0,
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      borderStyle: 'solid',
      borderColor: 'transparent',
    },
    listItemActive: {
      backgroundColor: theme.colors.surfaceLinkBase,
      borderColor: theme.colors.borderLinkBase,
      borderRadius: theme.roundness.md,
    },
    checkBoxTableHeader: {
      paddingHorizontal: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    riderImage: {
      width: 45,
      height: 45,
      borderRadius: theme.roundness.xl * 2,
      marginRight: theme.spacing.sm
    },
    newBookingContainer: {
      flexDirection: 'row',
      flex: 1,
      minHeight: 0
    },
    driverListContainer: {
      width: 450,
      minWidth: 380,
      height: '100%',
      maxHeight: '100%',
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
    },
    driverInnerConatiner: {
      flex: 1,
      marginBottom: 0,
      minHeight: 0,
      paddingVertical: theme.spacing.md,
    },
    driverCheckbox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm
    },
    driverCard: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.roundness.md,
      minHeight: 80,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderColor: theme.colors.borderDisabled,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    driverCardConflict: {
      backgroundColor: theme.colors.surfaceErrorBase,
      borderColor: theme.colors.borderErrorInverse,
      borderWidth: 1.5,
      borderBottomWidth: 1.5,
      borderBottomColor: theme.colors.borderErrorInverse,
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    driverCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 0,
    },
    driverCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
      paddingRight: theme.spacing.sm,
    },
    driverCardCheckbox: {
      marginRight: theme.spacing.sm,
      flexShrink: 0,
    },
    driverCardAvatarWrap: {
      position: 'relative',
      marginRight: theme.spacing.sm,
      flexShrink: 0,
    },
    driverCardAvatar: {
      width: 48,
      height: 48,
      borderRadius: theme.roundness.xl,
      borderWidth: 2,
      borderColor: theme.colors.borderDisabled,
    },
    driverCardTextWrap: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    driverCardName: {
      flex: 1,
      minWidth: 0,
      marginBottom: 2,
    },
    driverCardEmail: {
      marginTop: 1,
      minWidth: 0,
    },
    driverCardPhone: {
      marginTop: 1,
      minWidth: 0,
    },
    driverCardScheduleWrap: {
      marginLeft: theme.spacing.xs,
      flexShrink: 0,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 2,
      width: 48,
    },
    driverCardVehicleImage: {
      width: 44,
      height: 26,
    },
    driverSummaryCard: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.sm,
      backgroundColor: theme.colors.surfaceLow,
    },
    reassignButton: {
      height: 40,
      borderRadius: theme.roundness.xxl,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 4,
    },
    scheduleConflictWarning: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.roundness.sm,
      backgroundColor: theme.colors.surfaceErrorBase,
      borderWidth: 1,
      borderColor: theme.colors.borderErrorInverse,
    },
    scheduleConflictLoader: {
      paddingVertical: theme.spacing.md,
      alignItems: 'center'
    },
    assignRideModalLoader: {
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    assignRideModalContent: {
      position: 'relative',
    },
    assignRideModalOverlayLoader: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceBase,
      opacity: 0.96,
      zIndex: 1,
    },
    cancelReasonWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    cancelReasonChip: {
      minWidth: 0,
      height: 34,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.xxl,
      overflow: 'hidden',
      borderWidth: 1,
      textAlign: 'center',
      includeFontPadding: false,
      textAlignVertical: 'center',
    },
    cancelReasonChipActive: {
      borderColor: theme.colors.borderInverse,
      backgroundColor: theme.colors.surfaceInverse,
    },
    cancelReasonChipInactive: {
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
    },
    statusContainer: {
      minWidth: 112,
      maxWidth: 132,
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 1.5,
      overflow: 'hidden',
      fontSize: theme.fontSize.textCaptionS,
      lineHeight: theme.fontSize.textCaptionS * 1.25,
    },
    p_20: {
      padding: theme.spacing.lg,

    },
    notificationPopupOverlay: {
      position: 'absolute',
      top: 96,
      right: theme.spacing.lg,
      zIndex: 9999,
    },
    notificationPopupCard: {
      width: 320,
      borderWidth: 1.5,
      borderRadius: theme.roundness.lg,
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 10,
    },
    notificationPopupAccentBar: {
      height: 4,
      width: '100%',
    },
    notificationPopupBody: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    notificationPopupIconRing: {
      width: 44,
      height: 44,
      borderRadius: theme.roundness.xl,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationPopupIconInner: {
      width: 34,
      height: 34,
      borderRadius: theme.roundness.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationPopupTextBlock: {
      flex: 1,
      gap: theme.spacing.xs / 2,
    },
    notificationPopupBadgeRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.xs / 2,
    },
    notificationPopupBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.roundness.xxl,
    },
    notificationPopupMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs / 2,
    },
    notificationPopupCloseBtn: {
      padding: theme.spacing.xs,
      marginTop: theme.spacing.xs / 2,
    },
    notificationPopupActionBtn: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.sm - 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    notificationPopupProgressTrack: {
      height: 3,
      width: '100%',
    },
    notificationPopupProgressFill: {
      height: 3,
    },
    roundTripBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.xxl,
      backgroundColor: theme.colors.surfaceInverse,
      borderWidth: 1,
      borderColor: theme.colors.borderInverse,
      marginHorizontal: theme.spacing.sm,
    },
    mapContainer: {
      height: 300,
    },
    textNeutral: {
      color: theme.colors.textNeutral,
    },
    noHorizontalPadding: {
      paddingHorizontal: 0,
    },
    flexOne: {
      flex: 1,
    },
    centeredFlexOne: {
      flex: 1,
      justifyContent: 'center',
    },
    subtitleText: {
      fontSize: theme.fontSize.S2Subtitle,
    },
    rowNoGap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowOnly: {
      flexDirection: 'row',
    },
    markerColumn: {
      width: 30,
      alignItems: 'center',
    },
    shortMarkerConnector: {
      width: 1,
      height: 10,
      backgroundColor: theme.colors.borderMedium,
    },
    longMarkerConnector: {
      width: 1,
      height: 16,
      backgroundColor: theme.colors.borderMedium,
    },
    horizontalDivider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.borderDisabled,
    },
    horizontalDividerOffset: {
      marginTop: theme.spacing.sm,
    },
    rowGap5: {
      gap: 5,
    },
    rowGap10End: {
      gap: 10,
      justifyContent: 'flex-end',
    },
    rowGapWrapEnd: {
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    locationItemPadding: {
      paddingVertical: theme.spacing.sm,
    },
    cardPadding20: {
      padding: 20,
    },
    marginTopMd: {
      marginTop: theme.spacing.md,
    },
    zeroVerticalMargin: {
      marginVertical: 0,
    },
    noLeftPadding: {
      paddingLeft: 0,
    },
    paddingTop20: {
      paddingTop: 20,
    },
    marginTop2: {
      marginTop: 2,
    },
    headerVerticalPadding: {
      paddingVertical: theme.spacing.lg,
    },
    mediumFontFamily: {
      fontFamily: theme.fontFamily.medium,
    },
    sheetLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceBase,
      opacity: 0.85,
      zIndex: 2,
    },
    statusImage: {
      height: 48,
      width: 48,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.colors.borderBase,
      alignItems: 'center',
      justifyContent: 'center',
    },

    modalOverlayLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.roundness.md,
      zIndex: 999,
    },
    driverStatus:{
      padding: theme.spacing.xs,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: theme.roundness.xs,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.textCaptionS,
      textAlign: 'center',
    },
    blockErrorMessage: {
      color: theme.colors.textErrorDark, 
      fontSize: theme.fontSize.textCaptionS,
      marginTop:theme.spacing.sm 
    },
    borderWidth_1:{
      borderWidth: 1,
    },
    tennantEmail:{
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.textCaptionS,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    dashboaradLoader:{ 
      paddingVertical: theme.spacing.xl 
    },
    dashboardNoData: { 
      color: theme.colors.textNeutral, 
      fontFamily: theme.fontFamily.regular, 
      paddingVertical: theme.spacing.md 
    },
    businessDashboardCardRow: {
      marginBottom: theme.spacing.lg,
    },
    businessDashboardChartCard: {
      minWidth: 340,
      flex: 1,
      padding: theme.spacing.md,
    },
    businessDashboardTenantCard: {
      minWidth: 300,
      flex: 1,
    },
    businessDashboardSectionTitle: {
      marginBottom: theme.spacing.md,
    },
    businessDashboardTenantRow: {
      paddingVertical: theme.spacing.sm,
    },
    businessDashboardTenantInfo: {
      flex: 1,
    },
    businessDashboardTenantName: {
      fontFamily: theme.fontFamily.semiBold,
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.textBody,
    },
    subtleDivider: {
      opacity: 0.3,
    },
    readonlyInput: {
      backgroundColor: theme.colors.surfaceLow,
  },
  bookingstatus: {
      minWidth: 112,
      maxWidth: 132,
      textAlign: 'center',

      borderWidth: 1,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 1.5,
      overflow: 'hidden',
      fontSize: theme.fontSize.textCaptionS,
      lineHeight: theme.fontSize.textCaptionS * 1.25,
    }
  });
};
