import type { Dispatch, SetStateAction } from 'react';
import {
  IDocumentErrors,
  IDocumentField,
  IDocumentFilesState,
} from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

export interface IStep {
  key: string;
  label: string;
  icon: string;
}

export interface MultistepTimelineProps {
  steps: IStep[];
  currentStep: number; // 0-based index
}

// ─── Shared field config types ─────────────────────────────────────────────────

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IFormField<T = Record<string, string>> {
  key: keyof T;
  label: string;
  required?: boolean;
  fieldType?: 'text' | 'dropdown';
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  options?: IDropdownOption[];
  placeholder?: string;
  maxLength?: number;
  /** How many grid columns (of 2) this field spans. Default 1. */
  span?: 1 | 2;
}

// ─── Step 0: Property Details ──────────────────────────────────────────────────

export interface IPropertyDetails {
  authority: string;
  planServiceType: string;
  planServiceSubType: string;
  planServiceSubSubType: string;
  areaType: string;
  sector: string;
  landUseType: string;
  landUseSubType: string;
  district: string;
  tehsil: string;
  siteLocation: string;
  khasraNumber: string;
  city: string;
  wardNumber: string;
  propertyNoKhasraNo: string;
  applicationNo: string;
  propertyAddress: string;
}

export const AUTHORITY_OPTIONS: IDropdownOption[] = [
  { label: 'Select Authority', value: '' },
  { label: 'Municipal Corporation', value: 'municipal_corporation' },
  { label: 'Urban Improvement Trust', value: 'urban_improvement_trust' },
  { label: 'Development Authority', value: 'development_authority' },
];

export const PLAN_SERVICE_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Plan / Service Type', value: '' },
  { label: 'Building Permission', value: 'building_permission' },
  { label: 'Layout Approval', value: 'layout_approval' },
  { label: 'Occupancy Certificate', value: 'occupancy_certificate' },
];

export const PLAN_SERVICE_SUB_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Plan / Service Sub Type', value: '' },
  { label: 'New Construction', value: 'new_construction' },
  { label: 'Addition & Alteration', value: 'addition_alteration' },
  { label: 'Reconstruction', value: 'reconstruction' },
];

export const PLAN_SERVICE_SUB_SUB_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Plan / Service Sub Sub Type', value: '' },
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Mixed Use', value: 'mixed_use' },
];

export const AREA_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Area Type', value: '' },
  { label: 'Urban', value: 'urban' },
  { label: 'Rural', value: 'rural' },
];

export const SECTOR_OPTIONS: IDropdownOption[] = [
  { label: 'Select Sector', value: '' },
  { label: 'Sector 17', value: 'sector_17' },
  { label: 'Sector 22', value: 'sector_22' },
  { label: 'Sector 35', value: 'sector_35' },
];

export const LAND_USE_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Land Use Type', value: '' },
  { label: 'Urban Local Body', value: 'urban_local_body' },
  { label: 'Rural Local Body', value: 'rural_local_body' },
];

export const LAND_USE_SUB_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Land Use Sub Type', value: '' },
  { label: 'City', value: 'city' },
  { label: 'Town', value: 'town' },
  { label: 'Village', value: 'village' },
];

export const DISTRICT_OPTIONS: IDropdownOption[] = [
  { label: 'Select District', value: '' },
  { label: 'District 1', value: 'district_1' },
  { label: 'District 2', value: 'district_2' },
];

export const TEHSIL_OPTIONS: IDropdownOption[] = [
  { label: 'Select Tehsil', value: '' },
  { label: 'Tehsil 1', value: 'tehsil_1' },
  { label: 'Tehsil 2', value: 'tehsil_2' },
];

export const SITE_LOCATION_OPTIONS: IDropdownOption[] = [
  { label: 'Select Site Location', value: '' },
  { label: 'Plot', value: 'plot' },
  { label: 'Building', value: 'building' },
];

export const CITY_OPTIONS: IDropdownOption[] = [
  { label: 'Select City', value: '' },
  { label: 'City 1', value: 'city_1' },
  { label: 'City 2', value: 'city_2' },
];

