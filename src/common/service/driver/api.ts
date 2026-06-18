import { buildQueryParam } from 'src/common/service/ApiUtil';
import RestService from 'src/common/service/restService/restService';
import { formatYearMonthDate } from 'src/common/utils/dateUtil';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { IDriverListFilter, IDriverListResponse, IEarningsResponse } from 'src/components/DriverDetailPage/DriverListUtil';
import { IWalletListResponse, IWalletListTempFilter } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';
import { IDriverRequestListFilter, IDriverRequestListResponse } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';
import { IDriver } from 'src/components/RequestManagement/RequestDetails/DriverRequests/Onboarding/DriverOnboardingRequestUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getDriverList = (filter: IDriverListFilter,page?: number,size?: number): Promise<IDriverListResponse> => {
  const formatedDate = filter.createdAt ? formatYearMonthDate(filter.createdAt) : null;
  const queryParams = [
    buildQueryParam("searchKey", filter.searchKey),
    buildQueryParam("isBlockedFilter", filter.isBlockedFilter),
    buildQueryParam("createdAt", formatedDate),
    filter.country ? `country=${filter.country}` : "",
    filter.paymentMethod ? `paymentMethod=${filter.paymentMethod}` : "",
    `page=${page}`,
    `size=${size}`,
  ]
    .filter(Boolean)
    .join("&");

  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/auth/user-roles/admin/all-rider-detail/filter-rider?${queryParams}`,
      {
        method: "GET",
        headers,
      }
    );
  });
};


const getDriverRequestDetails = (requestId: string | number): Promise<IDriver> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/admin/rider-details--based-on-approval/${requestId}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};


const getDriverDetails = (requestId: string | number): Promise<IDriver> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      AUTH_BASE_URL + `/api/delivery/admin/rider/rider-details/${requestId}`,
      {
        method: "GET",
        headers,
      }
    );
  });
};



const approveRejectRequest = (requestId: string,approvalRequestStatus: RequestType,comment?: string | null) => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/admin/update-rider-approval-request?requestId=${requestId}&approvalRequestStatus=${approvalRequestStatus}&comment=${comment}`,
      {
        method: 'PUT',
        headers,
      }
    );
  });
};


const getDriverRequestList = (filter: IDriverRequestListFilter,page?: number,size?: number): Promise<IDriverRequestListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const formatedDate = filter.createdAt ? formatYearMonthDate(filter.createdAt) : null;
    const queryParams = [
      buildQueryParam('creationDate', formatedDate),
      buildQueryParam('searchKey', filter.searchKey),
      buildQueryParam('approvalRequestStatus', filter.approvalRequestStatus),
      buildQueryParam('sortField', filter.sortField),
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');

    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/admin/requests/list-request?${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

const getDriverTotalEarnings = (userId: string): Promise<IEarningsResponse> => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(
      `${AUTH_BASE_URL}/api/payment/stripe/payout/rider/${userId}/balance`,
      {
        method: 'GET',
        headers,
      }
    )
  );
};

const getDriverWalletList = (id: string,tempFilter: IWalletListTempFilter,page?: number,size?: number): Promise<IWalletListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const queryParams = [
      buildQueryParam('filter', tempFilter.status),
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');

    return RestService.fetch(
      `${AUTH_BASE_URL}/api/payment/stripe/transactions/history?role=rider&userId=${id}&${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};


const checkOnboardingLimit = (): Promise<boolean> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/riders/onboarding-limit/exceeded`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

const uploadDriverFilePreview = (fileData: IFilesData, page?: number, size?: number): Promise<IDriverListResponse> => {
  const formData = new FormData();
  if (fileData.blob) {
    formData.append('file', fileData.blob, fileData.fileName);
  }
  const queryParams = [`page=${page ?? 0}`, `size=${size ?? 10}`].join('&');
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/rider-onboarding-upload-preview?${queryParams}`,
      { method: 'POST', headers, body: formData }
    );
  });
};

const uploadDriverFile = (fileData: IFilesData): Promise<any> => {
  const formData = new FormData();
  if (fileData.blob) {
    formData.append('file', fileData.blob, fileData.fileName);
  }
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/rider-onboarding-bulk-submit`,
      { method: 'POST', headers, body: formData }
    );
  });
};

export { approveRejectRequest, checkOnboardingLimit, getDriverDetails, getDriverList, getDriverRequestDetails, getDriverRequestList, getDriverTotalEarnings, getDriverWalletList, uploadDriverFile, uploadDriverFilePreview };
