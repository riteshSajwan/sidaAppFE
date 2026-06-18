import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWalletBalanceItem } from 'src/components/DashboardPage/DashboardUtil';
import { IBestRider } from 'src/components/DashboardPage/topPerformer/TopPerformerUtils';
import { IOption } from 'src/components/ReportsPage/ReportUtil';

export interface ReportState {
    customerLastMonthCount: {
        loading: boolean;
        error: string | null;
        data: number | null;
    };
    totalWalletBalance: {
        loading: boolean;
        error: string | null;
        amount: number | null;
        currency: string | null;
        available: IWalletBalanceItem[];
    };
    transactionInitiatedCount: {
        loading: boolean;
        error: string | null;
        totalCount: number;
    };
    dashboardIndicators: {
        loading: boolean;
        error: string | null;
        driverWorkingToday: number | null;
        supportRequestCount: number | null;
    };
    customerGraph: {
        loading: boolean;
        error: string | null;
        data: IOption[];
    };
    driverGraph: {
        loading: boolean;
        error: string | null;
        data:IOption[];
    };
    saleProfitGraph: {
        loading: boolean;
        error: string | null;
        data: {
            sales:IOption[];
            profit: IOption[];
        };
    };
    topPerformer: {
        loading: boolean;
        error: string | null;
        data:IBestRider[];
    };
}

export const reportInitialState: ReportState = {
    customerLastMonthCount: {
        loading: false,
        error: null,
        data: null,
    },
    totalWalletBalance: {
        loading: false,
        error: null,
        amount: null,
        currency: null,
        available: [],
    },
    transactionInitiatedCount: {
        loading: false,
        error: null,
        totalCount: 0,
    },
    dashboardIndicators: {
        loading: false,
        error: null,
        driverWorkingToday: null,
        supportRequestCount: null,
    },
    customerGraph: {
        loading: false,
        error: null,
        data: [],
    },
    driverGraph: {
        loading: false,
        error: null,
        data: [],
    },
    saleProfitGraph: {
        loading: false,
        error: null,
        data: {
            sales: [],
            profit: [],
        },
    },
    topPerformer: {
        loading: false,
        error: null,
        data: [],
    },
};

