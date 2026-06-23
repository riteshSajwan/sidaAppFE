import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDocumentPicker, {
  IBlobType,
  IFilesData,
} from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
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
  mimeToExtLabel,
  validateDocumentUploads,
} from './DocumentUploadsUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFormatHint(types: string[]): string {
  return types
    .map(mimeToExtLabel)
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
    .join(', ');
}

// ─── Component ────────────────────────────────────────────────────────────────

const DocumentUploads = ({ files: externalFiles, onFilesChange }: IDocumentUploadsProps) => {
  const { t: T } = useTranslation();
  const styles   = useDocumentUploadStyle();
  const layout   = useLayoutStyle();
  const button   = useButtonStyle();

  /* ── State ── */
  const [internalFiles, setInternalFiles] = useState<IDocumentFilesState>(
    generateInitialFilesState,
  );
  const [errors, setErrors]         = useState<IDocumentErrors>(generateInitialErrors);
  const [loading, setLoading]       = useState(false);
  const [pickerErrors, setPickerErrors] = useState<Record<string, string>>({});

  const files = externalFiles ?? internalFiles;

  /* ── File state updater ── */
  const setFiles = (updated: IDocumentFilesState) => {
    if (onFilesChange) {
      onFilesChange(updated);
    } else {
      setInternalFiles(updated);
    }
  };

  /* ── Called by CustomDocumentPicker after a successful pick ── */
  const handleSelect = (key: string) => (_blobs: IBlobType, results: IFilesData[]) => {
    if (!results.length) return;
    setErrors((prev) => ({ ...prev, [key]: '' }));
    setPickerErrors((prev) => ({ ...prev, [key]: '' }));
    setFiles({ ...files, [key]: results[0] });
  };

  /* ── Called by CustomDocumentPicker when it rejects a file ── */
  const handlePickerError = (key: string) => (msg: string) => {
    setPickerErrors((prev) => ({ ...prev, [key]: msg }));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateDocumentUploads(files);
    setErrors(validationErrors);
    if (!isValid) return;

    setLoading(true);
    try {
      // TODO: wire up API call
      console.log('Submit documents', files);
    } catch {
      setErrors((prev) => ({
        ...prev,
        apiError: T('Admin.Sida.App.DocumentUpload.ApiError'),
      }));
    } finally {
      setLoading(false);
    }
  };

  /* ── Render helpers ── */

  function renderFormatHint(field: IDocumentField) {
    const types    = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const hintKey  = field.required
      ? 'Admin.Sida.App.DocumentUpload.Hint'
      : 'Admin.Sida.App.DocumentUpload.Hint.Optional';

    return (
      <Text style={styles.hintText}>
        {T(hintKey, { formats: buildFormatHint(types), size: formatBytes(maxBytes) })}
      </Text>
    );
  }

  function renderDocumentRow(field: IDocumentField) {
    const file       = files[field.key];
    const uploaded   = !!file;
    const fieldError = errors[field.key] || pickerErrors[field.key] || '';
    const hasError   = !!fieldError;

    return (
      <View
        key={field.key}
        style={[styles.documentRow, hasError && styles.documentRowError]}
      >
        {/* Left — label, format hint, picked file name, error */}
        <View style={styles.rowLeft}>
          <View style={styles.labelRow}>
            <Text style={styles.documentLabel}>{T(field.labelKey)}</Text>
            {field.required && <Text style={styles.requiredStar}> *</Text>}
          </View>

          {renderFormatHint(field)}

          {uploaded && (
            <Text style={styles.fileNameText} numberOfLines={1}>
              📎 {file?.fileName}
            </Text>
          )}

          {hasError && <ErrorMessageContainer message={fieldError} />}
        </View>

        {/* Right — CustomDocumentPicker with renderTrigger */}
        <View style={styles.rowRight}>
          <CustomDocumentPicker
            onSelect={handleSelect(field.key)}
            handleError={handlePickerError(field.key)}
            handleImageLoading={() => {}}
            images={file ? [file] : []}
            multiple={false}
            maxImages={1}
            type={field.allowedTypes}
            maxSize={field.maxSizeBytes}
            renderTrigger={(openPicker) => (
              <Pressable
                onPress={openPicker}
                style={[styles.uploadBtn, uploaded && styles.uploadedBtn]}
              >
                <Text style={[styles.uploadBtnText, uploaded && styles.uploadedBtnText]}>
                  {uploaded
                    ? T('Admin.Sida.App.DocumentUpload.ReUpload')
                    : T('Admin.Sida.App.DocumentUpload.Upload')}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    );
  }

  /* ── Main render ── */
  return (
    <View style={[layout.cardBox, layout.tableContainer, styles.container]}>
      <Text style={styles.sectionTitle}>
        {T('Admin.Sida.App.DocumentUpload.Title')}
      </Text>

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
            {loading
              ? T('Admin.Sida.App.DocumentUpload.Submitting')
              : T('Admin.Sida.App.DocumentUpload.Submit')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DocumentUploads;
