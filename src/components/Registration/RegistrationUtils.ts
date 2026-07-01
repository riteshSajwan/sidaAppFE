import { FORMAT, IDocumentField } from '../ArchitectDetails/DocumentUploads/DocumentUploadsUtils';

// ─── Registration mode ────────────────────────────────────────────────────────

export type RegistrationMode = 'structural' | 'privateArchitect';

// ─── Attachment fields ────────────────────────────────────────────────────────

export type Role = {
  title: string;
  color: string;
  icon: string;
  route: string;
};
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

// ─── Combined form interface ──────────────────────────────────────────────────
// All fields from both modes. Mode-specific fields are optional.

export interface IRegistrationForm {
  // ── Personal (shared) ──
  firstName: string;
  middleName: string;
  lastName: string;
  father: string;
  spouse: string;
  fatherName: string;
  // ── Contact (shared) ──
  mailingAddress: string;
  state: string;
  district: string;
  tehsil: string;
  cityVillage: string;
  pinCode: string;
  mobileNumber: string;
  email: string;
  // ── Contact: Structural-only ──
  authority: string;
  // ── Contact: Private Architect-only ──
  cityVillageOther: string;
  regAuthority: string;
  // ── Organisation (Structural-only) ──
  organisationName: string;
  // ── Professional (Structural-only) ──
  qualification: string;
  // ── Registration (shared) ──
  regLicenseNo: string;
  validity: string;
  // ── Registration: Structural-only ──
  yearsOfExperience: string;
  grade: string;
  // ── Registration: Private Architect-only ──
  appType: string;
  noOfYears: string;
  // ── Education (Private Architect-only) ──
  instituteName: string;
  yearOfPassing: string;
  // ── Declaration (shared) ──
  declared: boolean;
}



export const INITIAL_FORM: IRegistrationForm = {
  firstName: '', middleName: '', lastName: '',
  father: '', spouse: '', fatherName: '',
  mailingAddress: '', state: '', district: '',
  tehsil: '', cityVillage: '', pinCode: '',
  mobileNumber: '', email: '',
  authority: '',
  cityVillageOther: '', regAuthority: '',
  organisationName: '',
  qualification: '',
  regLicenseNo: '', validity: '',
  yearsOfExperience: '', grade: '',
  appType: '', noOfYears: '',
  instituteName: '', yearOfPassing: '',
  declared: false,
};
