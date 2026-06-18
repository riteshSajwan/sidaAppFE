import { IAprovalCountResponse, IRequestListFilter, IRequestListResponse, RequestType } from 'src/components/RequestManagement/RequestListUtil';
import RestService from 'src/common/service/restService/restService';
import { AUTH_BASE_URL } from 'src/constants';
import { IOnboardingResponse } from 'src/components/RequestManagement/RequestDetails/Restaurants/Onboarding/OnboardingRequestUtil';
import { buildQueryParam } from 'src/common/service/ApiUtil';
import { formatYearMonthDate } from 'src/common/utils/dateUtil';

const getRequestList = async (filter: IRequestListFilter, page?: number, size?: number): Promise<IRequestListResponse> => {
    const headers = await RestService.generateHeaders();
    const formatedDate = filter.createdAt ? formatYearMonthDate(filter.createdAt) : null;
    const queryParams = [
      buildQueryParam('sortField', filter.sortField),
      buildQueryParam('sortOrder', filter.sortOrder),
      buildQueryParam('searchKey', filter.searchKey),
      buildQueryParam('approvalRequestStatus', filter.approvalRequestStatus),
      buildQueryParam('creationDate',formatedDate),
      `page=${page}`,
      `size=${size}`,
      
    ]
      .filter(Boolean)
      .join('&');
    return RestService.fetch(AUTH_BASE_URL + `/api/seller/customer-onboarding/requests/list-request?${queryParams}`, {
      method: 'GET',
      headers,
    });
  };

  const getApprovalCounts = async (): Promise<IAprovalCountResponse> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + '/api/seller/customer-onboarding/count-approval-request', {
      method: 'GET',
      headers,
    });
  };

  const getOnboardingDetails = async (sellerId: string | number): Promise<IOnboardingResponse> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/seller/owner/get-onboarding-approval-preview/${sellerId}`, {
      method: 'GET',
      headers,
    });
  };

  const approveRejectReject = async (requestId: string, approvalRequestStatus: RequestType, comment?: string | null) => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/seller/customer-onboarding/update-seller-approval-request?requestId=${requestId}&approvalRequestStatus=${approvalRequestStatus}&comment=${comment}`, {
      method: 'PUT',
      headers,
    });
  };

  const getRequestListDetails = async (requestId: string | number): Promise<any> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/seller/customer-onboarding/view-approval-preview-data/${requestId}`, {
      method: 'GET',
      headers,
    });
  };


  export {
    getRequestList,
    getApprovalCounts,
    getOnboardingDetails,
    approveRejectReject,
    getRequestListDetails
  }