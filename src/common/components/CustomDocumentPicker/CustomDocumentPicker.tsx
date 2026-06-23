import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';

import {
  DocumentPickerAsset,
  DocumentPickerOptions,
  DocumentPickerSuccessResult,
} from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from 'src/common/context/AppTheme';

import { IErrorsMsg, generateIntialErrorMsg } from 'src/common/components/CustomDocumentPicker/DocumentPickerUtil';
import { ALLOW_FILE_SIZE_BYTES } from 'src/constants';
export interface IFilesData {
  uri: string;
  fileName: string;
  id?: number;
  blob?: Blob;
  fileType?: string;
}

export type IBlobType = Blob[] | Blob;

interface ICustomImagePickerProps {
  onSelect: (blobs: IBlobType, result: IFilesData[]) => void;
  handleError: (error: string) => void;
  handleImageLoading: (loading: boolean) => void;
  images?: IFilesData[];
  label?: string;
  multiple?: boolean;
  type?: string[];
  maxImages?: number;
  maxSize?: number;
  disabled?: boolean;
  /**
   * Optional render-prop for a custom trigger UI.
   * Receives `openPicker` — call it to open the OS document picker.
   * When provided, the default dashed-border button is NOT rendered.
   *
   * @example
   * renderTrigger={(openPicker) => (
   *   <Pressable onPress={openPicker}>
   *     <Text>Upload</Text>
   *   </Pressable>
   * )}
   */
  renderTrigger?: (openPicker: () => void) => React.ReactNode;
}

