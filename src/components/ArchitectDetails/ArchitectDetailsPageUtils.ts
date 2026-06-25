import type { Dispatch, SetStateAction } from 'react';
import { translateMessage } from 'src/i18n/createTranslation';

type IFilesData = {
  label: string;
  value: string;
};

interface IDocumentFilesState {
  [key: string]: IFilesData | null;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IFormData {
  district: IOption;
  tehsil: IOption;
  authority: IOption;
  sector: IOption;
  areaType: IOption;
  khasra: string;
  pincode: string;
}

export interface IArchitectDetailsRequestDto {
  district: string;
  tehsil: string;
  authority: string;
  sector: string;
  areaType: string;
  khasra: number;
  pincode: string;
}

export type IFormErrors = Record<keyof IFormData, string> & { apiError: string };

export interface IFormInputFieldDto {
  key: keyof IFormData;
  labelKey: string;
  placeholderKey: string;
  required: boolean;
  fieldType: 'dropdown' | 'numberInput';
  options?: IOption[];
  maxLength?: number;
}

export interface IFormInputsProps {
  form: IFormData;
  setForm: Dispatch<SetStateAction<IFormData>>;
  errors: IFormErrors;
  setErrors: Dispatch<SetStateAction<IFormErrors>>;
}

export function generateInitialForm(): IFormData {
  return {
    district: { label: 'Select District', value: '' },
    tehsil: { label: 'Select Tehsil', value: '' },
    authority: { label: 'Select Authority', value: '' },
    sector: { label: 'Select Sector', value: '' },
    areaType: { label: 'Select Area Type', value: '' },
    khasra: '',
    pincode: '',
  };
}

export function generateInitialFormErrors(): IFormErrors {
  return {
    district: '',
    tehsil: '',
    authority: '',
    sector: '',
    areaType: '',
    khasra: '',
    pincode: '',
    apiError: '',
  };
}

const DISTRICT_OPTIONS: IOption[] = [
  { label: 'Select District', value: '' },
  { label: 'District 1', value: 'district1' },
  { label: 'District 2', value: 'district2' },
];

const TEHSIL_OPTIONS: IOption[] = [
  { label: 'Select Tehsil', value: '' },
  { label: 'Tehsil 1', value: 'tehsil1' },
  { label: 'Tehsil 2', value: 'tehsil2' },
];

const AUTHORITY_OPTIONS: IOption[] = [
  { label: 'Select Authority', value: '' },
  { label: 'Authority 1', value: 'authority1' },
  { label: 'Authority 2', value: 'authority2' },
];

const SECTOR_OPTIONS: IOption[] = [
  { label: 'Select Sector', value: '' },
  { label: 'Sector 1', value: 'sector1' },
  { label: 'Sector 2', value: 'sector2' },
];

const AREA_TYPE_OPTIONS: IOption[] = [
  { label: 'Select Area Type', value: '' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
];

export const ARCHITECT_DETAILS_FORM_FIELDS: IFormInputFieldDto[] = [
  {
    key: 'district',
    labelKey: 'Admin.Sida.App.ArchitectDetails.District',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.SelectDistrict',
    required: true,
    fieldType: 'dropdown',
    options: DISTRICT_OPTIONS,
  },
  {
    key: 'tehsil',
    labelKey: 'Admin.Sida.App.ArchitectDetails.Tehsil',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.SelectTehsil',
    required: true,
    fieldType: 'dropdown',
    options: TEHSIL_OPTIONS,
  },
  {
    key: 'authority',
    labelKey: 'Admin.Sida.App.ArchitectDetails.Authority',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.SelectAuthority',
    required: true,
    fieldType: 'dropdown',
    options: AUTHORITY_OPTIONS,
  },
  {
    key: 'sector',
    labelKey: 'Admin.Sida.App.ArchitectDetails.Sector',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.SelectSector',
    required: true,
    fieldType: 'dropdown',
    options: SECTOR_OPTIONS,
  },
  {
    key: 'areaType',
    labelKey: 'Admin.Sida.App.ArchitectDetails.AreaType',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.SelectAreaType',
    required: true,
    fieldType: 'dropdown',
    options: AREA_TYPE_OPTIONS,
  },
  {
    key: 'khasra',
    labelKey: 'Admin.Sida.App.ArchitectDetails.Khasra',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.EnterKhasra',
    required: true,
    fieldType: 'numberInput',
    maxLength: 12,
  },
  {
    key: 'pincode',
    labelKey: 'Admin.Sida.App.ArchitectDetails.Pincode',
    placeholderKey: 'Admin.Sida.App.ArchitectDetails.EnterPincode',
    required: true,
    fieldType: 'numberInput',
    maxLength: 6,
  },
];

export function validateArchitectDetailsForm(form: IFormData) {
  const errors = generateInitialFormErrors();
  let isValid = true;
  const numericRegex = /^\d+$/;

  for (const field of ARCHITECT_DETAILS_FORM_FIELDS) {
    const value = form[field.key];
    const label = translateMessage(field.labelKey);

    if (field.fieldType === 'dropdown') {
      const option = value as IOption;
      if (field.required && !option.value) {
        errors[field.key] = translateMessage(
          'Admin.Sida.App.ArchitectDetails.Error.Required',
          { label },
        );
        isValid = false;
      }
      continue;
    }

    const textValue = String(value ?? '').trim();
    if (field.required && !textValue) {
      errors[field.key] = translateMessage(
        'Admin.Sida.App.ArchitectDetails.Error.Required',
        { label },
      );
      isValid = false;
      continue;
    }

    if (textValue && !numericRegex.test(textValue)) {
      errors[field.key] = translateMessage(
        'Admin.Sida.App.ArchitectDetails.Error.Numeric',
        { label },
      );
      isValid = false;
      continue;
    }

    if (field.key === 'pincode' && textValue.length !== 6) {
      errors.pincode = translateMessage(
        'Admin.Sida.App.ArchitectDetails.Error.PincodeLength',
      );
      isValid = false;
    }
  }

  return { isValid, errors };
}

export function buildArchitectDetailsRequestDto(
  form: IFormData,
): IArchitectDetailsRequestDto {
  return {
    district: form.district.value,
    tehsil: form.tehsil.value,
    authority: form.authority.value,
    sector: form.sector.value,
    areaType: form.areaType.value,
    khasra: Number(form.khasra),
    pincode: form.pincode,
  };
}

export { IDocumentFilesState, IFilesData };

