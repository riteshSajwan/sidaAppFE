import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { DXF_FILE_SIZE_BYTES } from 'src/constants';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { IUploadFormState, IOption } from './UploadContainerUtils';


// ─── Static option lists (replace with API-driven data as needed) ────────────
const CATEGORY_OPTIONS: IOption[] = [
  { label: 'Select Category', value: '' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
  { label: 'Human Resources', value: 'hr' },
];

const SUB_CATEGORY_OPTIONS: IOption[] = [
  { label: 'Select Sub-Category', value: '' },
  { label: 'Invoices', value: 'invoices' },
  { label: 'Reports', value: 'reports' },
  { label: 'Contracts', value: 'contracts' },
];

const FILE_TYPE_OPTIONS: IOption[] = [
  { label: 'Select File Type', value: '' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Excel', value: 'excel' },
  { label: 'CSV', value: 'csv' },
  { label: 'Image', value: 'image' },
];

// ─── Initial state ────────────────────────────────────────────────────────────
const generateInitialState = (): IUploadFormState => ({
  category: { label: 'Select Category', value: '' },
  subCategory: { label: 'Select Sub-Category', value: '' },
  fileType: { label: 'Select File Type', value: '' },
});

// ─── Component ────────────────────────────────────────────────────────────────
const UploadContainer = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();

  const [form, setForm] = useState<IUploadFormState>(generateInitialState());
  const [uploadedFiles, setUploadedFiles] = useState<IFilesData[]>([]);
  const [uploadError, setUploadError] = useState<string>('');

  // ── Handlers ──────────────────────────────────────────────────────────────
  // const onSelectImage = (blobs: IBlobType, results: IFilesData[]) => {
  //   resetErrorMsg('imageUplodFieldError');
  //   const selectedImage = results[0];
  //   setImages(results)
  
  //   setSelectedBanner((prevState) => ({
  //     ...prevState,
  //     images: [selectedImage],
  //     file: selectedImage.fileName,
  //   }));
  // };
  const handleFileSelect = (_blobs: IBlobType, results: IFilesData[]) => {
    console.log("results",results)
    alert()
    setUploadedFiles(results)
  };

  const handleFileError = (error: string) => {
    setUploadError(error);
  };

  const handleFileLoading = (_loading: boolean) => {
    // extend with a Loader state if needed
  };

  const handleCategoryChange = (item: IMinuteOption) => {
    setForm((prev) => ({
      ...prev,
      category: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleSubCategoryChange = (item: IMinuteOption) => {
    setForm((prev) => ({
      ...prev,
      subCategory: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleFileTypeChange = (item: IMinuteOption) => {
    setForm((prev) => ({
      ...prev,
      fileType: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleRemoveFile = (_index: number) => {
    setUploadedFiles([]);
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  function renderUploadSection() {
    return (
      <View style={[uploadSectionStyle.container]}>
        <Typography variant="subHeading" spacing={{ bottom: 4 }}>
          {TranslateMessage('Admin.Sida.App.Upload.UploadFile')}
        </Typography>
        <Typography variant="body" color={theme.colors.textBodyLight} spacing={{ bottom: 16 }}>
          {TranslateMessage('Admin.Sida.App.Upload.UploadFileSubtitle')}
        </Typography>

        <CustomDocumentWrapper
          onSelect={handleFileSelect}
          files={uploadedFiles}
          handleRemoveFile={handleRemoveFile}
          multiple={false}
          // type = {}
          maxSize={DXF_FILE_SIZE_BYTES}
        />

        {/* Error message */}
        {uploadError !== '' && (
          <Text style={[formStyle.errorMessage, { marginTop: 8 }]}>
            {uploadError}
          </Text>
        )}
      </View>
    );
  }

  function renderDropdownField(
    label: string,
    data: IOption[],
    selectedValue: IOption,
    onChange: (item: IMinuteOption) => void,
  ) {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={[formStyle.labelTitle, layout.mb0, { marginBottom: 6 }]}>
          {label}
        </Text>
        <Customdropdown
          data={data}
          selectedValue={selectedValue}
          onChange={onChange}
        />
      </View>
    );
  }

  function renderDropdownSection() {
    return (
      <View style={[dropdownSectionStyle.container]}>
        <Typography variant="subHeading" spacing={{ bottom: 16 }}>
          {TranslateMessage('Admin.Sida.App.Upload.FileDetails')}
        </Typography>

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.Category'),
          CATEGORY_OPTIONS,
          form.category,
          handleCategoryChange,
        )}

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.SubCategory'),
          SUB_CATEGORY_OPTIONS,
          form.subCategory,
          handleSubCategoryChange,
        )}

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.FileType'),
          FILE_TYPE_OPTIONS,
          form.fileType,
          handleFileTypeChange,
        )}
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <View style={[layout.flexDirectionRow, { gap: 24, flexWrap: 'wrap' }]}>
      {/* Left — file upload */}
      <View style={{ flex: 1, minWidth: 280 }}>
        {renderUploadSection()}
      </View>

      {/* Vertical divider (visible on wide screens) */}
      <View
        style={{
          width: 1,
          backgroundColor: theme.colors.borderDisabled,
          alignSelf: 'stretch',
        }}
      />

      {/* Right — dropdowns */}
      <View style={{ flex: 1, minWidth: 280 }}>
        {renderDropdownSection()}
      </View>
    </View>
  );
};

// ─── Inline section wrappers (thin, avoids extra style file) ─────────────────
const uploadSectionStyle = {
  container: {
    flex: 1,
    padding: 16,
  },
} as const;

const dropdownSectionStyle = {
  container: {
    flex: 1,
    padding: 16,
  },
} as const;

export default UploadContainer;