export const PROPERTY_FIELDS: IFormField<IPropertyDetails>[] = [
  { key: 'authority', label: 'Authority', required: true, fieldType: 'dropdown', options: AUTHORITY_OPTIONS },
  { key: 'planServiceType', label: 'Plan / Service Type', required: true, fieldType: 'dropdown', options: PLAN_SERVICE_TYPE_OPTIONS },
  { key: 'planServiceSubType', label: 'Plan / Service Sub Type', required: true, fieldType: 'dropdown', options: PLAN_SERVICE_SUB_TYPE_OPTIONS },
  { key: 'planServiceSubSubType', label: 'Plan / Service Sub Sub Type', required: true, fieldType: 'dropdown', options: PLAN_SERVICE_SUB_SUB_TYPE_OPTIONS },
  { key: 'areaType', label: 'Area Type (Terrain)', required: true, fieldType: 'dropdown', options: AREA_TYPE_OPTIONS },
  { key: 'sector', label: 'Sector', fieldType: 'dropdown', options: SECTOR_OPTIONS },
  { key: 'landUseType', label: 'Land Use Type', fieldType: 'dropdown', options: LAND_USE_TYPE_OPTIONS },
  { key: 'landUseSubType', label: 'Land Use Sub Type', fieldType: 'dropdown', options: LAND_USE_SUB_TYPE_OPTIONS },
  { key: 'district', label: 'District', fieldType: 'dropdown', options: DISTRICT_OPTIONS },
  { key: 'tehsil', label: 'Tehsil', fieldType: 'dropdown', options: TEHSIL_OPTIONS },
  { key: 'siteLocation', label: 'Site Location', fieldType: 'dropdown', options: SITE_LOCATION_OPTIONS },
  { key: 'khasraNumber', label: 'Khasra Number', placeholder: 'e.g. 125/1' },
  { key: 'city', label: 'City', fieldType: 'dropdown', options: CITY_OPTIONS },
  { key: 'wardNumber', label: 'Ward Number', placeholder: 'e.g. Ward 7' },
  { key: 'propertyNoKhasraNo', label: 'Property No/Khasra No', required: true, placeholder: 'e.g. Plot 12-B' },
  { key: 'applicationNo', label: 'Application No', required: true, placeholder: 'Application number of the fresh application' },
  { key: 'propertyAddress', label: 'Property Address', required: true, placeholder: 'Full address of the property' },
];

export const INITIAL_PROPERTY_DETAILS: IPropertyDetails = {
  authority: '',
  planServiceType: '',
  planServiceSubType: '',
  planServiceSubSubType: '',
  areaType: '',
  sector: '',
  landUseType: '',
  landUseSubType: '',
  district: '',
  tehsil: '',
  siteLocation: '',
  khasraNumber: '',
  city: '',
  wardNumber: '',
  propertyNoKhasraNo: '',
  applicationNo: '',
  propertyAddress: '',
};

// ─── Step 1: Applicant Details (Owners) ────────────────────────────────────────

export interface IOwner {
  id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  companyName: string;
  residentialAddress: string;
}

export interface IApplicantDetails {
  owners: IOwner[];
}

export const OWNER_FIELDS: IFormField<IOwner>[] = [
  { key: 'fullName', label: 'Full Name', required: true },
  { key: 'mobileNumber', label: 'Mobile Number', required: true, keyboardType: 'phone-pad', maxLength: 10 },
  { key: 'emailAddress', label: 'Email Address', keyboardType: 'email-address' },
  { key: 'companyName', label: 'Company Name', required: true },
  { key: 'residentialAddress', label: 'Residential Address', required: true, span: 2 },
];

let ownerIdCounter = 0;
export function createEmptyOwner(): IOwner {
  ownerIdCounter += 1;
  return {
    id: `owner_${Date.now()}_${ownerIdCounter}`,
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    companyName: '',
    residentialAddress: '',
  };
}

export const INITIAL_APPLICANT_DETAILS: IApplicantDetails = {
  owners: [createEmptyOwner()],
};