const CustomDocumentPicker = (props: ICustomImagePickerProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const uploadimage = useUploadImageStyle();
  const { theme } = useAppTheme();
  const [errorsMsg, setErrorsMsg] = useState<IErrorsMsg>(
    generateIntialErrorMsg(),
  );
  const {
    label,
    images,
    onSelect,
    multiple = false,
    type = ['*/*'],
    maxImages = 5,
    maxSize,
    disabled,
    handleError,
    handleImageLoading,
    renderTrigger,
  } = props;

  // Use caller-supplied maxSize (in bytes) when provided, otherwise fall back to the global default
  const fileSizeLimitBytes = maxSize ?? ALLOW_FILE_SIZE_BYTES;
  // Label shown in error messages — convert bytes to MB, round to nearest whole number
  const fileSizeLimitMB = Math.round(fileSizeLimitBytes / (1024 * 1024));

  const pickerOptions: DocumentPickerOptions = {
    multiple,
    type,
  };

  /**
   * Returns true when the MIME type is acceptable.
   * Passes through when type list is ['*\/*'] (no restriction) or when
   * the resolved MIME matches one of the allowed entries.
   * Also accepts a file whose MIME is empty but whose extension matches —
   * browsers sometimes return '' for uncommon types.
   */
  const isMimeAllowed = (mimeType: string, fileName: string): boolean => {
    // No restriction configured
    if (type.length === 0 || type.includes('*/*')) return true;

    // Direct MIME match
    if (mimeType && type.includes(mimeType)) return true;

    // Fallback: match by file extension against the allowed MIME list
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    return type.some((allowed) => {
      const allowedExt = allowed.split('/').pop()?.toLowerCase() ?? '';
      return allowedExt === ext;
    });
  };

  function handleOnSelect(
    blobs: IBlobType,
    results: DocumentPickerSuccessResult,
  ) {
    const newImages = results?.assets
      ? results.assets.map((result: DocumentPickerAsset, index: number) => ({
          uri: result.uri,
          blob: Array.isArray(blobs) ? blobs[index] : blobs,
          fileName: result.name,
          fileType: result.mimeType ?? '',
        }))
      : [];

    onSelect(blobs, newImages);
  }

  /**
   * Ensures the blob carries the correct MIME type.
   * For files like DXF, browsers/React Native may return a blob typed as
   * `application/octet-stream` or `""`. We rebuild the blob with the MIME
   * type the document picker reported so upstream upload logic is not broken.
   */
  const normalizeBlobType = (blob: Blob, mimeType?: string): Blob => {
    const effectiveMime = mimeType ?? '';
    if (!effectiveMime) return blob;
    // Rebuild whenever the blob type is empty or doesn't match what the picker reported
    if (blob.type === '' || blob.type !== effectiveMime) {
      return new Blob([blob], { type: effectiveMime });
    }
    return blob;
  };

  /**
   * Fetches a URI and returns a correctly-typed Blob.
   * expo-document-picker on web exposes a `file` property on each asset
   * (a native File object). We use that directly when available — this is
   * the most reliable path for non-standard file types such as DXF, because
   * `fetch()` on a blob/file URI can return `application/octet-stream` or
   * fail entirely depending on the browser/platform.
   */
  const assetToBlob = (asset: DocumentPickerAsset): Promise<Blob> => {
    // Use the native File object when the picker exposes it (web platform)
    const file = (asset as unknown as { file?: File }).file;
    if (file) {
      // The File object is already a Blob; ensure it carries the right type
      return Promise.resolve(normalizeBlobType(file, asset.mimeType ?? file.type));
    }

    // Fallback: fetch the URI and fix up the MIME type
    return fetch(asset.uri)
      .then((response) => response.blob())
      .then((blob) => normalizeBlobType(blob, asset.mimeType ?? ''));
  };

  const pickImage = () => {
    DocumentPicker.getDocumentAsync(pickerOptions)
      .then((result) => {
        handleImageLoading(true);

        if (result.canceled) {
          handleImageLoading(false);
          return;
        }

        handleError('');

        if (multiple) {
          const assets = result.assets;

          // MAX images validation
          if (images && images.length + assets.length > maxImages) {
            handleError(
              `You can only upload a maximum of ${maxImages} images.`,
            );
            handleImageLoading(false);
            return;
          }

          // MIME type validation (browser doesn't enforce accept attribute)
          const disallowedAsset = assets.find(
            (asset) => !isMimeAllowed(asset.mimeType ?? '', asset.name),
          );
          if (disallowedAsset) {
            const formats = type
              .filter((t) => t !== '*/*')
              .map((t) => t.split('/').pop()?.toUpperCase())
              .filter(Boolean)
              .join(', ');
            handleError(TranslateMessage('Admin.Delivery.App.Upload.InvalidType', { formats }));
            handleImageLoading(false);
            return;
          }

          // Individual file size validation
          const isTooLarge = assets.some(
            (asset) => (asset.size ?? 0) > fileSizeLimitBytes,
          );
          if (isTooLarge) {
            handleError(
              TranslateMessage('Admin.Delivery.App.Upload.Item.Size', {
                size: fileSizeLimitMB,
              }),
            );
            handleImageLoading(false);
            return;
          }

          // Total size validation
          const totalSize = assets.reduce(
            (sum, asset) => sum + (asset.size ?? 0),
            0,
          );
          if (totalSize > fileSizeLimitBytes) {
            handleError(
              TranslateMessage(
                'Admin.Delivery.App.Upload.Multiple.Items.Size',
                {
                  size: fileSizeLimitMB,
                },
              ),
            );
            handleImageLoading(false);
            return;
          }

          // Convert assets → correctly-typed Blobs
          Promise.all(assets.map(assetToBlob))
            .then((blobs) => {
              handleOnSelect(blobs, result);
              handleImageLoading(false);
            })
            .catch((err) => {
              console.error('CustomDocumentPicker: blob conversion failed', err);
              handleError(TranslateMessage('Admin.Delivery.App.SomethingWentWrong'));
              handleImageLoading(false);
            });
        } else {
          // SINGLE FILE
          const asset = result.assets[0];

          // MIME type validation (browser doesn't enforce accept attribute)
          if (!isMimeAllowed(asset.mimeType ?? '', asset.name)) {
            const formats = type
              .filter((t) => t !== '*/*')
              .map((t) => t.split('/').pop()?.toUpperCase())
              .filter(Boolean)
              .join(', ');
            handleError(TranslateMessage('Admin.Delivery.App.Upload.InvalidType', { formats }));
            handleImageLoading(false);
            return;
          }

          assetToBlob(asset)
            .then((blob) => {
              if (blob.size > fileSizeLimitBytes) {
                handleError(
                  TranslateMessage('Admin.Delivery.App.Upload.Item.Size', {
                    size: fileSizeLimitMB,
                  }),
                );
                handleImageLoading(false);
                return;
              }

              handleOnSelect(blob, result);
              handleImageLoading(false);
            })
            .catch((err) => {
              console.error('CustomDocumentPicker: blob conversion failed', err);
              handleError(TranslateMessage('Admin.Delivery.App.SomethingWentWrong'));
              handleImageLoading(false);
            });
        }
      })
      .catch((err) => {
        console.error('CustomDocumentPicker: getDocumentAsync failed', err);
        handleImageLoading(false);
      });
  };

  // ── Custom trigger: caller owns the UI, we just wire up pickImage ──────────
  if (renderTrigger) {
    return <>{renderTrigger(disabled ? () => {} : pickImage)}</>;
  }

  // ── Default dashed-border trigger ────────────────────────────────────────
  return (
    <View style={(formStyle.formRow, { marginBottom: 0 })}>
      <View style={layout.flexCol}>
        {label && <Text style={formStyle.labelTitle}>{label}</Text>}

        <View style={uploadimage.uploaddirection}>
          <View style={uploadimage.dashedBorder}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={disabled}
              onPress={pickImage}
            >
              <Image
                source={require('src/common/assets/images/RedUpload.png')}
                style={{ tintColor: theme.iconColor.iconBaseColor }}
              />
              <Text style={uploadimage.textcolor}>
                {TranslateMessage('Admin.Delivery.App.Upload.Picture')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomDocumentPicker;
