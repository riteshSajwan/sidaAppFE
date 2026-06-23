import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { DXF_FILE_SIZE_BYTES } from 'src/constants';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import {
  IOption,
  IUploadContainerProps,

} from './UploadContainerUtils';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';

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

// ─── Component ────────────────────────────────────────────────────────────────
const UploadContainer = ({
  form,
  setForm,
  uploadedFiles,
  setUploadedFiles,
  infoError,
  setInfoError,
}: IUploadContainerProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();

  const resetErrorMsg = (fieldName: string = '') => {
    if (fieldName) {
      setInfoError((prevState) => ({
        ...prevState,
        [fieldName]: '',
      }));
    } 
  };
 

  const handleFileSelect = (_blobs: IBlobType, results: IFilesData[]) => {
    resetErrorMsg('file');

    console.log("results",results)
    setUploadedFiles(results);
  };

  const handleCategoryChange = (item: IMinuteOption) => {
    resetErrorMsg('category');
    setForm((prev) => ({
      ...prev,
      category: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleSubCategoryChange = (item: IMinuteOption) => {
    resetErrorMsg('subCategory');
    setForm((prev) => ({
      ...prev,
      subCategory: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleTerrainChange = (item: IMinuteOption) => {
    resetErrorMsg('terrain');
    setForm((prev) => ({
      ...prev,
      terrain: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleRemoveFile = (_index: number) => {
    setUploadedFiles([]);
  };

  // ── Render helpers ────────────────────────────────────────────────────────
  function renderErrorMsg(error: string) {
    if (error) {
      return <ErrorMessageContainer message={error} />;
    }
    return null;
  }

  function renderUploadSection() {
    return (
      <View style={uploadSectionStyle.container}>
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
          maxImages={1}
          type={
            [
            ".dxf",
            "application/dxf",
            "image/vnd.dxf",
            "application/x-dxf",
            "drawing/x-dxf",
          ]
          }
          maxSize={DXF_FILE_SIZE_BYTES}
        />
        {renderErrorMsg(infoError.file)}

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
      <View style={dropdownSectionStyle.container}>
        <Typography variant="subHeading" spacing={{ bottom: 16 }}>
          {TranslateMessage('Admin.Sida.App.Upload.FileDetails')}
        </Typography>

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.Category'),
          CATEGORY_OPTIONS,
          form.category,
          handleCategoryChange,
        )}
        {renderErrorMsg(infoError.category)}
        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.SubCategory'),
          SUB_CATEGORY_OPTIONS,
          form.subCategory,
          handleSubCategoryChange,
        )}
        {renderErrorMsg(infoError.subCategory)}
        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.FileType'),
          FILE_TYPE_OPTIONS,
          form.terrain,
          handleTerrainChange,
        )}

        {renderErrorMsg(infoError.terrain)}
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <ScrollView>
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
    </ScrollView>
  );
};

// ─── Inline section wrappers ──────────────────────────────────────────────────
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
