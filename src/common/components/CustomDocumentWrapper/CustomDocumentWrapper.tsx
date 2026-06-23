import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import CustomDocumentPicker, {
  IBlobType,
  IFilesData,
} from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import FileViewer from 'src/common/components/FilesViewer/FilesViewer';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import { Text } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';

interface ICustomDocumentWrapperProps {
  label?: string;
  onSelect: (blobs: IBlobType, result: IFilesData[]) => void;
  files: IFilesData[];
  handleRemoveFile?: (index: number) => void;
  multiple?: boolean;
  type?: string[];
  maxImages?: number;
  maxSize?: number;
  disabled?: boolean;
}

const CustomDocumentWrapper = (props: ICustomDocumentWrapperProps) => {
  const {
    label,
    files,
    disabled =false,
    onSelect,
    multiple = false,
    type = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // DXF MIME types — do NOT include extension strings like ".dxf";
      // expo-document-picker only accepts MIME types in this array.
      "application/dxf",
      "image/vnd.dxf",
      "application/x-dxf",
      "drawing/x-dxf",
      // Fallback: some OS/browsers report DXF as plain binary
      "application/octet-stream",
    ],
    maxImages = 5,
    handleRemoveFile,
    maxSize
  } = props;

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleError = (error: string) => {
    setLoading(false)
    setError(error);
  };
  const handleImageLoading = (loading: boolean) => {
    setLoading(loading);
  };
  const formStyle = useFormStyle();
  const uploadimage = useUploadImageStyle();
  console.log("Ritesh2")
  return (
    <View>
      <Text style={formStyle.labelTitle}>{label}</Text>
      <View style={[uploadimage.uploadImageContainer,]}>
        {files.length ==0 && <CustomDocumentPicker
          onSelect={onSelect}
          type={type}
          maxImages={maxImages}
          multiple={multiple}
          images={files}
          handleError={handleError}
          maxSize={maxSize}
          disabled={disabled}
          handleImageLoading={handleImageLoading}
        />}

        {files && (
          <FileViewer filesData={files} removeFile={handleRemoveFile} loading={loading} handleError={handleError}  disabled={disabled}/>
        )}
      </View>
      <ErrorMessageContainer message={error} />
    </View>
  );
};

export default CustomDocumentWrapper;
