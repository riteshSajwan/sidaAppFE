import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useApplicationListingStyle = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
    },

    // ── Filter row ──────────────────────────────────────────────────
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    filterItem: {
      flexGrow: 1,
      flexBasis: 180,
      minWidth: 160,
    },
    filterLabel: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textNeutral,
      marginBottom: theme.spacing.xs,
    },

    // ── Table card ──────────────────────────────────────────────────
    card: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
    },
    cardTitle: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textHeading,
    },
    cardSubtitle: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    cardHeaderActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    viewAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    viewAllText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.surfaceLinkInverse,
    },
    iconBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
    },
    tableWrap: {
      paddingHorizontal: theme.spacing.xl,
    },

    // ── Cell content ────────────────────────────────────────────────
    applicationIdText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.surfaceLinkInverse,
    },
    primaryCellText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
    },
    secondaryCellText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    actionsCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionIconBtn: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.roundness.xs,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
    },

    // ── Pagination footer ───────────────────────────────────────────
    paginationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLow,
    },
    paginationLabel: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    paginationActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    paginationBtn: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
    },
    paginationBtnDisabled: {
      opacity: 0.5,
    },
    paginationBtnText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
    },

    // ── Status badge ────────────────────────────────────────────────
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: theme.roundness.xs,
      alignSelf: 'flex-start',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
    },
  });
};
