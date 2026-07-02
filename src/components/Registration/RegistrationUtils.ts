import { FORMAT, IDocumentField } from '../ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

// ─── Mode ─────────────────────────────────────────────────────────────────────

export type RegistrationMode = 'structural' | 'privateArchitect';

// ─── Form field config type ───────────────────────────────────────────────────

export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IFormField {
  key: keyof IRegistrationForm;
  /** Suffix after the i18n namespace prefix, e.g. 'FirstName' */
  labelKey: string;
  required?: boolean;
  /** Defaults to 'text' when omitted */
  fieldType?: 'text' | 'dropdown';
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  /** Required when fieldType === 'dropdown' */
  options?: IDropdownOption[];
}

// ─── Combined form interface ──────────────────────────────────────────────────

export interface IRegistrationForm {
  // Personal (shared)
  firstName: string;
  middleName: string;
  lastName: string;
  father: string;
  spouse: string;
  fatherName: string;
  // Contact (shared)
  mailingAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  pinCode: string;
  mobileNumber: string;
  email: string;
  // Contact: Structural-only
  authority: string;
  // Contact: Private Architect-only
  cityVillageOther: string;
  regAuthority: string;
  // Organisation (Structural-only)
  organisationName: string;
  // Professional (Structural-only)
  qualification: string;
  // Registration (shared)
  regLicenseNo: string;
  validity: string;
  // Registration: Structural-only
  yearsOfExperience: string;
  grade: string;
  // Registration: Private Architect-only
  appType: string;
  noOfYears: string;
  // Education (Private Architect-only)
  instituteName: string;
  yearOfPassing: string;
  // Declaration (shared)
  declared: boolean;
}

// ─── Shared dropdown option lists ────────────────────────────────────────────

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

export const GRADE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Grade', value: '' },
  { label: 'Grade A', value: 'A' },
  { label: 'Grade B', value: 'B' },
  { label: 'Grade C', value: 'C' },
];

export const APP_TYPE_OPTIONS: IDropdownOption[] = [
  { label: 'Select Application Type', value: '' },
  { label: 'New Registration', value: 'new' },
  { label: 'Renewal', value: 'renewal' },
  { label: 'Upgrade', value: 'upgrade' },
];

// ─── Field config arrays (rows of columns) ───────────────────────────────────
// Each inner array is one <View style={formStyle.formRow}>.
// The i18n namespace prefix is resolved in the component based on mode.

