export interface IPreviewEmergencyContact {
  id: number | null;
  fullName: string | null;
  phoneNumber: string | null;
  relationship: string | null;
  address: string | null;
  deleted: boolean;
}

export interface IPreviewDriverRow {
  id: number | null;
  firstName: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  dob: string | null;
  country: string | null;
  city: string | null;
  emergencyContactDto?: IPreviewEmergencyContact | null;
}

export interface DriverUploadPreviewTableProps {
  data: IPreviewDriverRow[];
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}
