import * as ImagePicker from 'expo-image-picker';
import { ImagePickerOptions, MediaTypeOptions } from 'expo-image-picker';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import { useAppTheme } from 'src/common/context/AppTheme';

interface ICustomImagePicker {
  label: string;
  image: string | null;
  onSelect: (blob: any, result: any) => void;
  multiple?: boolean;
  mediaTypes?: MediaTypeOptions;
}

const CustomImagePicker = (props: ICustomImagePicker) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const uploadimage = useUploadImageStyle();
  const {theme} = useAppTheme();
  const {
    label,
    image,
    onSelect,
    multiple = false,
    mediaTypes = ImagePicker.MediaTypeOptions.Images,
  } = props;

  const pickerOptions: ImagePickerOptions = {
    allowsMultipleSelection: multiple,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      ...pickerOptions,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      onSelect(blob, result);
    }
  };

  return (
    <View style={formStyle.formRow}>
      <View style={layout.flexCol}>
        <View>
          <Text style={formStyle.labelTitle}>{label}</Text>
        </View>
        <View style={uploadimage.uploaddirection}>
          <View style={uploadimage.dashedBorder}>
            <Pressable
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={pickImage}
            >
              <Image source={require('src/assets/images/RedUpload.png')} style={{ tintColor: theme.iconColor.iconBaseColor }}/>
              <Text style={uploadimage.textcolor}>
              {TranslateMessage('Admin.Delivery.App.Upload.Picture')}
              </Text>
            </Pressable>
          </View>
          {image && (
            <View>
              <Image
                source={{ uri: image }}
                style={{ width: 250, height: 350 }}
                resizeMode='contain'
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomImagePicker;
