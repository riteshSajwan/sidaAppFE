import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  ARCHITECT_DETAILS_FORM_FIELDS,
  IFormData,
  IFormInputFieldDto,
  IFormInputsProps,
  IOption,
} from '../ArchitectDetailsPageUtils';

const FormInputs = ({
  form,
  setForm,
  errors,
  setErrors,
}: IFormInputsProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const { theme } = useAppTheme();

  function clearError(key: keyof IFormData) {
    setErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function handleDropdownChange(key: keyof IFormData) {
    return (item: IOption) => {
      clearError(key);
      setForm((prev) => ({ ...prev, [key]: item }));
    };
  }

  function handleInputChange(key: keyof IFormData, maxLength?: number) {
    return (value: string) => {
      const numericValue = value.replace(/\D/g, '').slice(0, maxLength);
      clearError(key);
      setForm((prev) => ({ ...prev, [key]: numericValue }));
    };
  }

  function renderErrorMsg(error: string) {
    if (error) return <ErrorMessageContainer message={error} />;
    return null;
  }

  function renderLabel(field: IFormInputFieldDto) {
    return (
      <Text style={[formStyle.labelTitle, layout.mb0, { marginBottom: 6 }]}>
        {TranslateMessage(field.labelKey)}
        {field.required && <Text style={formStyle.asteriskTxt}> *</Text>}
      </Text>
    );
  }

  function renderDropdownField(field: IFormInputFieldDto) {
    const selectedValue = form[field.key] as IOption;
    const error = errors[field.key];

    return (
      <View key={field.key} style={formInputsStyle.field}>
        {renderLabel(field)}
        <Customdropdown
          data={field.options ?? []}
          selectedValue={selectedValue}
          onChange={handleDropdownChange(field.key)}
          error={error}
        />
        {renderErrorMsg(error)}
      </View>
    );
  }

  function renderNumberInputField(field: IFormInputFieldDto) {
    const value = String(form[field.key] ?? '');
    const error = errors[field.key];

    return (
      <View key={field.key} style={formInputsStyle.field}>
        {renderLabel(field)}
        <TextInput
          style={[formStyle.inputField, error && formStyle.errorBorderColor]}
          onChangeText={handleInputChange(field.key, field.maxLength)}
          value={value}
          placeholder={TranslateMessage(field.placeholderKey)}
          keyboardType="numeric"
          placeholderTextColor={theme.colors.textNeutral}
          mode="outlined"
          autoCapitalize="none"
          activeOutlineColor={theme.colors.borderErrorInverse}
          outlineColor={error ? theme.colors.borderErrorInverse : theme.colors.borderMedium}
          contentStyle={formStyle.inputPlaceholderLabel}
          maxLength={field.maxLength}
        />
        {renderErrorMsg(error)}
      </View>
    );
  }

  function renderField(field: IFormInputFieldDto) {
    if (field.fieldType === 'dropdown') return renderDropdownField(field);
    return renderNumberInputField(field);
  }

  return (
    <View style={[layout.cardBox, layout.tableContainer, formInputsStyle.container]}>
      <Typography variant="subHeading" spacing={{ bottom: 16 }}>
        {TranslateMessage('Admin.Sida.App.Upload.FileDetails')}
      </Typography>

      <View style={formInputsStyle.fieldsRow}>
        {ARCHITECT_DETAILS_FORM_FIELDS.map(renderField)}
      </View>
    </View>
  );
};

export default FormInputs;

const formInputsStyle = {
  container: {
    padding: 16,
  },
  fieldsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  field: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 240,
    minWidth: 220,
    marginBottom: 16,
  },
} as const;