// ─── Step 2: Architect / Engineer ──────────────────────────────────────────────

export interface IArchitect {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  communicationAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  pinCode: string;
}

export const ARCHITECT_FIELDS: IFormField<IArchitect>[] = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'middleName', label: 'Middle Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true, span: 2 },
  { key: 'email', label: 'Email', required: true, keyboardType: 'email-address' },
  { key: 'phone', label: 'Phone', required: true, keyboardType: 'phone-pad', maxLength: 10 },
  { key: 'communicationAddress', label: 'Communication address', span: 2 },
  { key: 'state', label: 'State' },
  { key: 'district', label: 'District' },
  { key: 'tehsil', label: 'Tehsil' },
  { key: 'cityVillage', label: 'City/Village' },
  { key: 'pinCode', label: 'Pin Code', keyboardType: 'numeric', maxLength: 6, span: 2 },
];

export const INITIAL_ARCHITECT: IArchitect = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  communicationAddress: '',
  state: '',
  district: '',
  tehsil: '',
  cityVillage: '',
  pinCode: '',
};

// ─── Step 3: GIS Coordinates ───────────────────────────────────────────────────

export interface IGisCoordinates {
  longitude: string;
  latitude: string;
}

export const GIS_FIELDS: IFormField<IGisCoordinates>[] = [
  { key: 'longitude', label: 'Longitude', required: true, keyboardType: 'numeric' },
  { key: 'latitude', label: 'Latitude', keyboardType: 'numeric' },
];

export const INITIAL_GIS_COORDINATES: IGisCoordinates = {
  longitude: '',
  latitude: '',
};

// ─── Step 4: Documents ──────────────────────────────────────────────────────────

export const NEW_APPLICATION_DOCUMENT_FIELDS: IDocumentField[] = [
  {
    key: 'saleDeed',
    labelKey: 'Admin.Sida.App.NewApplication.Document.SaleDeed',
    required: true,
  },
  {
    key: 'possessionCertificate',
    labelKey: 'Admin.Sida.App.NewApplication.Document.PossessionCertificate',
    required: true,
  },
  {
    key: 'fireNoc',
    labelKey: 'Admin.Sida.App.NewApplication.Document.FireNoc',
    descriptionKey: 'Admin.Sida.App.NewApplication.Document.FireNoc.Desc',
    required: true,
  },
  {
    key: 'jalSansthan',
    labelKey: 'Admin.Sida.App.NewApplication.Document.JalSansthan',
    descriptionKey: 'Admin.Sida.App.NewApplication.Document.JalSansthan.Desc',
    required: true,
  },
  {
    key: 'powerCorporation',
    labelKey: 'Admin.Sida.App.NewApplication.Document.PowerCorporation',
    descriptionKey: 'Admin.Sida.App.NewApplication.Document.PowerCorporation.Desc',
    required: true,
  },
  {
    key: 'forestDepartment',
    labelKey: 'Admin.Sida.App.NewApplication.Document.ForestDepartment',
    descriptionKey: 'Admin.Sida.App.NewApplication.Document.ForestDepartment.Desc',
    required: true,
  },
  {
    key: 'pollutionControlBoard',
    labelKey: 'Admin.Sida.App.NewApplication.Document.PollutionControlBoard',
    descriptionKey: 'Admin.Sida.App.NewApplication.Document.PollutionControlBoard.Desc',
    required: true,
  },
  {
    key: 'labourDepartment',
    labelKey: 'Admin.Sida.App.NewApplication.Document.LabourDepartment',
    required: true,
  },
];

// ─── Combined form state ───────────────────────────────────────────────────────

export interface IFormData {
  property: IPropertyDetails;
  applicant: IApplicantDetails;
  architect: IArchitect;
  gis: IGisCoordinates;
}

const INITIAL_FORM: IFormData = {
  property: INITIAL_PROPERTY_DETAILS,
  applicant: INITIAL_APPLICANT_DETAILS,
  architect: INITIAL_ARCHITECT,
  gis: INITIAL_GIS_COORDINATES,
};

