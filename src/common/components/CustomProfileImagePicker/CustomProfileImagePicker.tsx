import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';

import {
  DocumentPickerAsset,
  DocumentPickerOptions,
  DocumentPickerSuccessResult,
} from 'expo-document-picker';
import { useUserStyle } from 'src/common/assets/styles/user';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { getTenantHeaders } from 'src/common/service/restService/restService';

export interface IFilesData {
  uri: string;
  fileName: string;
  id?: number;
  blob?: Blob;
}

export type IBlobType = Blob[] | Blob;

interface ICustomImagePickerProps {
  onSelect: (blobs: IBlobType, result: IFilesData[]) => void;
  multiple?: boolean;
  type?: string[];
}

const CustomProfileImagePicker = (props: ICustomImagePickerProps) => {
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const uploadimage = useUploadImageStyle();
  const {theme} = useAppTheme();
  const { tenantId } = useTenantId();
 
  const { onSelect, multiple = false, type = ['*/*'] } = props;

  const pickerOptions: DocumentPickerOptions = {
    multiple,
    type,
  };

  function handleOnSelect(
    blobs: IBlobType,
    results: DocumentPickerSuccessResult
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
    if (result.canceled) return;
    
      const headers = getTenantHeaders(tenantId);
      return fetch(result.assets[0].uri,{ headers })
        .then((response) => response.blob())
        .then((blob) => {
          handleOnSelect(blob, result);
        });
    })
    .catch((error) => {
      console.warn('Error picking image:', error);
    });
};


  return (
    <View style={(formStyle.formRow, { marginBottom: 0 })}>
      <View style={layout.flexCol}>
        <View style={uploadimage.uploaddirection}>
          <View style={{}}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={pickImage}
            >
              <View style={userStyle.profileicon} >
                <Icon name='edit' size={18} color={theme.colors.iconBase} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomProfileImagePicker;
