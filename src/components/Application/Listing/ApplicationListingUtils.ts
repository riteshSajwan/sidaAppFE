// ─── Types ─────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | 'Under Review'
  | 'Approved'
  | 'Draft'
  | 'Objection Raised'
  | 'Rejected';

interface IApplicationRow {
  id: string;
  applicantName: string;
  buildingNo: string;
  submittedOn: string;
  buildingType: string;
  status: ApplicationStatus;
}

interface IOption {
  label: string;
  value: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; bg: string }> = {
  'Under Review': { color: '#2563EB', bg: '#EFF6FF' },
  Approved: { color: '#16A34A', bg: '#F0FDF4' },
  Draft: { color: '#6B7280', bg: '#F9FAFB' },
  'Objection Raised': { color: '#D97706', bg: '#FFFBEB' },
  Rejected: { color: '#DC2626', bg: '#FEF2F2' },
};

// ─── Static mock data (replace with Redux selectors / API calls) ───────────

const MOCK_APPLICATIONS: IApplicationRow[] = [
  { id: 'APP-2024-0048', applicantName: 'Rajan Sharma', buildingNo: 'Plot 10-B, Sector 22', submittedOn: '15 Jun 2024', buildingType: 'Building Permit', status: 'Under Review' },
  { id: 'APP-2024-0047', applicantName: 'Priya Verma', buildingNo: 'House 87, Ward 7', submittedOn: '25 Jun 2024', buildingType: 'Occupancy Certificate', status: 'Approved' },
  { id: 'APP-2024-0046', applicantName: 'Ramesh Kumar', buildingNo: 'Plot 45, Sector 5', submittedOn: '20 Jun 2024', buildingType: 'Map Approval', status: 'Draft' },
  { id: 'APP-2024-0045', applicantName: 'Anjali Singh', buildingNo: 'Plot H-12, Sector 21', submittedOn: '27 Jun 2024', buildingType: 'Building Permit', status: 'Objection Raised' },
  { id: 'APP-2024-0044', applicantName: 'Mohan Patel', buildingNo: 'House 22, Ward 3', submittedOn: '08 Jun 2024', buildingType: 'Property Registration', status: 'Approved' },
  { id: 'APP-2024-0043', applicantName: 'Kavita Rao', buildingNo: 'Plot 87, Sector 18', submittedOn: '20 Jun 2024', buildingType: 'Building Permit', status: 'Rejected' },
  { id: 'APP-2024-0042', applicantName: 'Kavita Rao', buildingNo: 'Plot 87, Sector 18', submittedOn: '20 Jun 2024', buildingType: 'Building Permit', status: 'Approved' },
  { id: 'APP-2024-0041', applicantName: 'Kavita Rao', buildingNo: 'Plot 87, Sector 18', submittedOn: '20 Jun 2024', buildingType: 'Building Permit', status: 'Approved' },
];

const DISTRICT_OPTIONS: IOption[] = [
  { label: 'All Districts', value: '' },
  { label: 'Dehradun', value: 'dehradun' },
  { label: 'Haridwar', value: 'haridwar' },
  { label: 'Nainital', value: 'nainital' },
];

const AREA_OPTIONS: IOption[] = [
  { label: 'All Areas', value: '' },
  { label: 'Sector 5', value: 'sector-5' },
  { label: 'Sector 18', value: 'sector-18' },
  { label: 'Sector 22', value: 'sector-22' },
];

const BUILDING_TYPE_OPTIONS: IOption[] = [
  { label: 'All Types', value: '' },
  { label: 'Building Permit', value: 'building-permit' },
  { label: 'Occupancy Certificate', value: 'occupancy-certificate' },
  { label: 'Map Approval', value: 'map-approval' },
  { label: 'Property Registration', value: 'property-registration' },
];

const STATUS_OPTIONS: IOption[] = [
  { label: 'Any Status', value: '' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Objection Raised', value: 'Objection Raised' },
  { label: 'Rejected', value: 'Rejected' },
];

export {
    AREA_OPTIONS,
    BUILDING_TYPE_OPTIONS,
    DISTRICT_OPTIONS, IApplicationRow,
    IOption, MOCK_APPLICATIONS, STATUS_CONFIG,
    STATUS_OPTIONS
};