export interface MultistepFormProps {
  currentStep: number;
  formData: IFormData;
  formErrors: IFormErrors;
  onFieldChange: (section: 'property' | 'architect' | 'gis', field: string, value: string) => void;
  onOwnerChange: (ownerId: string, field: keyof IOwner, value: string) => void;
  onAddOwner: () => void;
  onRemoveOwner: (ownerId: string) => void;
  documentFiles: IDocumentFilesState;
  documentErrors: IDocumentErrors;
  documentPickerErrors: Record<string, string>;
  setDocumentFiles: Dispatch<SetStateAction<IDocumentFilesState>>;
  setDocumentErrors: Dispatch<SetStateAction<IDocumentErrors>>;
  setDocumentPickerErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

const STEPS: IStep[] = [
  { key: 'property',  label: 'Property Details',    icon: 'home' },
  { key: 'applicant', label: 'Owner Details',       icon: 'userOutline' },
  { key: 'architect', label: 'Architect / Engineer', icon: 'userCircle' },
  { key: 'gis',       label: 'GIS Coordinates',     icon: 'pinAlt' },
  { key: 'documents', label: 'Documents',            icon: 'page' },
  { key: 'fee',       label: 'Fee Payment',          icon: 'coin' },
  { key: 'upload',    label: 'Upload Map',           icon: 'page' },
  { key: 'result',    label: 'Result',               icon: 'tick' },
];

// ─── Step titles shown in the form card header ─────────────────────────────────

export const STEP_TITLES = [
  'Property Details',
  'Owner Details',
  'Architect / Engineer',
  'GIS Coordinates',
  'Documents',
  'Fee Payment',
  'Upload Map',
  'Review & Submit',
];

export { INITIAL_FORM, STEPS };

// ─── Errors ────────────────────────────────────────────────────────────────────

export type IPropertyDetailsErrors = Partial<Record<keyof IPropertyDetails, string>>;
export type IArchitectErrors = Partial<Record<keyof IArchitect, string>>;
export type IOwnerErrors = Partial<Record<keyof IOwner, string>>;
export type IGisCoordinatesErrors = Partial<Record<keyof IGisCoordinates, string>>;

export interface IFormErrors {
  property: IPropertyDetailsErrors;
  applicant: Record<string, IOwnerErrors>;
  architect: IArchitectErrors;
  gis: IGisCoordinatesErrors;
}

export function generateInitialFormErrors(): IFormErrors {
  return { property: {}, applicant: {}, architect: {}, gis: {} };
}

// ─── Regex helpers ──────────────────────────────────────────────────────────────

const MOBILE_IN_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_CODE_REGEX = /^\d{6}$/;

// ─── Validation ────────────────────────────────────────────────────────────────

export interface IValidationResult<E> {
  isValid: boolean;
  errors: E;
}

export function validatePropertyDetails(form: IPropertyDetails): IValidationResult<IPropertyDetailsErrors> {
  const errors: IPropertyDetailsErrors = {};
  let isValid = true;

  PROPERTY_FIELDS.forEach((field) => {
    if (!field.required) return;
    const val = form[field.key];
    if (!val || !val.trim()) {
      errors[field.key] = `${field.label} is required`;
      isValid = false;
    }
  });

  return { isValid, errors };
}

export function validateOwner(owner: IOwner): IOwnerErrors {
  const errors: IOwnerErrors = {};

  if (!owner.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  }

  if (!owner.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile Number is required';
  } else if (!MOBILE_IN_REGEX.test(owner.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid 10-digit mobile number';
  }

  if (owner.emailAddress.trim() && !EMAIL_REGEX.test(owner.emailAddress.trim())) {
    errors.emailAddress = 'Enter a valid email address';
  }

  if (!owner.companyName.trim()) {
    errors.companyName = 'Company Name is required';
  }

  if (!owner.residentialAddress.trim()) {
    errors.residentialAddress = 'Residential Address is required';
  }

  return errors;
}

export function validateApplicantDetails(applicant: IApplicantDetails): IValidationResult<Record<string, IOwnerErrors>> {
  const errors: Record<string, IOwnerErrors> = {};
  let isValid = true;

  applicant.owners.forEach((owner) => {
    const ownerErrors = validateOwner(owner);
    if (Object.keys(ownerErrors).length) {
      errors[owner.id] = ownerErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
}

export function validateArchitectDetails(form: IArchitect): IValidationResult<IArchitectErrors> {
  const errors: IArchitectErrors = {};
  let isValid = true;

  const fail = (key: keyof IArchitect, msg: string) => {
    errors[key] = msg;
    isValid = false;
  };

  ARCHITECT_FIELDS.forEach((field) => {
    if (!field.required) return;
    const val = form[field.key];
    if (!val || !val.trim()) fail(field.key, `${field.label} is required`);
  });

  if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim())) {
    fail('email', 'Enter a valid email address');
  }

  if (form.phone.trim() && !MOBILE_IN_REGEX.test(form.phone.trim())) {
    fail('phone', 'Enter a valid 10-digit mobile number');
  }

  if (form.pinCode.trim() && !PIN_CODE_REGEX.test(form.pinCode.trim())) {
    fail('pinCode', 'Pin code must be exactly 6 digits');
  }

  return { isValid, errors };
}

export function validateGisCoordinates(form: IGisCoordinates): IValidationResult<IGisCoordinatesErrors> {
  const errors: IGisCoordinatesErrors = {};
  let isValid = true;

  if (!form.longitude.trim()) {
    errors.longitude = 'Longitude is required';
    isValid = false;
  }

  return { isValid, errors };
}

// ─── DTOs (request shapes for a future submit API) ─────────────────────────────

export type IPropertyDetailsDto = IPropertyDetails;

export function mapPropertyDetailsToDto(form: IPropertyDetails): IPropertyDetailsDto {
  return {
    authority: form.authority,
    planServiceType: form.planServiceType,
    planServiceSubType: form.planServiceSubType,
    planServiceSubSubType: form.planServiceSubSubType,
    areaType: form.areaType,
    sector: form.sector,
    landUseType: form.landUseType,
    landUseSubType: form.landUseSubType,
    district: form.district,
    tehsil: form.tehsil,
    siteLocation: form.siteLocation,
    khasraNumber: form.khasraNumber.trim(),
    city: form.city,
    wardNumber: form.wardNumber.trim(),
    propertyNoKhasraNo: form.propertyNoKhasraNo.trim(),
    applicationNo: form.applicationNo.trim(),
    propertyAddress: form.propertyAddress.trim(),
  };
}

export interface IOwnerDto {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  companyName: string;
  residentialAddress: string;
}

export interface IApplicantDetailsDto {
  owners: IOwnerDto[];
}

export function mapOwnerToDto(owner: IOwner): IOwnerDto {
  return {
    fullName: owner.fullName.trim(),
    mobileNumber: owner.mobileNumber.trim() ? `+91${owner.mobileNumber.trim()}` : '',
    emailAddress: owner.emailAddress.trim(),
    companyName: owner.companyName.trim(),
    residentialAddress: owner.residentialAddress.trim(),
  };
}

export function mapApplicantDetailsToDto(applicant: IApplicantDetails): IApplicantDetailsDto {
  return { owners: applicant.owners.map(mapOwnerToDto) };
}

export interface IArchitectDto {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  communicationAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  pinCode: string;
}

export function mapArchitectToDto(form: IArchitect): IArchitectDto {
  return {
    firstName: form.firstName.trim(),
    middleName: form.middleName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() ? `+91${form.phone.trim()}` : '',
    communicationAddress: form.communicationAddress.trim(),
    state: form.state,
    district: form.district,
    tehsil: form.tehsil,
    cityVillage: form.cityVillage,
    pinCode: form.pinCode.trim(),
  };
}

export interface IGisCoordinatesDto {
  longitude: string;
  latitude: string;
}

export function mapGisCoordinatesToDto(form: IGisCoordinates): IGisCoordinatesDto {
  return {
    longitude: form.longitude.trim(),
    latitude: form.latitude.trim(),
  };
}
