import RestService from 'src/common/service/restService/restService';
import { ICouponListResponse } from 'src/components/CouponPage/CouponListUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getDistrictListing = (cityId: number): Promise<ICouponListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/master/states/${cityId}/districts`, {
      method: 'GET',
      headers,
    }
    );
  });
};


export { getDistrictListing };

