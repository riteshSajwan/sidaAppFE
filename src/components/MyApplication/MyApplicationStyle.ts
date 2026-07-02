import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useMyApplicationStyle = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    // ── Page wrapper ────────────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: theme.colors.surfaceLow,
    },
    container: {
      flexGrow: 1,
      padding: theme.spacing.xl,
    },

    // ── Page header ─────────────────────────────────────────────────
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    headingBlock: {
      flex: 1,
    },
    pageTitle: {
      fontSize: theme.fontSize.textHeadingMedium,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.textHeading,
      lineHeight: theme.fontSize.textHeadingMedium * 1.3,
    },
    pageSubtitle: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceBase,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.xs,
      minWidth: 230,
      height: 40,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      outlineStyle: 'none',
    } as any,

    // ── Two-panel row ────────────────────────────────────────────────
    panelRow: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      flex: 1,
    },

    // ── LEFT PANEL ──────────────────────────────────────────────────
    leftPanel: {
      width: 280,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      overflow: 'hidden',
    },
    leftPanelHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
    },
    leftPanelTitle: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    totalBadge: {
      backgroundColor: theme.colors.surfaceLow,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    totalBadgeText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textNeutral,
    },

    // Application card in left panel
    appCard: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
      cursor: 'pointer',
    } as any,
    appCardActive: {
      backgroundColor: theme.colors.surfaceLinkBase,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.borderLinkInverse,
    },
    appCardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    appCardId: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.surfaceLinkInverse,
    },
    appCardIdInactive: {
      color: theme.colors.textBody,
    },
    appCardService: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
      marginBottom: 3,
    },
    appCardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    appCardMetaText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
    },
    progressLabel: {
      fontSize: theme.fontSize.textCaptionTiny,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    progressPct: {
      fontSize: theme.fontSize.textCaptionTiny,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    progressTrack: {
      height: 4,
      backgroundColor: theme.colors.surfaceMedium,
      borderRadius: 2,
      marginTop: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: 4,
      borderRadius: 2,
    },

    // Status badges
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: theme.roundness.xs,
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

    // ── RIGHT PANEL ─────────────────────────────────────────────────
    rightPanel: {
      flex: 1,
      gap: theme.spacing.lg,
    },

    // App header card (top part of right panel — APP-2024-XXXX row)
    appHeaderCard: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      padding: theme.spacing.xl,
    },
    appHeaderTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    appHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    appHeaderId: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.textHeading,
    },
    appHeaderActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    appMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    appMetaText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    appMetaBold: {
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    appMetaDivider: {
      fontSize: theme.fontSize.textBodyMedium,
      color: theme.colors.borderMedium,
    },

    // Action buttons
    btnOutline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      backgroundColor: theme.colors.surfaceBase,
      height: 36,
    },
    btnOutlineText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
    },
    btnPrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.roundness.sm,
      backgroundColor: theme.colors.surfaceInverse,
      height: 36,
    },
    btnPrimaryText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textInverse,
    },

    // ── Timeline card (bottom part of right panel) ───────────────────
    timelineCard: {
      flex: 1,
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      padding: theme.spacing.xl,
    },
    timelineTitle: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textHeading,
      marginBottom: theme.spacing.xl,
    },

    // Individual timeline step
    timelineStep: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    timelineConnector: {
      alignItems: 'center',
      width: 32,
    },
    timelineCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timelineCircleActive: {
      backgroundColor: theme.colors.surfaceInverse,
    },
    timelineCircleCompleted: {
      backgroundColor: theme.colors.surfaceInverse,
    },
    timelineCirclePending: {
      backgroundColor: theme.colors.surfaceMedium,
      borderWidth: 1,
      borderColor: theme.colors.borderDisabled,
    },
    timelineLine: {
      flex: 1,
      width: 2,
      backgroundColor: theme.colors.borderLow,
      marginTop: 4,
      marginBottom: -4,
    },
    timelineLineCompleted: {
      backgroundColor: theme.colors.surfaceInverse,
    },
    timelineContent: {
      flex: 1,
      paddingTop: 4,
      paddingBottom: theme.spacing.sm,
    },
    timelineStepTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 4,
    },
    timelineStepLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      flexWrap: 'wrap',
    },
    timelineStepName: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },
    timelineStepNamePending: {
      color: theme.colors.textNeutral,
    },
    timelineStepDate: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
    },
    timelineStepDesc: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: 2,
    },

    // Inline status badge for timeline
    inProgressBadge: {
      backgroundColor: '#EFF6FF',
      borderRadius: theme.roundness.xs,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    inProgressText: {
      fontSize: theme.fontSize.textCaptionTiny,
      fontFamily: theme.fontFamily.semiBold,
      color: '#2563EB',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Alert/warning box inside timeline step
    alertBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      backgroundColor: '#FFFBEB',
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderColor: '#FDE68A',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    alertText: {
      flex: 1,
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.medium,
      color: '#92400E',
    },

    // Empty state
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl * 2,
    },
    emptyStateText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });
};
