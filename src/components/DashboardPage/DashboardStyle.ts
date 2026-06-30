import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useDashboardStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfaceLow,
      padding: theme.spacing.xl,
    },
    // ── Welcome Banner ──────────────────────────────────────────────
    banner: {
      borderRadius: theme.roundness.md,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      overflow: 'hidden',
      minHeight: 140,
      justifyContent: 'center',
    },
    bannerSubText: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    bannerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    bannerBtnPrimary: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    bannerBtnPrimaryText: {
      color: theme.colors.surfaceInverse,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    bannerBtnSecondary: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: theme.roundness.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    bannerBtnSecondaryText: {
      color: theme.colors.textInverse,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
    },
    // ── Stat Cards ──────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      flexWrap: 'wrap',
    },
    statCard: {
      flex: 1,
      minWidth: 130,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      shadowColor: theme.colors.surfaceInverse,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
    statIconWrap: {
      width: 36,
      height: 36,
      borderRadius: theme.roundness.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    statValue: {
      fontSize: 28,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.textHeading,
      lineHeight: 34,
    },
    statLabel: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    statTrend: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      gap: 3,
    },
    statTrendTextPos: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textSuccessDark,
    },
    statTrendTextNeg: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textErrorDark,
    },
    statTrendSub: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    // ── Bottom Row: Chart + Notifications ───────────────────────────
    bottomRow: {
      flexDirection: 'row',
      gap: theme.spacing.xl,
    },
    chartCard: {
      flex: 2,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    chartLegend: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    legendLabel: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    // Placeholder chart bars
    chartArea: {
      height: 160,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      marginTop: theme.spacing.sm,
    },
    chartBar: {
      flex: 1,
      borderRadius: 3,
      minHeight: 4,
    },
    chartXLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    chartXLabel: {
      fontSize: theme.fontSize.textCaptionTiny,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    // ── Notifications Panel ─────────────────────────────────────────
    notifCard: {
      flex: 1,
      minWidth: 260,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
    },
    notifHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    viewAllText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textLinkDark,
    },
    notifItem: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
    },
    notifIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    notifContent: {
      flex: 1,
    },
    notifTitle: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    notifSub: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    notifTime: {
      fontSize: theme.fontSize.textCaptionTiny,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    // Shared
    TextCardSubTitle: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    BottomDashboardText: {
      textAlign: 'center',
    },
  });
};
