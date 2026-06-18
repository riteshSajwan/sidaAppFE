import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { ITotalWalletBalance, TransactionInitiatedCount } from 'src/components/DashboardPage/DashboardUtil';

const  getDriverWorkingToday = async (): Promise<number> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/delivery/rider/get-today-driver-working`, {
      method: 'GET',
      headers,
    });
  };
  const  getSupportRequestCount = async (): Promise<number> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/order/tickets/getTicketsCountByStatus`, {
      method: 'GET',
      headers,
    });
  };
  const getCustomerLastMonthCountApi = async (): Promise<number> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/auth/customers/last-month-count`, {
      method: 'GET',
      headers,
    });
  };
  const getTotalWalletCountApi = async (): Promise<ITotalWalletBalance> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/payment/stripe/balance`, {
      method: 'GET',
      headers,
    });
  };
  const getTransactionInitiatedCountApi = async (): Promise<TransactionInitiatedCount> => {
    const headers = await RestService.generateHeaders();
    return RestService.fetch(AUTH_BASE_URL + `/api/payment/stripe/payout-summary`, {
      method: 'GET',
      headers,
    });
  };
export {getDriverWorkingToday,getSupportRequestCount,getCustomerLastMonthCountApi,getTotalWalletCountApi,getTransactionInitiatedCountApi }