import RestService from 'src/common/service/restService/restService';
import { AUTH_BASE_URL } from 'src/constants';

export interface ITenantResponse {
  success?: boolean;
  tenantId?: string;
}

export const getTenantInfo = (bundleId: string): Promise<ITenantResponse> => {
  return RestService.fetch(`${AUTH_BASE_URL}/api/tenant/app/${bundleId}/tenant`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
};
