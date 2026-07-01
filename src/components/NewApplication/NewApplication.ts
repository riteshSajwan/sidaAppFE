import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useNewApplicationStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    // ── Page wrapper ──────────────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfaceLow,
      padding: theme.spacing.xl,
    },
    // ── Page heading block ────────────────────────────────────────────
    headingBlock: {
      marginBottom: theme.spacing.xl,
    },
    subHeadingText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textNeutral,
      marginTop: theme.spacing.xs,
    },
    // ── Timeline card ─────────────────────────────────────────────────
    timelineCard: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
    },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    timelineStep: {
      alignItems: 'center',
      flex: 1,
    },
    timelineStepTop: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    stepCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      zIndex: 1,
    },
    stepCircleCompleted: {
      backgroundColor: theme.colors.surfaceInverse,
      borderColor: theme.colors.surfaceInverse,
    },
    stepCircleActive: {
      backgroundColor: theme.colors.surfaceBase,
      borderColor: theme.colors.surfaceInverse,
    },
    stepCircleInactive: {
      backgroundColor: theme.colors.surfaceBase,
      borderColor: theme.colors.borderMedium,
    },
    stepConnector: {
      flex: 1,
      height: 2,
      marginTop: 0,
    },
    stepConnectorCompleted: {
      backgroundColor: theme.colors.surfaceInverse,
    },
    stepConnectorInactive: {
      backgroundColor: theme.colors.borderMedium,
    },
    stepLabel: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
      maxWidth: 80,
    },
    stepLabelActive: {
      color: theme.colors.surfaceInverse,
      fontFamily: theme.fontFamily.semiBold,
    },
    stepLabelInactive: {
      color: theme.colors.textNeutral,
    },
    // ── Form card ─────────────────────────────────────────────────────
    formCard: {
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
    },
    formCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    addBtnText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textLinkDark,
    },
    sectionBox: {
      backgroundColor: theme.colors.surfaceLow,
      borderRadius: theme.roundness.sm,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    sectionLabel: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textLinkDark,
      marginBottom: theme.spacing.md,
    },
    formRow: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexWrap: 'wrap',
    },
    formCol: {
      flex: 1,
      minWidth: 200,
    },
    fieldLabel: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
      marginBottom: theme.spacing.xs,
    },
    required: {
      color: theme.colors.textErrorDark,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.borderMedium,
      borderRadius: theme.roundness.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      height: 44,
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBody,
      backgroundColor: theme.colors.surfaceBase,
    },
    // ── Bottom navigation bar ─────────────────────────────────────────
    bottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surfaceBase,
      borderRadius: theme.roundness.md,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
    },
    prevBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    prevBtnText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
    },
    dotsRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
      backgroundColor: theme.colors.surfaceInverse,
    },
    dotInactive: {
      width: 8,
      backgroundColor: theme.colors.borderMedium,
    },
    nextBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceInverse,
      borderRadius: theme.roundness.sm,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      height: 44,
    },
    nextBtnText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textInverse,
    },
    disabledPrev: {
      opacity: 0.35,
    },
  });
};
