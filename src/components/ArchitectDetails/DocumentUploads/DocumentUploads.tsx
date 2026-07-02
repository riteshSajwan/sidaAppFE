import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useDocumentUploadStyle } from './DocumentUpload';
import {
    DEFAULT_ACCEPTED_TYPES,
    formatBytes,
    generateInitialFilesState,
    IDocumentErrors,
    IDocumentField,
    IDocumentFilesState,
    IDocumentUploadsProps,
    mimeToExtLabel,
} from './DocumentUploadsUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFormatLabel(types: string[]): string {
  return types
    .map(mimeToExtLabel)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ');
}

// ─── Column header config ─────────────────────────────────────────────────────

const HEADERS = [
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Index',       style: 'colIndex'       },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.DocType',     style: 'colDocType'     },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Description', style: 'colDescription' },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Format',      style: 'colFormat'      },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Status',      style: 'colStatus'      },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Action',      style: 'colAction'      },
] as const;

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
  const { t } = useTranslation();
  const styles = useDocumentUploadStyle();

  // ── Internal file state (used when caller does not pass externalFiles) ─────
  const [internalFiles, setInternalFiles] = useState<IDocumentFilesState>(
    generateInitialFilesState,
  );
  const files = externalFiles ?? internalFiles;

  const setFiles = (updated: IDocumentFilesState) => {
    if (onFilesChange) {
      onFilesChange(updated);
    } else {
      setInternalFiles(updated);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelect = (key: string) => (_blobs: IBlobType, results: IFilesData[]) => {
    if (!results.length) return;
    setErrors((prev: IDocumentErrors) => ({ ...prev, [key]: '' }));
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: '' }));
    setFiles({ ...files, [key]: results[0] });
  };

  const handleRemove = (key: string) => (_index: number) => {
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: '' }));
    setFiles({ ...files, [key]: null });
  };

  const handlePickerError = (key: string) => (msg: string) => {
    setPickerErrors((prev: Record<string, string>) => ({ ...prev, [key]: msg }));
  };

  // ── Row renderer ──────────────────────────────────────────────────────────

  function renderRow(field: IDocumentField, index: number) {
    const file      = files[field.key];
    const uploaded  = !!file;
    const fieldError = errors[field.key] || pickerErrors[field.key] || '';
    const hasError  = !!fieldError;
    const types     = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const maxBytes  = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const formatLabel = buildFormatLabel(types);

    return (
      <View
        key={field.key}
        style={[styles.dataRow, hasError && styles.dataRowError]}
      >
        {/* # */}
        <View style={styles.colIndex}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        {/* Document Type — bold name + optional subtitle */}
        <View style={styles.colDocType}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.docTypeLabel}>{t(field.labelKey as any)}</Text>
            {field.required && (
              <Text style={{ color: 'red', marginLeft: 2 }}> *</Text>
            )}
          </View>
          {field.descriptionKey && (
            <Text style={styles.docTypeSubtitle}>
              {t(field.descriptionKey as any)}
            </Text>
          )}
          {hasError && (
            <Text style={styles.errorText}>{fieldError}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.colDescription}>
          <Text style={styles.descriptionText}>
            {t(`${field.labelKey}.Description` as any, { defaultValue: '—' })}
          </Text>
        </View>

        {/* File Format */}
        <View style={styles.colFormat}>
          <Text style={styles.formatText}>{formatLabel}</Text>
          <Text style={styles.formatText}>{formatBytes(maxBytes)}</Text>
        </View>

        {/* Status */}
        <View style={styles.colStatus}>
          {uploaded ? (
            <View>
              <View style={styles.statusRow}>
                <Icon name="tick" size={14} color="#22c55e" />
                <Text style={styles.statusUploaded}>
                  {t('Admin.Sida.App.DocumentUpload.Status.Uploaded' as any)}
                </Text>
              </View>
              <Text style={styles.statusFileName} numberOfLines={1}>
                {file?.fileName}
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <Icon name="closeAlt" size={14} color="#f59e0b" />
              <Text style={styles.statusNotUploaded}>
                {t('Admin.Sida.App.DocumentUpload.Status.NotUploaded' as any)}
              </Text>
            </View>
          )}
        </View>

        {/* Action */}
        <View style={styles.colAction}>
          {uploaded ? (
            <View style={styles.actionRow}>
              {/* View — opens file via CustomDocumentWrapper's FileViewer */}
              <CustomDocumentWrapper
                files={file ? [file] : []}
                onSelect={handleSelect(field.key)}
                handleRemoveFile={handleRemove(field.key)}
                multiple={false}
                maxImages={1}
                type={types}
                maxSize={maxBytes}
                onError={handlePickerError(field.key)}
                renderTrigger={() => null}
              />
              {/* Re-upload trigger */}
              <CustomDocumentWrapper
                files={[]}
                onSelect={handleSelect(field.key)}
                handleRemoveFile={handleRemove(field.key)}
                multiple={false}
                maxImages={1}
                type={types}
                maxSize={maxBytes}
                onError={handlePickerError(field.key)}
                renderTrigger={(openPicker) => (
                  <Pressable
                    style={styles.iconBtn}
                    onPress={openPicker}
                    accessibilityLabel={t('Admin.Sida.App.DocumentUpload.ReUpload' as any)}
                  >
                    <Icon name="import" size={16} color="#6b7280" />
                  </Pressable>
                )}
              />
              {/* Delete */}
              <Pressable
                style={styles.iconBtn}
                onPress={() => handleRemove(field.key)(0)}
                accessibilityLabel={t('Admin.Sida.App.DocumentUpload.Remove' as any)}
              >
                <Icon name="delete" size={16} color="#ef4444" />
              </Pressable>
            </View>
          ) : (
            /* Upload button — uses CustomDocumentWrapper's renderTrigger */
            <CustomDocumentWrapper
              files={[]}
              onSelect={handleSelect(field.key)}
              handleRemoveFile={handleRemove(field.key)}
              multiple={false}
              maxImages={1}
              type={types}
              maxSize={maxBytes}
              onError={handlePickerError(field.key)}
              renderTrigger={(openPicker) => (
                <Pressable
                  style={styles.uploadBtn}
                  onPress={openPicker}
                  accessibilityLabel={t('Admin.Sida.App.DocumentUpload.Upload' as any)}
                >
                  <Icon name="import" size={16} color="#ffffff" />
                  <Text style={styles.uploadBtnText}>
                    {t('Admin.Sida.App.DocumentUpload.Upload' as any)}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Section title */}
      {!!sectionTitle && (
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      )}

      {/* Table header */}
      <View style={styles.headerRow}>
        {HEADERS.map((h) => (
          <View key={h.style} style={styles[h.style]}>
            <Text style={styles.headerText}>
              {t(h.labelKey as any)}
            </Text>
          </View>
        ))}
      </View>

      {/* Data rows */}
      {fields.map(renderRow)}

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
