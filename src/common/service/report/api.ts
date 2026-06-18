import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { ICutsomerData } from 'src/components/ReportsPage/ReportUtil';

export const fetchCustomerReportApi = (startMonth: string | null,endMonth: string | null): Promise<ICutsomerData[]> => {
  return RestService.generateHeaders().then(headers => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/auth/customers/reporting-data?startMonth=${startMonth}&endMonth=${endMonth}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

export const fetchDriverReportApi = (startMonth: string | null,endMonth: string | null): Promise<ICutsomerData[]> => {
  return RestService.generateHeaders().then(headers => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/delivery/rider/reporting-data?startMonth=${startMonth}&endMonth=${endMonth}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

export const fetchSaleProfitReportApi = (startMonth: string | null,endMonth: string | null): Promise<ICutsomerData[]> => {
  return RestService.generateHeaders().then(headers => {
    return RestService.fetch(
      AUTH_BASE_URL +
        `/api/order/reporting-data?startMonth=${startMonth}&endMonth=${endMonth}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};
