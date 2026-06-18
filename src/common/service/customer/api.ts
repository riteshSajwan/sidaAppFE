import { buildQueryParam } from 'src/common/service/ApiUtil';
import RestService from 'src/common/service/restService/restService';
import { formatYearMonthDate } from 'src/common/utils/dateUtil';
import { ICustomer, ICustomerStatusRequest } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { IUserListFilter, IUserListResponse } from 'src/components/CustomerDetailPage/CustomerListUtil';
import { AUTH_BASE_URL } from 'src/constants';


const getCustomerList = (filter: IUserListFilter,page?: number,size?: number): Promise<IUserListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const formatedDate = filter.createdAt ? formatYearMonthDate(filter.createdAt) : null;
    const queryParams = [
      buildQueryParam('sortField', filter.sortField),
      buildQueryParam('sortOrder', filter.sortOrder),
      buildQueryParam('searchKey', filter.searchKey),
      buildQueryParam('blockValue', filter.blockValue),
      buildQueryParam('createdAt', formatedDate),
      `page=${page}`,
      `size=${size}`,
    ]
    .filter(Boolean)
    .join('&');
    return RestService.fetch(AUTH_BASE_URL +`/api/auth/users/admin/customer-onboarding/filter-customer?${queryParams}`,{
        method: 'GET',
        headers,
      }
    );
  });
};


const getCustomerDetails = (requestId: string | number): Promise<ICustomer> => {
  return RestService.generateHeaders().then((headers) => {
      return RestService.fetch(
        AUTH_BASE_URL + `/api/auth/users/admin/find-customer-detail/${requestId}`,
        {
          method: 'GET',
          headers,
        }
      );
    });
};



const updateBlockUnblockCustomer = async (data: ICustomerStatusRequest): Promise<ICustomerStatusRequest> => {
  const headers = await RestService.generateHeaders({
    'Content-type': 'application/json; charset=UTF-8',
  });
  return RestService.fetch(AUTH_BASE_URL + `/api/auth/users/block-unblock-user`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
};




export { getCustomerDetails, getCustomerList, updateBlockUnblockCustomer };

