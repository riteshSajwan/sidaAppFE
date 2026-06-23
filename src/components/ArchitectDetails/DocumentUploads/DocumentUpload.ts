import { StyleSheet } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';

export const useDocumentUploadStyle = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    /** Outer container wrapping the full list of document rows */
    container: {
      paddingVertical: theme.spacing.md,
    },

    /** Section heading above the document list */
    sectionTitle: {
      fontSize: theme.fontSize.S1Subtitle,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textBody,
      marginBottom: theme.spacing.md,
    },

    /** A single row: label on the left, upload button on the right */
    documentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderDisabled,
    },

    /** Row highlighted when there is a validation error */
    documentRowError: {
      borderBottomColor: theme.colors.borderErrorInverse,
    },

    /** Left side: label block + hints + errors */
    rowLeft: {
      flex: 1,
      flexDirection: 'column',
      gap: theme.spacing.xs,
      paddingRight: theme.spacing.md,
    },

    /** Inline row for label + required star */
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    /** Document label text */
    documentLabel: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textBody,
    },

    /** Red asterisk indicating a required field */
    requiredStar: {
      fontSize: theme.fontSize.textBodyMedium,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.textErrorDark,
    },

    /** Allowed format + size hint */
    hintText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
    },

    /** Small file-name text shown after a file is picked */
    fileNameText: {
      fontSize: theme.fontSize.textCaptionS,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.textBodyLight,
    },

    /** Right side: upload button */
    rowRight: {
      flexShrink: 0,
    },

    /** The upload / re-upload button */
    uploadBtn: {
      borderRadius: theme.roundness.sm,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderInverse,
      backgroundColor: theme.colors.surfaceInverse,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 110,
      height: 40,
    },

    /** Label inside the upload button */
    uploadBtnText: {
      fontSize: theme.fontSize.textButtonMedium,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.textInverse,
    },

    /** Uploaded state — green outline button */
    uploadedBtn: {
      borderColor: theme.colors.borderSuccessInverse,
      backgroundColor: theme.colors.surfaceBase,
    },

    uploadedBtnText: {
      color: theme.colors.textSuccessDark,
    },

    /** Wrapper for the API-level error shown below the list */
    apiErrorWrap: {
      marginTop: theme.spacing.md,
    },

    /** Bottom area containing the submit button */
    submitWrap: {
      marginTop: theme.spacing.xl,
      alignItems: 'flex-end',
    },
  });
};
