import { FORMAT, IDocumentField } from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

// ─── Form field config types ──────────────────────────────────────────────────

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IFormField {
  key: keyof IRegistrationForm;
  labelKey: string;
  required?: boolean;
  fieldType?: 'text' | 'dropdown';
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  options?: IDropdownOption[];
}

// ─── Form interface ───────────────────────────────────────────────────────────

export interface IRegistrationForm {
  // Personal
  firstName: string;
  middleName: string;
  lastName: string;
  father: string;
  spouse: string;
  fatherName: string;
  // Contact
  mailingAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  cityVillageOther: string;
  pinCode: string;
  mobileNumber: string;
  email: string;
  regAuthority: string;
  // Registration
  appType: string;
  noOfYears: string;
  regLicenseNo: string;
  validity: string;
  // Education
  instituteName: string;
  yearOfPassing: string;
  // Declaration
  declared: boolean;
}

// ─── Dropdown options ─────────────────────────────────────────────────────────

export const STATE_OPTIONS: IDropdownOption[] = [
  { label: 'Select State', value: '' },
  { label: 'Madhya Pradesh', value: 'MP' },
  { label: 'Uttar Pradesh', value: 'UP' },
  { label: 'Rajasthan', value: 'RJ' },
];

export const DISTRICT_OPTIONS: IDropdownOption[] = [
  { label: 'Select District', value: '' },
  { label: 'District 1', value: 'district1' },
  { label: 'District 2', value: 'district2' },
];

export const TEHSIL_OPTIONS: IDropdownOption[] = [
  { label: 'Select Tehsil', value: '' },
  { label: 'Tehsil 1', value: 'tehsil1' },
  { label: 'Tehsil 2', value: 'tehsil2' },
];

export const CITY_VILLAGE_OPTIONS: IDropdownOption[] = [
  { label: 'Select City/Village', value: '' },
  { label: 'City 1', value: 'city1' },
  { label: 'Other', value: 'other' },
];

export const APP_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Application Type', value: '' },
  { label: 'New Registration', value: 'new' },
  { label: 'Renewal', value: 'renewal' },
  { label: 'Upgrade', value: 'upgrade' },
];

// ─── Field configs ────────────────────────────────────────────────────────────

export const PERSONAL_FIELDS: IFormField[][] = [
  [
    { key: 'firstName',  labelKey: 'FirstName',  required: true },
    { key: 'middleName', labelKey: 'MiddleName' },
    { key: 'lastName',   labelKey: 'LastName',   required: true },
  ],
  [
    { key: 'father',     labelKey: 'Father' },
    { key: 'spouse',     labelKey: 'Spouse' },
    { key: 'fatherName', labelKey: 'FatherName', required: true },
  ],
];

export const CONTACT_FIELDS: IFormField[][] = [
  [
    { key: 'mailingAddress', labelKey: 'MailingAddress' },
  ],
  [
    { key: 'state',    labelKey: 'State',    fieldType: 'dropdown', options: STATE_OPTIONS },
    { key: 'district', labelKey: 'District', fieldType: 'dropdown', options: DISTRICT_OPTIONS },
    { key: 'tehsil',   labelKey: 'Tehsil',   fieldType: 'dropdown', options: TEHSIL_OPTIONS },
  ],
  [
    { key: 'mobileNumber', labelKey: 'Mobile', required: true, keyboardType: 'phone-pad' },
    { key: 'email',        labelKey: 'Email',  required: true, keyboardType: 'email-address' },
  ],
];

export const CITY_ROW_BASE: IFormField[] = [
  { key: 'cityVillage', labelKey: 'City', fieldType: 'dropdown', options: CITY_VILLAGE_OPTIONS },
  { key: 'pinCode',     labelKey: 'Pincode', keyboardType: 'numeric' },
];

export const CITY_OTHER_FIELD: IFormField = {
  key: 'cityVillageOther', labelKey: 'CityOther',
};

export const PRIVATE_ARCH_AUTHORITY_FIELD: IFormField = {
  key: 'regAuthority', labelKey: 'RegAuthority',
};

