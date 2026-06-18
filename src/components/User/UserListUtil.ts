import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';

export interface IUser {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  roleId: number;
  roleName: string;
  activeStatus: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdByUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string | null;
  } | null;
  updatedByUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string | null;
  } | null;
}

export interface IUserListResponse {
  data: IUser[];
  total: number;
  page: number;
  size: number;
}

export interface IUserListFilter {
  searchKey?: string;
  sortField: string;
  sortOrder: string;
  status?: string;
  createdAt?: DateType | null;
  isActive: string;
  roleId?: number | null;
}

export interface IUserListTempFilter {
  status: string;
  searchKey: string;
  createdAt: DateType | null;
  isActive: string;
  roleId: number | null;
}

export function generateUserListData(): IUserListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE,
  };
}

export function generateInitialFilterData(): IUserListFilter {
  return {
    status: '',
    createdAt: null,
    searchKey: '',
    sortField: '',
    sortOrder: '',
    isActive: '',
    roleId: null,
  };
}

export function generateInitialTempFilterData(): IUserListTempFilter {
  return {
    status: '',
    searchKey: '',
    createdAt: null,
    isActive: '',
    roleId: null,
  };
}
