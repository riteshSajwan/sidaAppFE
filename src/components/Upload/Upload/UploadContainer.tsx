import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IBlobType, IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import CustomDocumentWrapper from 'src/common/components/CustomDocumentWrapper/CustomDocumentWrapper';
// import CustomDocumentPicker from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IMasterDataOption } from 'src/common/service/masterData/slice';
import { DXF_FILE_SIZE_BYTES } from 'src/constants';
import {
  IOption,
  isIndustriesCategory,
  IUploadContainerProps,
} from './UploadContainerUtils';

// ─── Option helpers ────────────────────────────────────────────────────────────
const toDropdownOptions = (
  items: IMasterDataOption[] | undefined,
  placeholder: string,
): IOption[] => [
  { label: placeholder, value: '' },
  ...(items ?? []).map((item) => ({ label: item.name, value: item.code })),
];

const DXF_TYPES = [
  'application/dxf',
  'image/vnd.dxf',
  'application/x-dxf',
  'drawing/x-dxf',
];

// ─── Component ────────────────────────────────────────────────────────────────
const UploadContainer = ({
  form,
  setForm,
  uploadedFiles,
  setUploadedFiles,
  infoError,
  setInfoError,
  buildingData,
}: IUploadContainerProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout    = useLayoutStyle();
  const formStyle = useFormStyle();
  const button    = useButtonStyle();
  const { theme } = useAppTheme();

  const categoryOptions = useMemo(
    () => toDropdownOptions(buildingData.buildingTypes, 'Select Category'),
    [buildingData.buildingTypes],
  );

  const subCategoryOptions = useMemo(
    () =>
      toDropdownOptions(
        buildingData.buildingSubTypes.filter(
          (subType) => subType.buildingTypeCode === form.category.value,
        ),
        'Select Sub-Category',
      ),
    [buildingData.buildingSubTypes, form.category.value],
  );

  const terrainOptions = useMemo(
    () => toDropdownOptions(buildingData.terrains, 'Select File Type'),
    [buildingData.terrains],
  );

  const locationOptions = useMemo(
    () => toDropdownOptions(buildingData.locationContexts, 'Select Location'),
    [buildingData.locationContexts],
  );

  const showLocation = isIndustriesCategory(form.category.value);

  // Picker-level error is now managed inside CustomDocumentWrapper

  // ── File handlers ─────────────────────────────────────────────────────────

  const resetErrorMsg = (fieldName: string = '') => {
    if (fieldName) {
      setInfoError((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleFileSelect = (_blobs: IBlobType, results: IFilesData[]) => {
    resetErrorMsg('file');
    setUploadedFiles(results);
  };

  // handleRemoveFile receives the index from FileViewer; we clear all files
  const handleRemoveFile = (_index: number) => {
    setUploadedFiles([]);
  };

  // Separate handler for the Remove Pressable button (no index needed)
  const handleRemoveAll = () => {
    setUploadedFiles([]);
  };

  // ── Dropdown handlers ─────────────────────────────────────────────────────

  const handleCategoryChange = (item: IOption) => {
    resetErrorMsg('category');
    resetErrorMsg('subCategory');
    resetErrorMsg('location');
    setForm((prev) => ({
      ...prev,
      category: { label: item.label ?? '', value: String(item.value ?? '') },
      subCategory: { label: 'Select Sub-Category', value: '' },
      location: { label: 'Select Location', value: '' },
    }));
  };

  const handleSubCategoryChange = (item: IOption) => {
    resetErrorMsg('subCategory');
    setForm((prev) => ({
      ...prev,
      subCategory: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleTerrainChange = (item: IOption) => {
    resetErrorMsg('terrain');
    setForm((prev) => ({
      ...prev,
      terrain: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  const handleLocationChange = (item: IOption) => {
    resetErrorMsg('location');
    setForm((prev) => ({
      ...prev,
      location: { label: item.label ?? '', value: String(item.value ?? '') },
    }));
  };

  // ── Render helpers ────────────────────────────────────────────────name────

  function renderErrorMsg(error: string) {
    if (error) return <ErrorMessageContainer message={error} />;
    return null;
  }

  function renderUploadSection() {
    const uploaded   = uploadedFiles.length > 0;
    const fieldError = infoError.file;

    return (
      <View style={uploadSectionStyle.container}>
        <Typography variant="subHeading" spacing={{ bottom: 4 }}>
          {TranslateMessage('Admin.Sida.App.Upload.UploadFile')}
        </Typography>
        <Typography variant="body" color={theme.colors.textBodyLight} spacing={{ bottom: 16 }}>
          {TranslateMessage('Admin.Sida.App.Upload.UploadFileSubtitle')}
        </Typography>

        {/*
         * CustomDocumentWrapper wraps CustomDocumentPicker + FileViewer together.
         * renderTrigger replaces the default dashed-border UI with a styled
         * Upload / Re-upload button; the FileViewer preview renders below it
         * automatically when files are present.
         */}
        <CustomDocumentWrapper
          files={uploadedFiles}
          onSelect={handleFileSelect}
          handleRemoveFile={handleRemoveFile}
          multiple={false}
          maxImages={1}
          type={DXF_TYPES}
          maxSize={DXF_FILE_SIZE_BYTES}
          renderTrigger={(openPicker) => (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Pressable
                onPress={openPicker}
                style={[
                  button.btnBase,
                  uploaded ? button.btnOutlinePrimary : button.btnPrimary,
                ]}
              >
                <Text style={uploaded ? button.btnOutlinePrimary : button.btnPrimary}>
                  {uploaded
                    ? TranslateMessage('Admin.Sida.App.DocumentUpload.ReUpload')
                    : TranslateMessage('Admin.Sida.App.DocumentUpload.Upload')}
                </Text>
              </Pressable>

              {uploaded && (
                <Pressable
                  onPress={handleRemoveAll}
                  style={[button.btnBase, button.btnOutlineDanger]}
                >
                  <Text style={button.btnOutlineDanger}>
                    {TranslateMessage('Admin.Delivery.App.Remove')}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        />

        {renderErrorMsg(fieldError)}
      </View>
    );
  }

  function renderDropdownField(
    label: string,
    data: IOption[],
    selectedValue: IOption,
    onChange: (item: IOption) => void,
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
          categoryOptions,
          form.category,
          handleCategoryChange,
        )}
        {renderErrorMsg(infoError.category)}

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.SubCategory'),
          subCategoryOptions,
          form.subCategory,
          handleSubCategoryChange,
        )}
        {renderErrorMsg(infoError.subCategory)}

        {renderDropdownField(
          TranslateMessage('Admin.Sida.App.Upload.FileType'),
          terrainOptions,
          form.terrain,
          handleTerrainChange,
        )}
        {renderErrorMsg(infoError.terrain)}

        {showLocation && (
          <>
            {renderDropdownField(
              TranslateMessage('Admin.Sida.App.Upload.Location'),
              locationOptions,
              form.location,
              handleLocationChange,
            )}
            {renderErrorMsg(infoError.location)}
          </>
        )}
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

        {/* Vertical divider */}
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
  container: { flex: 1, padding: 16 },
} as const;

const dropdownSectionStyle = {
  container: { flex: 1, padding: 16 },
} as const;

export default UploadContainer;