const reportSlice = createSlice({
    name: 'report',
    initialState: reportInitialState,
    reducers: {
        fetchCustomerCountRequest(state) {
            state.customerLastMonthCount.loading = true;
            state.customerLastMonthCount.error = null;
        },
        fetchCustomerCountSuccess(state, action: PayloadAction<number>) {
            state.customerLastMonthCount.loading = false;
            state.customerLastMonthCount.data = action.payload;
        },
        fetchCustomerCountFailure(state, action: PayloadAction<string>) {
            state.customerLastMonthCount.loading = false;
            state.customerLastMonthCount.error = action.payload;
        },
        fetchWalletBalanceRequest(state) {
            state.totalWalletBalance.loading = true;
            state.totalWalletBalance.error = null;
        },
        fetchWalletBalanceSuccess(state, action: PayloadAction<{ amount: number; currency: string; available: IWalletBalanceItem[] }>) {
            state.totalWalletBalance.loading = false;
            state.totalWalletBalance.amount = action.payload.amount;
            state.totalWalletBalance.currency = action.payload.currency;
            state.totalWalletBalance.available = action.payload.available;
        },
        fetchWalletBalanceFailure(state, action: PayloadAction<string>) {
            state.totalWalletBalance.loading = false;
            state.totalWalletBalance.error = action.payload;
        },
        fetchTransactionCountRequest(state) {
            state.transactionInitiatedCount.loading = true;
            state.transactionInitiatedCount.error = null;
        },
        fetchTransactionCountSuccess(state, action: PayloadAction<number>) {
            state.transactionInitiatedCount.loading = false;
            state.transactionInitiatedCount.totalCount = action.payload;
        },
        fetchTransactionCountFailure(state, action: PayloadAction<string>) {
            state.transactionInitiatedCount.loading = false;
            state.transactionInitiatedCount.error = action.payload;
        },
        fetchIndicatorsRequest(state) {
            state.dashboardIndicators.loading = true;
            state.dashboardIndicators.error = null;
        },
        fetchIndicatorsSuccess(state,action: PayloadAction<{ driverWorkingToday: number; supportRequestCount: number }>) {
            state.dashboardIndicators.loading = false;
            state.dashboardIndicators.driverWorkingToday =
                action.payload.driverWorkingToday;
            state.dashboardIndicators.supportRequestCount =
                action.payload.supportRequestCount;
        },
        fetchIndicatorsFailure(state, action: PayloadAction<string>) {
            state.dashboardIndicators.loading = false;
            state.dashboardIndicators.error = action.payload;
        },
        resetReport() {
            return reportInitialState;
        },
        fetchCustomerGraphRequest(state) {
            state.customerGraph.loading = true;
            state.customerGraph.error = null;
        },
        fetchCustomerGraphSuccess(state,action: PayloadAction<IOption[]>) {
            state.customerGraph.loading = false;
            state.customerGraph.data = action.payload;
        },
        fetchCustomerGraphFailure(state, action: PayloadAction<string>) {
            state.customerGraph.loading = false;
            state.customerGraph.error = action.payload;
        },
        fetchDriverGraphRequest(state) {
            state.driverGraph.loading = true;
            state.driverGraph.error = null;
        },
        fetchDriverGraphSuccess(state,action: PayloadAction<IOption[]>) {
            state.driverGraph.loading = false;
            state.driverGraph.data = action.payload;
        },
        fetchDriverGraphFailure(state, action: PayloadAction<string>) {
            state.driverGraph.loading = false;
            state.driverGraph.error = action.payload;
        },
        fetchSaleProfitGraphRequest(state) {
            state.saleProfitGraph.loading = true;
            state.saleProfitGraph.error = null;
        },
        fetchSaleProfitGraphSuccess(state,action: PayloadAction<{sales: IOption[];profit: IOption[];}>
        ) {
            state.saleProfitGraph.loading = false;
            state.saleProfitGraph.data = action.payload;
        },
        fetchSaleProfitGraphFailure(state, action: PayloadAction<string>) {
            state.saleProfitGraph.loading = false;
            state.saleProfitGraph.error = action.payload;
        },
        fetchTopPerformerRequest(state) {
            state.topPerformer.loading = true;
            state.topPerformer.error = null;
        },
        fetchTopPerformerSuccess(state,action: PayloadAction<IBestRider[]>
        ) {
            state.topPerformer.loading = false;
            state.topPerformer.data = action.payload;
        },
        fetchTopPerfomerFailure(state, action: PayloadAction<string>) {
            state.topPerformer.loading = false;
            state.topPerformer.error = action.payload;
        },
        
    },
});

export const {
    fetchCustomerCountRequest,
    fetchCustomerCountSuccess,
    fetchCustomerCountFailure,
    fetchWalletBalanceRequest,
    fetchWalletBalanceSuccess,
    fetchWalletBalanceFailure,
    fetchTransactionCountRequest,
    fetchTransactionCountSuccess,
    fetchTransactionCountFailure,
    fetchIndicatorsRequest,
    fetchIndicatorsSuccess,
    fetchIndicatorsFailure,
    resetReport,
    fetchCustomerGraphRequest,
    fetchCustomerGraphSuccess,
    fetchCustomerGraphFailure,
    fetchDriverGraphRequest,
    fetchDriverGraphSuccess,
    fetchDriverGraphFailure,
    fetchSaleProfitGraphRequest,
    fetchSaleProfitGraphSuccess,
    fetchSaleProfitGraphFailure,
    fetchTopPerformerRequest,
    fetchTopPerformerSuccess,
    fetchTopPerfomerFailure
} = reportSlice.actions;

export const ReportReducer = reportSlice.reducer;
