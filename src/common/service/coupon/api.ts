import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { ICouponListResponse, ICouponListFilter } from 'src/components/CouponPage/CouponListUtil';
import { buildQueryParam } from 'src/common/service/ApiUtil';

const getAllCouponList = (filter: ICouponListFilter, page?: number, size?: number): Promise<ICouponListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const queryParams = [
      buildQueryParam('sortField', filter.sortField),
      buildQueryParam('sortOrder', filter.sortOrder),
      buildQueryParam('searchKey', filter.searchKey),
      buildQueryParam('isActive', filter.isActive),
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/coupon/getAllValidCoupons?${queryParams}`, {
      method: 'GET',
      headers,
    }
    );
  });
};


const getCouponById = (id: string) => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(AUTH_BASE_URL + `/api/order/coupon/get-coupons/${id}`, {
      method: 'GET',
      headers,
    })
  );
};


const SaveCoupon = (data: object) => {
  return RestService.generateHeaders({ 'Content-type': 'application/json; charset=UTF-8', }).then((headers) =>
    RestService.fetch(
      AUTH_BASE_URL + `/api/order/coupon/add-edit-coupon`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }
    )
  );
};

const getCouponUpdateStatus = (id: number, isActive: boolean) => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(
      AUTH_BASE_URL + `/api/order/coupon/updateStatus/${id}?isActive=${isActive}`,
      {
        method: 'PUT',
        headers,
      }
    )
  );
};

export { getAllCouponList, getCouponById, SaveCoupon, getCouponUpdateStatus }
