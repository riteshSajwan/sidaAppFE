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
    const newImages = results?.assets
      ? results.assets.map((result: DocumentPickerAsset, index: number) => ({
          uri: result.uri,
          blob: Array.isArray(blobs) ? blobs[index] : blobs,
          fileName: result.name,
        }))
      : [];

    onSelect(blobs, newImages);
  }

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
          const newImages = result.assets.map((asset) => asset.uri);

          // MAX images validation
          if (images && images.length + newImages.length > maxImages) {
            handleError(
              `You can only upload a maximum of ${maxImages} images.`,
            );
            handleImageLoading(false);
            return;
          }

          // Individual file size validation
          const isTooLarge = result.assets.some(
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
          const totalSize = result.assets.reduce(
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

          // Convert URIs → Blobs
          Promise.all(
            newImages.map((uri) =>
              fetch(uri).then((response) => response.blob()),
            ),
          )
            .then((blobs) => {
              handleOnSelect(blobs, result);
              handleImageLoading(false);
            })
            .catch(() => {
              handleImageLoading(false);
            });
        } else {
          // SINGLE FILE
          fetch(result.assets[0].uri)
            .then((response) => response.blob())
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
            .catch(() => {
              handleImageLoading(false);
            });
        }
      })
      .catch(() => {
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