/** Registration extras (AppType + NoOfYears) and Education (InstituteName + YearOfPassing) */
export const PRIVATE_ARCH_ONLY_FIELDS: IFormField[][] = [
  [
    { key: 'appType',   labelKey: 'AppType',   required: true, fieldType: 'dropdown', options: APP_TYPE_OPTIONS },
    { key: 'noOfYears', labelKey: 'NoOfYears', keyboardType: 'numeric' },
  ],
  [
    { key: 'instituteName', labelKey: 'InstituteName', required: true },
    { key: 'yearOfPassing', labelKey: 'YearOfPassing', required: true, keyboardType: 'numeric' },
  ],
];

export const SHARED_REG_FIELDS: IFormField[] = [
  { key: 'regLicenseNo', labelKey: 'RegLicenseNo', required: true },
  { key: 'validity',     labelKey: 'Validity',     required: true },
];

// ─── Initial form state ───────────────────────────────────────────────────────

const ALL_FIELD_KEYS: Array<keyof IRegistrationForm> = [
  ...PERSONAL_FIELDS.flat().map((f) => f.key),
  ...CONTACT_FIELDS.flat().map((f) => f.key),
  CITY_ROW_BASE[0].key,
  CITY_ROW_BASE[1].key,
  CITY_OTHER_FIELD.key,
  PRIVATE_ARCH_AUTHORITY_FIELD.key,
  ...PRIVATE_ARCH_ONLY_FIELDS.flat().map((f) => f.key),
  ...SHARED_REG_FIELDS.map((f) => f.key),
];

export const INITIAL_FORM: IRegistrationForm = ALL_FIELD_KEYS.reduce(
  (acc, key) => ({ ...acc, [key]: '' }),
  { declared: false } as IRegistrationForm,
);

// ─── Error state ──────────────────────────────────────────────────────────────

export type IRegistrationFormErrors = Partial<Record<keyof IRegistrationForm, string>> & {
  apiError: string;
};

export function generateInitialFormErrors(): IRegistrationFormErrors {
  return { apiError: '' };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface IRegistrationValidationResult {
  isValid: boolean;
  errors: IRegistrationFormErrors;
}

/**
 * Validate Step 1 only (personal/contact/registration/education fields).
 * Does NOT check the declaration checkbox (that's on Step 2).
 */
export function validateRegistrationForm(
  form: IRegistrationForm,
  tField: (key: string, opts?: Record<string, string>) => string,
): IRegistrationValidationResult {
  const errors = generateInitialFormErrors();
  let isValid = true;

  const req = (key: keyof IRegistrationForm, label: string) => {
    const val = form[key];
    if (!val || (typeof val === 'string' && !val.trim())) {
      errors[key] = tField('Required', { field: label });
      isValid = false;
    }
  };

  const requiredFields: Array<[keyof IRegistrationForm, string]> = [
    ...PERSONAL_FIELDS.flat()
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...CONTACT_FIELDS.flat()
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...SHARED_REG_FIELDS
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...PRIVATE_ARCH_ONLY_FIELDS.flat()
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
  ];

  requiredFields.forEach(([key, label]) => req(key, label));

  // NOTE: Declaration is NOT validated here — it's on Step 2
  return { isValid, errors };
}

// ─── Attachment fields ────────────────────────────────────────────────────────

export const PRIVATE_ARCH_ATTACHMENT_FIELDS: IDocumentField[] = [
  {
    key: 'twelfthPassCert',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach1',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'aadharPassport',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach2',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'affidavit',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach3',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'anyOtherDoc',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach4',
    required: false,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE, ...FORMAT.DOCX],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'certScanCopy',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach5',
    required: false,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'highSchoolCert',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach6',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'markSheetDegree',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach7',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'latestPhoto',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach8',
    required: true,
    allowedTypes: [...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'photoId',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach9',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'annualFeeProof',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach10',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
];

// ─── UI constants ─────────────────────────────────────────────────────────────

import { Dimensions } from 'react-native';

export const ACCENT = '#1a3fbd';
export const DARK_PANEL = '#0D2580';
export const IS_WIDE = Dimensions.get('window').width >= 900;

export const STEPS = [
  { key: 'details',   label: 'Personal Details' },
  { key: 'documents', label: 'Documents' },
] as const;

export type StepKey = (typeof STEPS)[number]['key'];
