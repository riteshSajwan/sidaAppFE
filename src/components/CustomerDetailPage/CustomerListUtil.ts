import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { DateType } from 'src/components/Business/BusinessListUtils';

interface ICustomer {
    id: number,
    requestName: string,
    requestType: number,
    sellerName: string,
    activeStatus: RequestType,
    createdAt: string;
    renderViewDetails: boolean,
    profileUrl:string,
    email:string,
    phoneNumber:string,
    registrationDate:string,
    firstName:string,
    isBlocked: boolean,
    textsDisabled: boolean,
    emailsDisabled: boolean,

}

interface IUserListResponse {
    data: ICustomer[];
    page: number;
    size: number;
    total: number;
}

interface IUserListFilter {
    firstName:string;
    phoneNumber:string;
    activeStatus:string;
    email:string;
    searchKey: string;
    sortField: string;
    sortOrder: string;
    blockValue: string;
    type: string;
    createdAt: DateType | null;
    isBlocked: boolean
}

interface IUserListTempFilter {
    blockValue: string;
    createdAt: DateType | null;
    firstName: string;
    searchKey: string;
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

function generateUserListData(): IUserListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

function generateInitialFilterData(): IUserListFilter {
    return {
        firstName: '',
        searchKey: '',
        phoneNumber:'',
        activeStatus:'',
        email:'',
        sortField: 'requestName',
        sortOrder: 'desc',
        blockValue: '',
        createdAt: null,
        type: 'restaurant',
        isBlocked: false
    }
}

function generateInitialTempFilterData(): IUserListTempFilter {
    return {
        blockValue: '',
        createdAt: null,
        firstName: '',
        searchKey: '',
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
    totalRequest: 0,
    pendingRequest: 0,
    }
}



enum RequestApprovalList {
    Onboarding = 'Seller Onboarding Requests',
    DocumentApproval = 'Document Approval Requests',
    SellerCategoryTags = 'Category Tag Updates',
    FeaturedImages = 'Featured Image Updates',
    ServingTime = 'Serving Time Changes ',
}



export {
    ICustomer,
  IUserListResponse,
  IUserListFilter,
  IAprovalCountResponse,
  IUserListTempFilter,

  generateInitialTempFilterData,
  generateUserListData,
  generateInitialFilterData,
  generateInitialApprovalCountData,
  RequestApprovalList
};
