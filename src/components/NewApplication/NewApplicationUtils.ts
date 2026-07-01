export interface IStep {
  key: string;
  label: string;
  icon: string;
}

export interface MultistepTimelineProps {
  steps: IStep[];
  currentStep: number; // 0-based index
}

// ─── Step form data types ──────────────────────────────────────────────────────

export interface IOwnerDetails {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  aadhaarNumber: string;
  residentialAddress: string;
}

export interface IPropertyDetails {
  propertyAddress: string;
  plotNumber: string;
  area: string;
  usage: string;
}

export interface IBuildingDetails {
  floors: string;
  buildingType: string;
  constructionArea: string;
}

export interface IFormData {
  property: IPropertyDetails;
  owner: IOwnerDetails;
  architect: { name: string; licenseNumber: string; email: string };
  building: IBuildingDetails;
}

export interface MultistepFormProps {
  currentStep: number;
  formData: IFormData;
  onChange: (
    section: keyof IFormData,
    field: string,
    value: string
  ) => void;
}



const INITIAL_FORM: IFormData = {
  property: { propertyAddress: '', plotNumber: '', area: '', usage: '' },
  owner: { fullName: '', mobileNumber: '', emailAddress: '', aadhaarNumber: '', residentialAddress: '' },
  architect: { name: '', licenseNumber: '', email: '' },
  building: { floors: '', buildingType: '', constructionArea: '' },
};

const STEPS: IStep[] = [
  { key: 'property',  label: 'Property Details',    icon: 'home' },
  { key: 'owner',     label: 'Owner Details',        icon: 'userOutline' },
  { key: 'architect', label: 'Architect / Engineer', icon: 'userCircle' },
  { key: 'building',  label: 'Building Details',     icon: 'building' },
  { key: 'documents', label: 'Documents',            icon: 'page' },
  { key: 'fee',       label: 'Fee Payment',          icon: 'coin' },
  { key: 'review',    label: 'Review & Submit',      icon: 'tick' },
];

// ─── Step titles shown in the form card header ─────────────────────────────────

export const STEP_TITLES = [
  'Property Details',
  'Owner Details',
  'Architect / Engineer',
  'Building Details',
  'Documents',
  'Fee Payment',
  'Review & Submit',
];

export { INITIAL_FORM, STEPS };