/** Personal section — identical for both modes */
export const SHARED_PERSONAL_FIELDS: IFormField[][] = [
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

/** Contact rows shared by both modes (no authority field yet) */
export const SHARED_CONTACT_FIELDS: IFormField[][] = [
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

/**
 * City/pin row differs: Private Arch adds a "Other City/Village" column.
 * Exported separately so the component can inject the extra field conditionally.
 */
export const CITY_ROW_BASE: IFormField[] = [
  { key: 'cityVillage', labelKey: 'City', fieldType: 'dropdown', options: CITY_VILLAGE_OPTIONS },
  { key: 'pinCode',     labelKey: 'Pincode', keyboardType: 'numeric' },
];
export const CITY_OTHER_FIELD: IFormField = {
  key: 'cityVillageOther', labelKey: 'CityOther',
};

/** Authority field — different key/label per mode, but same position */
export const STRUCTURAL_AUTHORITY_FIELD: IFormField = {
  key: 'authority', labelKey: 'Authority',
};
export const PRIVATE_ARCH_AUTHORITY_FIELD: IFormField = {
  key: 'regAuthority', labelKey: 'RegAuthority',
};

/** Structural-only: org + professional + reg extras */
export const STRUCTURAL_ONLY_FIELDS: IFormField[][] = [
  // Organisation
  [{ key: 'organisationName', labelKey: 'OrgName', required: true }],
  // Professional
  [{ key: 'qualification', labelKey: 'Qualification', required: true }],
  // Registration extras
  [
    { key: 'yearsOfExperience', labelKey: 'YearsOfExperience', required: true, keyboardType: 'numeric' },
    { key: 'grade',             labelKey: 'Grade',             required: true, fieldType: 'dropdown', options: GRADE_OPTIONS },
  ],
];

/** Private Architect-only: reg extras + education */
export const PRIVATE_ARCH_ONLY_FIELDS: IFormField[][] = [
  // Registration extras
  [
    { key: 'appType',   labelKey: 'AppType',   required: true, fieldType: 'dropdown', options: APP_TYPE_OPTIONS },
    { key: 'noOfYears', labelKey: 'NoOfYears', keyboardType: 'numeric' },
  ],
  // Education
  [
    { key: 'instituteName', labelKey: 'InstituteName', required: true },
    { key: 'yearOfPassing', labelKey: 'YearOfPassing', required: true, keyboardType: 'numeric' },
  ],
];

/** Shared registration row (RegLicenseNo + Validity) */
export const SHARED_REG_FIELDS: IFormField[] = [
  { key: 'regLicenseNo', labelKey: 'RegLicenseNo', required: true },
  { key: 'validity',     labelKey: 'Validity',     required: true },
];

// ─── INITIAL_FORM — derived from all field configs ───────────────────────────

// ─── Initial state ────────────────────────────────────────────────────────────

const ALL_FIELD_KEYS: Array<keyof IRegistrationForm> = [
  ...SHARED_PERSONAL_FIELDS.flat().map((f) => f.key),
  ...SHARED_CONTACT_FIELDS.flat().map((f) => f.key),
  CITY_ROW_BASE[0].key, CITY_ROW_BASE[1].key,
  CITY_OTHER_FIELD.key,
  STRUCTURAL_AUTHORITY_FIELD.key,
  PRIVATE_ARCH_AUTHORITY_FIELD.key,
  ...STRUCTURAL_ONLY_FIELDS.flat().map((f) => f.key),
  ...PRIVATE_ARCH_ONLY_FIELDS.flat().map((f) => f.key),
  ...SHARED_REG_FIELDS.map((f) => f.key),
];

export const INITIAL_FORM: IRegistrationForm = ALL_FIELD_KEYS.reduce(
  (acc, key) => ({ ...acc, [key]: '' }),
  { declared: false } as IRegistrationForm,
);

// ─── Error state type and factory ─────────────────────────────────────────────

export type IRegistrationFormErrors = Partial<Record<keyof IRegistrationForm, string>> & {
  apiError: string;
};

export function generateInitialFormErrors(): IRegistrationFormErrors {
  return {
    apiError: '',
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface IRegistrationValidationResult {
  isValid: boolean;
  errors: IRegistrationFormErrors;
}

/**
 * Validates registration form based on mode and field config.
 * Returns both isValid flag and populated errors object.
 */
export function validateRegistrationForm(
  form: IRegistrationForm,
  mode: RegistrationMode,
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

  const isPrivateArch = mode === 'privateArchitect';

  // Build required field list from config arrays
  const requiredFields: Array<[keyof IRegistrationForm, string]> = [
    ...SHARED_PERSONAL_FIELDS.flat()
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...SHARED_CONTACT_FIELDS.flat()
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...SHARED_REG_FIELDS
      .filter((f) => f.required)
      .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)]),
    ...(isPrivateArch
      ? PRIVATE_ARCH_ONLY_FIELDS.flat()
          .filter((f) => f.required)
          .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)])
      : STRUCTURAL_ONLY_FIELDS.flat()
          .filter((f) => f.required)
          .map((f): [keyof IRegistrationForm, string] => [f.key, tField(f.labelKey)])
    ),
  ];

  requiredFields.forEach(([key, label]) => req(key, label));

  // Declaration checkbox
  if (!form.declared) {
    errors.declared = tField('Required', { field: 'Declaration' });
    isValid = false;
  }

  return { isValid, errors };
}

// ─── Attachment fields ────────────────────────────────────────────────────────

export const STRUCTURAL_REGISTRATION_ATTACHMENT_FIELDS: IDocumentField[] = [
  {
    key: 'identity',
    labelKey: 'Admin.Sida.App.Registration.Attach1',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'photo',
    labelKey: 'Admin.Sida.App.Registration.Attach2',
    required: true,
    allowedTypes: [...FORMAT.IMAGE],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'photoId',
    labelKey: 'Admin.Sida.App.Registration.Attach3',
    required: true,
    allowedTypes: [...FORMAT.IMAGE, ...FORMAT.PDF],
    maxSizeBytes: 5 * 1024 * 1024,
  },
  {
    key: 'experienceCert',
    labelKey: 'Admin.Sida.App.Registration.Attach4',
    required: false,
    allowedTypes: [...FORMAT.PDF],
    maxSizeBytes: 10 * 1024 * 1024,
  },
  {
    key: 'workAssignment',
    labelKey: 'Admin.Sida.App.Registration.Attach5',
    required: false,
    allowedTypes: [...FORMAT.PDF],
    maxSizeBytes: 10 * 1024 * 1024,
  },
];

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
