import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useTicketStyle = () => {
  const { theme } = useAppTheme();
return StyleSheet.create({
   
  
      font400: {
        fontFamily: theme.fontFamily.regular,
      },
      favHeader: {
        marginBottom: theme.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      orderTxt: {
        fontSize: theme.fontSize.textBodyLarge,
        fontFamily: theme.fontFamily.semiBold,
        color: theme.colors.textBody,
      },
      favWrap: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      favTxt: {
        fontSize: theme.fontSize.textBodyLarge,
        fontFamily: theme.fontFamily.semiBold,
        color: theme.colors.textBody,
        marginLeft: theme.spacing.xs,
      },
      orderSummary: {
        paddingBottom: theme.spacing.md,
        borderBottomColor: theme.colors.borderBase,
        borderBottomWidth: 1,
      },
      restroImg: {
        width: 84,
        height: 79,
        borderColor: theme.colors.borderBase,
        borderWidth: 1,
        borderRadius: theme.roundness.sm,
      },
      restroInfo: {
        marginLeft: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      restroHeading: {
        fontSize: theme.fontSize.textHeadingMedium,
        fontFamily: theme.fontFamily.semiBold,
      },
      restroTxt: {
        fontSize: theme.fontSize.textBodyMedium,
        color:theme.colors.textNeutral,
        fontFamily: theme.fontFamily.regular,
      },
      valueWrap: {
        marginTop: theme.spacing.md,
      },
      quantityWrap: {
        fontSize: theme.fontSize.S2Subtitle,
        fontFamily:  theme.fontFamily.regular,
        color: theme.colors.textNeutral,
      },
      font500: {
        fontFamily:  theme.fontFamily.medium,
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
        alignItems: 'center',
      },
      summaryHead: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      subSummary: {
        paddingLeft: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
      },
      subTxt: {
        fontSize: theme.fontSize.S2Subtitle,
        color: theme.colors.textBody,
        fontFamily:  theme.fontFamily.regular,
        marginTop: theme.spacing.xs,
      },
      mt0: {
        marginTop: 0,
      },
      shareTxt: {
        fontSize: theme.fontSize.textBodyLarge,
        fontFamily: theme.fontFamily.semiBold,
        color: theme.colors.textBody,
      },
      summaryTxt: {
        color: theme.colors.textNeutral,
        fontSize: theme.fontSize.textBodyLarge,
        fontFamily:  theme.fontFamily.regular,
        marginRight: theme.spacing.md,
      },
      summaryInfo: {
        fontFamily:  theme.fontFamily.medium,
      },
      infoIconImg: {
        width: 18,
        height: 18,
      },
      totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: theme.spacing.md,
        borderTopColor: theme.colors.borderMedium,
        borderTopWidth: 1,
        borderBottomColor: theme.colors.borderMedium,
        borderBottomWidth: 1,
        paddingVertical: theme.spacing.md,
      },
      mb16: {
        marginBottom: theme.spacing.md,
      },
      totalText: {
        fontSize: theme.fontSize.textHeadingMedium,
        color: theme.colors.textNeutral,
        fontFamily:  theme.fontFamily.medium,
      },
      boldTxt: {
        fontFamily: theme.fontFamily.bold,
      },
      invoiceWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: theme.spacing.xs,
      },
      invoiceTxt: {
        fontSize: theme.fontSize.S2Subtitle,
        color: theme.colors.textBody,
        fontFamily: theme.fontFamily.semiBold,
        marginRight: theme.spacing.sm,
      },
      invoiceImg: {
        width: 11,
        height: 13,
      },
      orderDetailWrap: {
        borderTopColor: theme.colors.borderMedium,
        borderTopWidth: 1,
        borderBottomColor: theme.colors.borderMedium,
        borderBottomWidth: 1,
        paddingVertical: theme.spacing.md,
      },
      orderHeading: {
        fontSize: theme.fontSize.textHeadingMedium,
        fontFamily: theme.fontFamily.semiBold,
        color: theme.colors.textBody,
      },

      orderRow: {
        marginTop: theme.spacing.md,
      },
      txtOrder: {
        fontSize: theme.fontSize.textBodyLarge,
        color: theme.colors.textDisabled,
        fontFamily:  theme.fontFamily.regular,
        marginBottom: theme.spacing.xs,
      },
      txtSubOrder: {
        fontSize: theme.fontSize.textBodyLarge,
        color: theme.colors.textNeutral,
        fontFamily:  theme.fontFamily.medium,
      },
     
      infoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      infoTxt: {
        color: theme.colors.textBody,
        fontSize: theme.fontSize.textBodyMedium,
        fontFamily: theme.fontFamily.semiBold,
      },
      infoIcon: {
        width: 12,
        height: 12,
        marginRight: theme.spacing.sm,
      },
      informationWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
      },
      callIcon: {
        width: 32,
        height: 32,
        marginLeft: theme.spacing.md,
      },
      imgRestro: {
        width: 60,
        borderColor: theme.colors.borderMedium,
        borderWidth: 0.77,
        borderRadius: theme.roundness.xs,
        height: 46,
        marginRight: theme.spacing.md,
      },
      infoAddress:{
        flex:1,
      },
      ratingStart: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
      },
      itemWrapper: {
        paddingTop: theme.spacing.md,
      },
      riderWrapper: {
        borderTopColor: theme.colors.borderDisabled,
        borderTopWidth: 1,
        paddingTop: theme.roundness.xxl,
      },
      riderImg: {
        width: 48,
        height: 48,
        borderRadius: theme.roundness.xxl*2,
        marginRight: theme.spacing.sm,
      },
      phoneTxt: {
        fontSize: theme.fontSize.textBodyMedium,
        color:theme.colors.textNeutral,
        fontFamily:  theme.fontFamily.regular,
      },
      riderInnerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
      },
      fontSize_13:{
        fontSize:theme.fontSize.textBodyMedium,
      },
      padding_5:{
        padding:theme.spacing.xs
      },
      userImageImg: {
        width: 90,
        height: 90,
      },
      fontSize_16:{
        fontSize:theme.fontSize.S2Subtitle,
      },
    });
};


