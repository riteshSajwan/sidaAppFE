import { FORMAT, IDocumentField } from '../ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

// ─── Mode ─────────────────────────────────────────────────────────────────────

export type RegistrationMode = 'structural' | 'privateArchitect';

// ─── Form field config type ───────────────────────────────────────────────────

export interface IFormField {
  key: keyof IRegistrationForm;
  /** Suffix after the i18n namespace prefix, e.g. 'FirstName' */
  labelKey: string;
  required?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
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
    { key: 'state',   labelKey: 'State' },
    { key: 'district', labelKey: 'District' },
    { key: 'tehsil',  labelKey: 'Tehsil' },
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
  { key: 'cityVillage', labelKey: 'City' },
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
    { key: 'grade',             labelKey: 'Grade',             required: true },
  ],
];

/** Private Architect-only: reg extras + education */
export const PRIVATE_ARCH_ONLY_FIELDS: IFormField[][] = [
  // Registration extras
  [
    { key: 'appType',   labelKey: 'AppType',   required: true },
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
