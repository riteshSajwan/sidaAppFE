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
  parameters: string | null;
  permissable: string | null;
  provided: string | null;
  status: string | null;
  // emergencyContactDto?: IPreviewEmergencyContact | null;
}

export interface ReportListingTableProps {
  data: IPreviewDriverRow[];
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}
