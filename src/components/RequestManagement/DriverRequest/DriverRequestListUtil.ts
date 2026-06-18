import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface IDriverRequest {
    id: number,
    riderId: number,
    riderName: string,
    requestName: string,
    requestType: number,
    sellerName: string,
    approvalRequestStatus: RequestType,
    createdAt: string;
    renderViewDetails: boolean,
}

interface IDriverRequestListResponse {
    data: IDriverRequest[];
    page: number;
    size: number;
    total: number;
}

interface IDriverRequestListFilter {
    searchKey: string;
    sortField: string;
    sortOrder: string;
    approvalRequestStatus: string;
    type: string;
    createdAt: DateType | null;
}

interface IDriverRequestListTempFilter {
    approvalRequestStatus: string;
    createdAt: DateType | null;
    searchKey: string;
}

function generateRequestListData(): IDriverRequestListResponse {
    return {
        data: [],
        page: 0,
        size: DEFAULT_TABLE_SIZE,
        total: 0,
    }
}

function generateInitialFilterData(): IDriverRequestListFilter {
    return {
        searchKey: '',
        sortField: 'updationAt',
        sortOrder: '',
        approvalRequestStatus: '',
        createdAt: null,
        type: 'driver',
    }
}

function generateInitialTempFilterData(): IDriverRequestListTempFilter {
    return {
        approvalRequestStatus: '',
        createdAt: null,
        searchKey: '',
    }
}


enum DriverRequestApprovalList {
    DRIVER_ONBOARRDING = 'Onboarding',
    DRIVER_LICENSE='Update Licence Detail',
    DRIVER_INSURANCE = 'Update Vehicle Insurance',
    DRIVER_VEHICLE = 'Update Vehicle Registration',
    DRIVER_BANK='DriverBank',
}
export function getRequestLabelByKey(key: string | undefined | null): string {
    if (!key) return '';
    const translationKey = RequestNameLabelKeys[key];
    return translationKey ? translateMessage(translationKey) : key;
  }
  const RequestNameLabelKeys: Record<string, string> = {
      [DriverRequestApprovalList.DRIVER_ONBOARRDING]: 'Admin.Delivery.App.Onboarding',
      [DriverRequestApprovalList.DRIVER_LICENSE]: 'Admin.Delivery.App.UpdateLicenceDetail',
      [DriverRequestApprovalList.DRIVER_INSURANCE]: 'Admin.Delivery.App.UpdateVehicleInsurance',
      [DriverRequestApprovalList.DRIVER_VEHICLE]: 'Admin.Delivery.App.UpdateVehicleRegistration',
      [DriverRequestApprovalList.DRIVER_BANK]: 'Admin.Delivery.App.DriverBank',
    
    };

export {
    IDriverRequest,
    IDriverRequestListResponse,
    IDriverRequestListFilter,
    IDriverRequestListTempFilter,
    generateInitialTempFilterData,
    generateRequestListData,
    generateInitialFilterData,
    DriverRequestApprovalList,
};
