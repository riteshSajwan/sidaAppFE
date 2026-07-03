import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import FileViewer from 'src/common/components/FilesViewer/FilesViewer';
import { useAppTheme } from 'src/common/context/AppTheme';
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

// ─── File Preview Modal ───────────────────────────────────────────────────────

function FilePreviewModal({
  file,
  visible,
  onClose,
}: {
  file: IFilesData | null;
  visible: boolean;
  onClose: () => void;
}) {
  const { theme } = useAppTheme();
  if (!file) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.72)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Modal card */}
        <View style={{
          width: '90%',
          maxWidth: 680,
          maxHeight: '85%',
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#eef0f5',
            backgroundColor: '#f8fafc',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Icon name="eye" size={18} color={theme.colors.textBody} />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 15,
                  fontFamily: theme.fontFamily.semiBold,
                  color: theme.colors.textBody,
                  flex: 1,
                }}
              >
                {file.fileName ?? 'Document Preview'}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close preview"
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#f1f5f9',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="closeAlt" size={14} color={theme.colors.textBody} />
            </Pressable>
          </View>

          {/* File content */}
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            <FileViewer filesData={[file]} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Column header config ─────────────────────────────────────────────────────

const HEADERS = [
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.Index',       style: 'colIndex'       },
  { labelKey: 'Admin.Sida.App.DocumentUpload.Header.DocType',     style: 'colDocType'     },
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
  const { theme } = useAppTheme();
  const styles = useDocumentUploadStyle();

  // ── Internal file state (fallback when caller does not pass externalFiles) ─
  const [internalFiles, setInternalFiles] = useState<IDocumentFilesState>(
    generateInitialFilesState,
  );
  const files = externalFiles ?? internalFiles;

  const setFiles = (updated: IDocumentFilesState) => {
    if (onFilesChange) onFilesChange(updated);
    else setInternalFiles(updated);
  };

  // ── Preview modal state ────────────────────────────────────────────────────
  const [previewFile, setPreviewFile] = useState<IFilesData | null>(null);

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
    const file        = files[field.key];
    const uploaded    = !!file;
    const fieldError  = errors[field.key] || pickerErrors[field.key] || '';
    const hasError    = !!fieldError;
    const types       = field.allowedTypes ?? DEFAULT_ACCEPTED_TYPES;
    const maxBytes    = field.maxSizeBytes ?? ALLOW_FILE_SIZE_BYTES;
    const formatLabel = buildFormatLabel(types);
    const fileSizeLabel = file?.blob?.size
      ? ` (${formatBytes(file.blob.size)})`
      : '';

    return (
      <View
        key={field.key}
        style={[styles.dataRow, hasError && styles.dataRowError]}
      >
        {/* # */}
        <View style={styles.colIndex}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        {/* Document Type */}
        <View style={styles.colDocType}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.docTypeLabel}>{t(field.labelKey as any)}</Text>
            {field.required && (
              <Text style={{ color: theme.colors.textErrorDark, marginLeft: 2 }}> *</Text>
            )}
          </View>
          {field.descriptionKey && (
            <Text style={styles.docTypeSubtitle}>
              {t(field.descriptionKey as any)}
            </Text>
          )}
          {hasError && <Text style={styles.errorText}>{fieldError}</Text>}
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
                {file?.fileName}{fileSizeLabel}
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
              {/* Eye — open preview modal */}
              <Pressable
                style={styles.iconBtn}
                onPress={() => setPreviewFile(file)}
                accessibilityLabel="View document"
                accessibilityRole="button"
              >
                <Icon name="eye" size={16} color={theme.colors.textBody} />
              </Pressable>

              {/* Re-upload */}
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
                    accessibilityRole="button"
                  >
                    <Icon name="import" size={16} color={theme.colors.textBody} />
                  </Pressable>
                )}
              />

              {/* Delete */}
              <Pressable
                style={[styles.iconBtn, styles.iconBtnDanger]}
                onPress={() => handleRemove(field.key)(0)}
                accessibilityLabel={t('Admin.Sida.App.DocumentUpload.Remove' as any)}
                accessibilityRole="button"
              >
                <Icon name="delete" size={16} color={theme.colors.textErrorDark} />
              </Pressable>
            </View>
          ) : (
            /* Upload button */
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
                  accessibilityRole="button"
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

      {/* File preview modal */}
      <FilePreviewModal
        file={previewFile}
        visible={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </View>
  );
};

export default DocumentUploads;
