import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';


interface IRateTierList {
  id: number;
  cityId: number;
  cityName: string;
  countryId: number;
  countryName: string;
  vehicleType: string;
  vehicleCategory: string;
  basePrice: number;
  pricePerKm: number;
  cancellationChargesPercentage: number;
  deleted: boolean;
  activeStatus: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}


interface IRateTierListResponse {
  data: IRateTierList[];
  total: number;
  page: number;
  size: number;
}


function generateRateTierListData(): IRateTierListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE
  };
}




export {
    generateRateTierListData,
    IRateTierList, IRateTierListResponse
};

