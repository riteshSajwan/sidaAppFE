import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { TLocaleId } from 'src/i18n/localesTypes';

interface IRequest {
    id: number,
    requestName: string,
    requestType: number,
    sellerName: string,
    approvalRequestStatus: RequestType,
    createdAt: string;
    renderViewDetails: boolean,
}

interface IRequestListResponse {
    data: IRequest[];
    page: number;
    size: number;
    total: number;
}

interface IRequestListFilter {
    searchKey: string;
    sortField: string;
    sortOrder: string;
    approvalRequestStatus: string;
    type: string;
    createdAt: DateType | null;
}

interface IRequestListTempFilter {
    approvalRequestStatus: string;
    createdAt: DateType | null;
    searchKey: string;
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

function generateRequestListData(): IRequestListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

function generateInitialFilterData(): IRequestListFilter {
    return {
        searchKey: '',
        sortField: 'updationAt',
        sortOrder: '',
        approvalRequestStatus: '',
        createdAt: null,
        type: 'restaurant',
    }
}

function generateInitialTempFilterData(): IRequestListTempFilter {
    return {
        approvalRequestStatus: '',
        createdAt: null,
        searchKey: '',
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
    totalRequest: 0,
    pendingRequest: 0,
    }
}

enum RequestType {
    APPROVED = 'APPROVED',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED'
}

export const RequestStatusLabel: {[key in RequestType]: TLocaleId}={
    [RequestType.APPROVED]: 'Admin.Delivery.App.RequestManagementList.Filter.Approved',
    [RequestType.PENDING]: 'Admin.Delivery.App.RequestManagementList.Filter.Pending',
    [RequestType.REJECTED]:'Admin.Delivery.App.RequestManagementList.Filter.Rejected'
 }
 
enum RequestApprovalList {
    Onboarding = 'Seller Onboarding Requests',
    DocumentApproval = 'Document Approval Requests',
    SellerCategoryTags = 'Category Tag Updates',
    FeaturedImages = 'Featured Image Updates',
    ServingTime = 'Serving Time Changes',
}

export function getRestaurantRequestLabelByKey(key: string | undefined | null): string {
    if (!key) return '';
    const translationKey = RestaurantRequestNameLabelKeys[key];
    return translationKey ? translateMessage(translationKey) : key;
  }
  const RestaurantRequestNameLabelKeys: Record<string, string> = {
      [RequestApprovalList.Onboarding]: 'Admin.Delivery.App.SellerOnboardingRequests',
      [RequestApprovalList.DocumentApproval]: 'Admin.Delivery.App.DocumentApprovalRequests',
      [RequestApprovalList.SellerCategoryTags]: 'Admin.Delivery.App.CategoryTagUpdates',
      [RequestApprovalList.FeaturedImages]: 'Admin.Delivery.App.FeaturedImageUpdates',
      [RequestApprovalList.ServingTime]: 'Admin.Delivery.App.ServingTimeChanges', 
    };



export {
  IRequest,
  IRequestListResponse,
  IRequestListFilter,
  IAprovalCountResponse,
  IRequestListTempFilter,
  RequestType,
  generateInitialTempFilterData,
  generateRequestListData,
  generateInitialFilterData,
  generateInitialApprovalCountData,
  RequestApprovalList,
};
