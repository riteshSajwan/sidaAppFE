import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
// import CustomDocumentPicker from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';
import { useDocumentUploadStyle } from './DocumentUpload';
import {
  DEFAULT_ACCEPTED_TYPES,
  formatBytes,
  generateInitialFilesState,
  IDocumentErrors,
  IDocumentField,
  IDocumentFilesState,
  IDocumentUploadsProps,
  mimeToExtLabel
} from './DocumentUploadsUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFormatHint(types: string[]): string {
  return types
    .map(mimeToExtLabel)
    .filter((v, i, arr) => arr.indexOf(v) === i) // dedupe
    .join(', ');
}

// ─── Component ────────────────────────────────────────────────────────────────

const DocumentUploads = ({
  errors,
  setErrors,
  pickerErrors,
  setPickerErrors,
  files: externalFiles,
  onFilesChange,
  fields,
  sectionTitle,
}: IDocumentUploadsProps) => {
  const { t: T } = useTranslation();
  const styles = useDocumentUploadStyle();
  const layout = useLayoutStyle();

  // Use custom fields if provided, otherwise fall back to the default set
  // const fields = customFields ?? DOCUMENT_FIELDS;

  /* ── State — all owned internally ── */
  const [internalFiles, setInternalFiles] = useState<IDocumentFilesState>(
    generateInitialFilesState,
  );

  const files = externalFiles ?? internalFiles;

  /* ── File state updater ── */
  const setFiles = (updated: IDocumentFilesState) => {
    if (onFilesChange) {
      onFilesChange(updated);
    } else {
      setInternalFiles(updated);
    }
  };

  /* ── Called by CustomDocumentWrapper after a successful pick ── */
  const handleSelect = (key: string) => (_blobs: IBlobType, results: IFilesData[]) => {
    if (!results.length) return;
    setErrors((prev: IDocumentErrors) => ({ ...prev, [key]: '' }));
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: '' }));
    setFiles({ ...files, [key]: results[0] });
  };

  /* ── Remove a file for a specific field ── */
  const handleRemove = (key: string) => (_index: number) => {
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: '' }));
    setFiles({ ...files, [key]: null });
  };

  /* ── Called by CustomDocumentWrapper when it rejects a file ── */
  const handlePickerError = (key: string) => (msg: string) => {
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: msg }));
  };


  /* ── Render helpers ── */

  function renderFormatHint(field: IDocumentField) {
    const types = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const maxBytes = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const hintKey = field.required
      ? 'Admin.Sida.App.DocumentUpload.Hint'
      : 'Admin.Sida.App.DocumentUpload.Hint.Optional';

    return (
      <Text style={styles.hintText}>
        {T(hintKey, { formats: buildFormatHint(types), size: formatBytes(maxBytes) })}
      </Text>
    );
  }

  function renderDocumentRow(field: IDocumentField) {
    const file = files[field.key];
    const uploaded = !!file;
    const fieldError = errors[field.key] || pickerErrors[field.key] || '';
    const hasError = !!fieldError;

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

        {/* Right — CustomDocumentWrapper with renderTrigger + built-in FileViewer */}
        <View style={styles.rowRight}>
          <CustomDocumentWrapper
            files={file ? [file] : []}
            onSelect={handleSelect(field.key)}
            handleRemoveFile={handleRemove(field.key)}
            multiple={false}
            maxImages={1}
            type={field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES}
            maxSize={field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES}
            onError={handlePickerError(field.key)}
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
        {sectionTitle ?? T('Admin.Sida.App.DocumentUpload.Title')}
      </Text>

      {fields.map(renderDocumentRow)}

      {/* API-level error */}
      {!!errors.apiError && (
        <View style={styles.apiErrorWrap}>
          <ErrorMessageContainer message={errors.apiError} />
        </View>
      )}
    </View>
  );
};

export default DocumentUploads;
