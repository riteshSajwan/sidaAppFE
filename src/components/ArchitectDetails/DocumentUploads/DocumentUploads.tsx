import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';
import { useDocumentUploadStyle } from './DocumentUpload';
import {
  DEFAULT_ACCEPTED_TYPES,
  DOCUMENT_FIELDS,
  formatBytes,
  generateInitialErrors,
  generateInitialFilesState,
  IDocumentErrors,
  IDocumentField,
  IDocumentFilesState,
  IDocumentUploadsProps,
  pickDocumentForField,
  validateDocumentUploads,
} from './DocumentUploadsUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Derive a short human-readable hint from a MIME list, e.g. "PNG, JPG, PDF" */
function buildFormatHint(types: string[]): string {
  return types
    .map((t) => t.split('/').pop()?.toUpperCase() ?? t)
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
    .join(', ');
}

// ─── Component ────────────────────────────────────────────────────────────────

const DocumentUploads = ({ files: externalFiles, onFilesChange }: IDocumentUploadsProps) => {
  const styles  = useDocumentUploadStyle();
  const layout  = useLayoutStyle();
  const button  = useButtonStyle();

  /* ── State ── */
  const [internalFiles, setInternalFiles] = useState<IDocumentFilesState>(
    generateInitialFilesState,
  );
  const [errors, setErrors]   = useState<IDocumentErrors>(generateInitialErrors);
  const [loading, setLoading] = useState(false);

  const files = externalFiles ?? internalFiles;
 
  /* ── File state updater ── */
  const setFiles = (updated: IDocumentFilesState) => {
    if (onFilesChange) {
      onFilesChange(updated);
    } else {
      setInternalFiles(updated);
    }
  };

  /* ── Pick a file for a specific field ── */
  const handleUpload = async (field: IDocumentField) => {
    const picked = await pickDocumentForField(field);
    if (!picked) return;

    // Clear the field error immediately on new pick
    setErrors((prev) => ({ ...prev, [field.key]: '' }));
    setFiles({ ...files, [field.key]: picked });
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateDocumentUploads(files);
    setErrors(validationErrors);
    if (!isValid) return;

    setLoading(true);
    try {
      // TODO: wire up API call — files object contains all IFilesData entries
      console.log('Submit documents', files);
    } catch {
      setErrors((prev) => ({
        ...prev,
        apiError: 'Something went wrong. Please try again.',
      }));
    } finally {
      setLoading(false);
    }
  };

  /* ── Render helpers ── */

  function renderFormatHint(field: IDocumentField) {
    const types    = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    return (
      <Text style={styles.hintText}>
        {buildFormatHint(types)} · max {formatBytes(maxBytes)}
        {field.required ? '' : ' · Optional'}
      </Text>
    );
  }

  function renderDocumentRow(field: IDocumentField) {
    const file     = files[field.key];
    const uploaded = !!file;
    const hasError = !!errors[field.key];

    return (
      <View key={field.key} style={[styles.documentRow, hasError && styles.documentRowError]}>
        {/* Left — label, hint, file name, error */}
        <View style={styles.rowLeft}>
          <View style={styles.labelRow}>
            <Text style={styles.documentLabel}>{field.label}</Text>
            {field.required && <Text style={styles.requiredStar}> *</Text>}
          </View>

          {renderFormatHint(field)}

          {uploaded && (
            <Text style={styles.fileNameText} numberOfLines={1}>
              📎 {file?.fileName}
            </Text>
          )}

          {hasError && <ErrorMessageContainer message={errors[field.key]} />}
        </View>

        {/* Right — upload / re-upload button */}
        <View style={styles.rowRight}>
          <Pressable
            onPress={() => handleUpload(field)}
            style={[styles.uploadBtn, uploaded && styles.uploadedBtn]}
          >
            <Text style={[styles.uploadBtnText, uploaded && styles.uploadedBtnText]}>
              {uploaded ? '✓ Re-upload' : 'Upload'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /* ── Main render ── */
  return (
    <View style={[layout.cardBox, layout.tableContainer, styles.container]}>
      <Text style={styles.sectionTitle}>Document Uploads</Text>

      {DOCUMENT_FIELDS.map(renderDocumentRow)}

      {/* API-level error */}
      {!!errors.apiError && (
        <View style={styles.apiErrorWrap}>
          <ErrorMessageContainer message={errors.apiError} />
        </View>
      )}

      {/* Submit */}
      <View style={styles.submitWrap}>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={[button.btnBase, button.btnPrimary, loading && button.btnDisabled]}
        >
          <Text style={[button.btnBase, button.btnPrimary, loading && button.btnDisabled]}>
            {loading ? 'Submitting…' : 'Submit Documents'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DocumentUploads;
