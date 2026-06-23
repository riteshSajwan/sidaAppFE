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
  } = props;

  // Use caller-supplied maxSize (in bytes) when provided, otherwise fall back to the global default
  const fileSizeLimitBytes = maxSize ?? ALLOW_FILE_SIZE_BYTES;
  // Label shown in error messages — convert bytes to MB, round to nearest whole number
  const fileSizeLimitMB = Math.round(fileSizeLimitBytes / (1024 * 1024));

  const pickerOptions: DocumentPickerOptions = {
    multiple,
    type,
  };

  function handleOnSelect(
    blobs: IBlobType,
    results: DocumentPickerSuccessResult,
  ) {
    console.log("handleOnSelect",blobs)
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
