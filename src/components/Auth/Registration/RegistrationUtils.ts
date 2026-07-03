import { Dimensions } from 'react-native';
import { FORMAT, IDocumentField } from 'src/components/ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

// ─── UI constants ─────────────────────────────────────────────────────────────

export const ACCENT     = '#1a3fbd';
export const DARK_PANEL = '#0D2580';
export const IS_WIDE    = Dimensions.get('window').width >= 900;

export const STEPS = [
  { key: 'details',   label: 'Personal Details' },
  { key: 'documents', label: 'Documents' },
] as const;

export type StepKey = (typeof STEPS)[number]['key'];

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
  /** How many flex columns this field spans in its row (default 1) */
  span?: number;
}

// ─── Form interface ───────────────────────────────────────────────────────────

export interface IRegistrationForm {
  // Personal
  firstName:    string;
  middleName:   string;
  lastName:     string;
  fatherName:   string;
  // Contact
  mailingAddress: string;
  state:          string;
  district:       string;
  tehsil:         string;
  cityVillage:    string;
  pinCode:        string;
  mobileNumber:   string;
  email:          string;
  // Registration
  regLicenseNo: string;
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
  { label: 'Rajasthan',     value: 'RJ' },
];

export const DISTRICT_OPTIONS: IDropdownOption[] = [
  { label: 'Select District', value: '' },
  { label: 'District 1',      value: 'district1' },
  { label: 'District 2',      value: 'district2' },
];

export const TEHSIL_OPTIONS: IDropdownOption[] = [
  { label: 'Select Tehsil', value: '' },
  { label: 'Tehsil 1',      value: 'tehsil1' },
  { label: 'Tehsil 2',      value: 'tehsil2' },
];

export const CITY_VILLAGE_OPTIONS: IDropdownOption[] = [
  { label: 'Select City/Village', value: '' },
  { label: 'City 1',              value: 'city1' },
  { label: 'Other',               value: 'other' },
];

// ─── Section field configs (flat arrays) ─────────────────────────────────────

/** Personal Information — 3 name fields + Father's Name */
export const PERSONAL_FIELDS: IFormField[] = [
  { key: 'firstName',  labelKey: 'FirstName',  required: true },
  { key: 'middleName', labelKey: 'MiddleName' },
  { key: 'lastName',   labelKey: 'LastName',   required: true },
  { key: 'fatherName', labelKey: 'FatherName', required: true },
];

/** Contact Information */
export const CONTACT_FIELDS: IFormField[] = [
  { key: 'mailingAddress', labelKey: 'MailingAddress', span: 3 ,required: true },
  { key: 'state',    labelKey: 'State',    fieldType: 'dropdown', options: STATE_OPTIONS ,required: true },
  { key: 'district', labelKey: 'District', fieldType: 'dropdown', options: DISTRICT_OPTIONS ,required: true },
  { key: 'tehsil',   labelKey: 'Tehsil',   fieldType: 'dropdown', options: TEHSIL_OPTIONS ,required: true},
  { key: 'cityVillage', labelKey: 'City',    fieldType: 'dropdown', options: CITY_VILLAGE_OPTIONS,required: true },
  { key: 'pinCode',     labelKey: 'Pincode', keyboardType: 'numeric' ,required: true },
  { key: 'mobileNumber', labelKey: 'Mobile', required: true, keyboardType: 'phone-pad'  },
  { key: 'email',        labelKey: 'Email',  required: true, keyboardType: 'email-address'  },
];

/** Registration Details */
export const REGISTRATION_FIELDS: IFormField[] = [
  { key: 'regLicenseNo', labelKey: 'RegLicenseNo', required: true, span: 3 },
];

/** Education Information */
export const EDUCATION_FIELDS: IFormField[] = [
  { key: 'instituteName', labelKey: 'InstituteName', required: true },
  { key: 'yearOfPassing', labelKey: 'YearOfPassing', required: true, keyboardType: 'numeric' },
];

// ─── Initial form state ───────────────────────────────────────────────────────

const ALL_FIELD_KEYS: Array<keyof IRegistrationForm> = [
  ...PERSONAL_FIELDS.map((f) => f.key),
  ...CONTACT_FIELDS.map((f) => f.key),
  ...REGISTRATION_FIELDS.map((f) => f.key),
  ...EDUCATION_FIELDS.map((f) => f.key),
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
 * Validates Step 1 fields only.
 * Declaration is on Step 2 and is NOT checked here.
 */
export function validateRegistrationForm(
  form: IRegistrationForm,
  tField: (key: string, opts?: Record<string, string>) => string,
): IRegistrationValidationResult {
  const errors  = generateInitialFormErrors();
  let   isValid = true;

  const req = (key: keyof IRegistrationForm, label: string) => {
    const val = form[key];
    if (!val || (typeof val === 'string' && !val.trim())) {
      errors[key] = tField('Required', { field: label });
      isValid = false;
    }
  };

  const allRequired: Array<IFormField> = [
    ...PERSONAL_FIELDS,
    ...CONTACT_FIELDS,
    ...REGISTRATION_FIELDS,
    ...EDUCATION_FIELDS,
  ].filter((f) => f.required);

  allRequired.forEach((f) => req(f.key, tField(f.labelKey)));

  return { isValid, errors };
}

// ─── Attachment fields (5 per image) ─────────────────────────────────────────

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
    key: 'coaCertScanCopy',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach3',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'markSheetDegree',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach4',
    required: true,
    allowedTypes: [...FORMAT.PDF, ...FORMAT.IMAGE],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'latestPhoto',
    labelKey: 'Admin.Sida.App.PrivateArchReg.Attach5',
    required: true,
    allowedTypes: [...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
];
