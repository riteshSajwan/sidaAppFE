import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DateType } from 'src/components/Business/BusinessListUtils';

interface IDriver {
    id: number,
    requestName: string,
    requestType: number,
    sellerName: string,
    activeStatus: DriverType,
    renderViewDetails: boolean,
    profileUrl: string,
    email: string,
    phoneNumber: string,
    registrationNumber?: string,
    registrationDate: string,
    username: string,
    firstName: string,
    createdAt: string;
    riderVehicleRegistration: IRiderVehicleRegistration;
    vehicleCategory?: string;
    vehicleType?: string;
    isBlocked: boolean,
    textsDisabled: boolean,
    emailsDisabled: boolean,
    latitude: number | null;
    longitude: number | null;
    scheduledTimes?: string[];
}



interface IDriverListResponse {
    data: IDriver[];
    page: number;
    size: number;
    total: number;
}

interface IDriverListFilter {
    userName: string;
    phoneNumber: string;
    activeStatus: string;
    firstName: string,
    email: string;
    createdAt: DateType | null;
    sortField: string;
    searchKey: string;
    sortOrder: string;
    approvalRequestStatus: string;
    type: string;
    riderVehicleRegistration: { vehicleType: '' };
    isBlockedFilter: string;
    paymentMethod:string,
    country: string;
}
interface IRiderVehicleRegistration {
    vehicleType: string;
    registrationNumber?: string;
}
interface IDriverListTempFilter {
    approvalRequestStatus: string;
    searchKey: string;
    createdAt: DateType | null;
    riderVehicleRegistration: { vehicleType: '' };
    isBlockedFilter: string;
    paymentMethod:string
    country: string
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

function generateDriverListData(): IDriverListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

function generateInitialFilterData(): IDriverListFilter {
    return {
        userName: '',
        phoneNumber: '',
        activeStatus: '',
        email: '',
        sortField: 'requestName',
        sortOrder: 'asc',
        approvalRequestStatus: '',
        type: 'restaurant',
        createdAt: null,
        searchKey: '',
        firstName: '',
        riderVehicleRegistration: { vehicleType: '' },
        isBlockedFilter: '',
        paymentMethod:'',
        country:''

    }
}

function generateInitialTempFilterData(): IDriverListTempFilter {
    return {
        approvalRequestStatus: '',
        searchKey: '',
        createdAt: null,
        riderVehicleRegistration: { vehicleType: '' },
        isBlockedFilter: '',
        paymentMethod:'',
        country:''
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
        totalRequest: 0,
        pendingRequest: 0,
    }
}


enum DriverType {
    Active = 'Active',
    Block = 'Block',
}

interface IEarningsResponse {
    amount: number
    currency: string
    deliveryFee: number
    fee: number
    idempotencyKey: string
    mobile: string
    name: string
    paymentId: number
    role: string
    status: string
    tip: number
    userId: number
    wassawassaShare: number
  }

export {
    IEarningsResponse,
    IDriver,
    IDriverListResponse,
    IDriverListFilter,
    IAprovalCountResponse,
    IDriverListTempFilter,
    generateInitialTempFilterData,
    generateDriverListData,
    generateInitialFilterData,
    generateInitialApprovalCountData,
    DriverType
};
