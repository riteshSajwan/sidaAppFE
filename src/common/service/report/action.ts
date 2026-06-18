import { getCustomerLastMonthCountApi, getDriverWorkingToday, getSupportRequestCount, getTotalWalletCountApi, getTransactionInitiatedCountApi } from 'src/common/service/dashboard/api';
import { fetchCustomerReportApi, fetchDriverReportApi, fetchSaleProfitReportApi } from 'src/common/service/report/api';
import { fetchCustomerCountFailure, fetchCustomerCountRequest, fetchCustomerCountSuccess, fetchCustomerGraphFailure, fetchCustomerGraphRequest, fetchCustomerGraphSuccess, fetchDriverGraphFailure, fetchDriverGraphRequest, fetchDriverGraphSuccess, fetchIndicatorsFailure, fetchIndicatorsRequest, fetchIndicatorsSuccess, fetchSaleProfitGraphFailure, fetchSaleProfitGraphRequest, fetchSaleProfitGraphSuccess, fetchTopPerfomerFailure, fetchTopPerformerRequest, fetchTopPerformerSuccess, fetchTransactionCountFailure, fetchTransactionCountRequest, fetchTransactionCountSuccess, fetchWalletBalanceFailure, fetchWalletBalanceRequest, fetchWalletBalanceSuccess } from 'src/common/service/report/slice';
import { getBestRider } from 'src/common/service/topPerformer/api';
import { ICutsomerData } from 'src/components/ReportsPage/ReportUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchCustomerLastMonthCountAction = (): AppThunk => (dispatch) => {
    dispatch(fetchCustomerCountRequest());
    return getCustomerLastMonthCountApi()
        .then((count) => {
            dispatch(fetchCustomerCountSuccess(count));
        })
        .catch(() => {
            dispatch(
                fetchCustomerCountFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
            );
        });
};

export const fetchTotalWalletBalanceAction = (): AppThunk => (dispatch) => {
    dispatch(fetchWalletBalanceRequest());
    return getTotalWalletCountApi()
        .then((result) => {
            dispatch(fetchWalletBalanceSuccess({
                amount: result.totalAmount,
                currency: result.currency,
                available: result.available ?? [],
            }));
        })
        .catch(() => {
            dispatch(fetchWalletBalanceFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        });
};

export const fetchTransactionInitiatedCountAction = (): AppThunk => (dispatch) => {
    dispatch(fetchTransactionCountRequest());
    return getTransactionInitiatedCountApi()
        .then((result) => {
            dispatch(fetchTransactionCountSuccess(result.totalCount));
        })
        .catch(() => {
            dispatch(fetchTransactionCountFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        });
};

export const fetchDashboardIndicatorsAction = (): AppThunk => (dispatch) => {
    dispatch(fetchIndicatorsRequest());
    return Promise.all([getDriverWorkingToday(), getSupportRequestCount()])
        .then(([driverWorkingToday, supportRequestCount]) => {
            dispatch(
                fetchIndicatorsSuccess({ driverWorkingToday, supportRequestCount })
            );
        })
        .catch(() => {
            dispatch(fetchIndicatorsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
            );
        });
};

export const fetchCustomerGraphAction = (startMonth: string, endMonth: string): AppThunk => (dispatch) => {
    dispatch(fetchCustomerGraphRequest());
    return fetchCustomerReportApi(startMonth, endMonth)
        .then((result: ICutsomerData[]) => {
            const transformed = result.map((item) => ({
                label: item.monthName,
                value: item.count,
            }));
            dispatch(fetchCustomerGraphSuccess(transformed));
            return transformed;
        })
        .catch(() => {
            dispatch(fetchCustomerGraphFailure(translateMessage("Admin.Delivery.App.SomethingWentWrong"))
            );
        });
};
export const fetchDriverGraphAction = (startMonth: string, endMonth: string): AppThunk => (dispatch) => {
    dispatch(fetchDriverGraphRequest());
    return fetchDriverReportApi(startMonth, endMonth)
        .then((result: ICutsomerData[]) => {
            const transformed = result.map((item) => ({
                label: item.monthName,
                value: item.count,
            }));
            dispatch(fetchDriverGraphSuccess(transformed));
            return transformed;
        })
        .catch(() => {
            dispatch(fetchDriverGraphFailure(translateMessage("Admin.Delivery.App.SomethingWentWrong"))
            );
        });
};

export const getSaleProfitGraphAction = (startMonth: string, endMonth: string): AppThunk => (dispatch) => {
    dispatch(fetchSaleProfitGraphRequest());
    return fetchSaleProfitReportApi(startMonth, endMonth)
        .then((result: ICutsomerData[]) => {
            const sales = result.map(item => ({
                label: item.monthName,
                value: item.totalSales ?? 0,
            }));
            const profit = result.map(item => ({
                label: item.monthName,
                value: item.totalProfit ?? 0,
            }));
            dispatch(fetchSaleProfitGraphSuccess({ sales, profit })
            );
        })
        .catch((error) => {
            dispatch(fetchSaleProfitGraphFailure(error?.message || translateMessage("Admin.Delivery.App.SomethingWentWrong")));
        });
};


export const fetchTopPerformerAction = (): AppThunk => (dispatch) => {
    dispatch(fetchTopPerformerRequest());
    return getBestRider()
      .then((result) => {
        dispatch(fetchTopPerformerSuccess(result));
      })
      .catch(() => {
        dispatch(fetchTopPerfomerFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };
  
