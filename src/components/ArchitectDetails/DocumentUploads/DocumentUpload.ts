import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useDocumentUploadStyle = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({

    // ── Outer container ──────────────────────────────────────────────────────

    container: {
      marginTop: theme.spacing.lg,
      borderRadius: theme.roundness.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      overflow: 'hidden',
    },

    sectionTitle: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surfaceBase,
    },

    // ── Table header row ──────────────────────────────────────────────────────

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceLow,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
    },

    headerText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBodyLight,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // ── Data row ──────────────────────────────────────────────────────────────

    dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLow,
      backgroundColor: theme.colors.surfaceBase,
    },

    dataRowError: {
      backgroundColor: theme.colors.surfaceErrorLow ?? '#fff5f5',
    },

    // ── Column widths (flex) ──────────────────────────────────────────────────

    colIndex: {
      width: 32,
    },

    colDocType: {
      flex: 2,
      paddingRight: theme.spacing.sm,
    },

    colDescription: {
      flex: 2.5,
      paddingRight: theme.spacing.sm,
    },

    colFormat: {
      flex: 1.5,
      paddingRight: theme.spacing.sm,
    },

    colStatus: {
      flex: 1.5,
      paddingRight: theme.spacing.sm,
    },

    colAction: {
      width: 120,
      alignItems: 'flex-end',
    },

    // ── Cell content ──────────────────────────────────────────────────────────

    indexText: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
    },

    docTypeLabel: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
    },

    docTypeSubtitle: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
      marginTop: 2,
    },

    descriptionText: {
      fontSize: theme.fontSize.textBodySmall ?? theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
    },

    formatText: {
      fontSize: theme.fontSize.textBodySmall ?? theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
    },

    // ── Status badge ──────────────────────────────────────────────────────────

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },

    statusUploaded: {
      fontSize: theme.fontSize.textBodySmall ?? theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textSuccessDark,
    },

    statusNotUploaded: {
      fontSize: theme.fontSize.textBodySmall ?? theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textWarningDark ?? theme.colors.textErrorDark,
    },

    statusFileName: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
      marginTop: 2,
    },

    // ── Action buttons ────────────────────────────────────────────────────────

    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      justifyContent: 'flex-end',
    },

    uploadBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderInverse,
      backgroundColor: theme.colors.surfaceInverse,
      minWidth: 90,
      height: 36,
      justifyContent: 'center',
    },

    uploadBtnText: {
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textInverse,
    },

    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: theme.roundness.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderLow,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceBase,
    },

    iconBtnDanger: {
      borderColor: theme.colors.borderErrorInverse,
      backgroundColor: theme.colors.surfaceErrorLow ?? '#fff5f5',
    },

    // ── Error row ─────────────────────────────────────────────────────────────

    errorText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textErrorDark,
      marginTop: 2,
    },

    apiErrorWrap: {
      padding: theme.spacing.md,
    },

    submitWrap: {
      marginTop: theme.spacing.xl,
      alignItems: 'flex-end',
    },
  });
};
