import { TableRowBase } from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { translateMessage } from 'src/i18n/createTranslation';
export type DateType = Date | undefined;
export interface IMinuteOption {
    label: string;
    value: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

interface IBusiness extends TableRowBase {
  id:string,
  tenantId?: string;
  businessName: string;
  businessEmail:string;
  phoneNumber:string,
  fleetSize: number
  riderLimit:number;
  businessAddress:string;
  planId?: string | number;
  active?: boolean;
  activePlanId?: string | number;
  subscriptionStatus?: SubscriptionStatus | string;
}



interface IBusinessListFilter {
  searchKey?: string;
  sortField: string;
  sortOrder: string;
  status?: string;
  createdAt?: DateType | null;
  active:string
}

interface IBusinessListTempFilter {
  status: string;
  searchKey: string;
  createdAt: DateType | null;
  active:string
}

 interface IBusinessListResponse {
  data: IBusiness[];
  total: number;
  page: number;
  size: number;
}

function generateCouponListData(): IBusinessListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE
  };
}



function generateInitialFilterData(): IBusinessListFilter {
  return {
    status: '',
    createdAt: null,
    searchKey: '',
    sortField: '',
    sortOrder: '',
    active:''
  }
}

enum IBusinessStatusType {
  ACTIVE='TRUE',
  INACTIVE='FALSE',
}

function generateInitialTempFilterData(): IBusinessListTempFilter {
    return {
        status: '',
        searchKey: '',
        createdAt: null,
        active:''
    }
}

function BusinessStatusOptions() { 
  return[
  {
    label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.All'),
    value: '',
  },
  {
    label: translateMessage('Admin.Delivery.App.UserManagementList.Filter.Active'),
    value: IBusinessStatusType.ACTIVE,
  },
  {
    label: translateMessage('Admin.Delivery.App.UserManagementList.Filter.Inactive'),
    value: IBusinessStatusType.INACTIVE,
  },
];}


export {
    BusinessStatusOptions, generateCouponListData,
    generateInitialFilterData,
    generateInitialTempFilterData, IBusiness, IBusinessListFilter, IBusinessListResponse, IBusinessListTempFilter, IBusinessStatusType
};
  
