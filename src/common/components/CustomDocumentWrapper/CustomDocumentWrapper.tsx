import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import CustomDocumentPicker, {
  IBlobType,
  IFilesData,
} from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import FileViewer from 'src/common/components/FilesViewer/FilesViewer';

export interface ICustomDocumentWrapperProps {
  label?: string;
  onSelect: (blobs: IBlobType, result: IFilesData[]) => void;
  files: IFilesData[];
  handleRemoveFile?: (index: number) => void;
  multiple?: boolean;
  type?: string[];
  maxImages?: number;
  maxSize?: number;
  disabled?: boolean;
  /**
   * Optional render-prop for a custom trigger button.
   * Receives `openPicker` — call it to open the OS document picker.
   * When provided, the default dashed-border picker UI is NOT shown;
   * the FileViewer preview is always rendered alongside it when files exist.
   *
   * @example
   * renderTrigger={(openPicker) => (
   *   <Pressable onPress={openPicker}>
   *     <Text>{files.length ? 'Re-upload' : 'Upload'}</Text>
   *   </Pressable>
   * )}
   */
  renderTrigger?: (openPicker: () => void) => React.ReactNode;
}

const CustomDocumentWrapper = (props: ICustomDocumentWrapperProps) => {
  const {
    label,
    files,
    disabled = false,
    onSelect,
    multiple = false,
    type = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/dxf',
      'image/vnd.dxf',
      'application/x-dxf',
      'drawing/x-dxf',
      'application/octet-stream',
    ],
    maxImages = 5,
    handleRemoveFile,
    maxSize,
    renderTrigger,
  } = props;

  const [error, setError]     = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleError = (msg: string) => {
    setLoading(false);
    setError(msg);
  };

  const handleImageLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const formStyle   = useFormStyle();
  const uploadimage = useUploadImageStyle();

  const hasFiles = files.length > 0;

  return (
    <View>
      {!!label && <Text style={formStyle.labelTitle}>{label}</Text>}

      <View style={uploadimage.uploadImageContainer}>
        {/*
         * renderTrigger mode:
         *   – The picker is always mounted (so openPicker is always available).
         *   – The default dashed-border UI is suppressed via renderTrigger.
         *   – FileViewer is shown separately below when files exist.
         *
         * Default mode (no renderTrigger):
         *   – Show the dashed-border picker only when no file is selected.
         *   – FileViewer is shown alongside it.
         */}
        <CustomDocumentPicker
          onSelect={onSelect}
          type={type}
          maxImages={maxImages}
          multiple={multiple}
          images={files}
          handleError={handleError}
          maxSize={maxSize}
          disabled={disabled}
          handleImageLoading={handleImageLoading}
          renderTrigger={renderTrigger}
        />

        {/* Default mode: hide picker once a file is picked; FileViewer takes over */}
        {!renderTrigger && hasFiles && (
          <FileViewer
            filesData={files}
            removeFile={handleRemoveFile}
            loading={loading}
            handleError={handleError}
            disabled={disabled}
          />
        )}
      </View>

      {/* renderTrigger mode: file preview rendered below the trigger button */}
      {renderTrigger && hasFiles && (
        <View style={[uploadimage.uploadImageContainer, { marginTop: 12 }]}>
          <FileViewer
            filesData={files}
            removeFile={handleRemoveFile}
            loading={loading}
            handleError={handleError}
            disabled={disabled}
          />
        </View>
      )}

      <ErrorMessageContainer message={error} />
    </View>
  );
};

export default CustomDocumentWrapper;
