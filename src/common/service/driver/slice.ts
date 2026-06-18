import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { IDriver } from 'src/components/DriverDetailPage/Add/DriverDetailUtil';
import { IDriverListResponse, IEarningsResponse } from 'src/components/DriverDetailPage/DriverListUtil';
import { IWalletListResponse } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';
import { IDriverRequestListResponse } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';
import { DEFAULT_SIZE } from 'src/constants';

export interface DriverRequestListState {
    loading: boolean;
    error: string | null;
    data: IDriverRequestListResponse;
}

export interface DriverListingState {
    loading: boolean;
    error: string | null;
    data: IDriverListResponse;
}
export interface DriverWalletListingState {
    loading: boolean;
    error: string | null;
    userTransactionDto: IWalletListResponse;
}
interface DriverDetailsState {
    loading: boolean;
    error: string | null;
    data: IDriver | null;
    blockStatus:  boolean | null;
}
interface DriverTotalEarningState {
    loading: boolean;
    error: string | null;
    data: IEarningsResponse | null;
}
interface DriverLimitState {
    loading: boolean;
    exceeded: boolean;
    error: string | null;
}

export interface CabsDriverListingState {
    loading: boolean;
    error: string | null;
    data: IDriverListResponse;
    hasMore: boolean;
    isLoadingMore: boolean;
}

export interface IDriverFileUploadState {
    loading: boolean;
    error: string | null;
    success: boolean;
    uploadFile: IFilesData | null;
}

export interface IDriverPreviewListingState {
    loading: boolean;
    error: string | null;
    data: IDriverListResponse;
}

export interface DriverState {
    requestList: DriverRequestListState;
    driverListing: DriverListingState;
    driverDetails: DriverDetailsState;
    driverWalletListing: DriverWalletListingState;
    driverTotalEarning: DriverTotalEarningState;
    onboardingLimit: DriverLimitState;
    cabsDriverListing: CabsDriverListingState;
    driverFileUpload: IDriverFileUploadState;
    driverPreviewListing: IDriverPreviewListingState;
}

export const driverInitialState: DriverState = {
    requestList: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
    driverListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
    driverDetails: {
        loading: false,
        error: null,
        data: null,
        blockStatus: null,
    },
    driverWalletListing: {
        loading: false,
        error: null,
        userTransactionDto: { userTransactionDto: [], total: 0, page: 0, size: 0 },
    },
    driverTotalEarning: {
        loading: false,
        error: null,
        data: null,
    },
    onboardingLimit: {
        loading: false,
        exceeded: false,
        error: null,
    },
    cabsDriverListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
        hasMore: true,
        isLoadingMore: false,
    },
    driverFileUpload: {
        loading: false,
        error: null,
        success: false,
        uploadFile: null,
    },
    driverPreviewListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
    },
};

const driverSlice = createSlice({
    name: 'driver',
    initialState: driverInitialState,
    reducers: {
        fetchDriverRequestListRequest(state) {
            state.requestList.loading = true;
            state.requestList.error = null;
        },
        fetchDriverRequestListSuccess(state, action: PayloadAction<IDriverRequestListResponse>) {
            state.requestList.loading = false;
            state.requestList.data = action.payload;
        },
        fetchDriverRequestListFailure(state, action: PayloadAction<string>) {
            state.requestList.loading = false;
            state.requestList.error = action.payload;
        },
        resetDriverRequests(state) {
            state.requestList = driverInitialState.requestList;
        },
        fetchDriverListingRequest(state) {
            state.driverListing.loading = true;
            state.driverListing.error = null;
        },
        fetchDriverListingSuccess(state, action: PayloadAction<IDriverListResponse>) {
            state.driverListing.loading = false;
            state.driverListing.data = action.payload;
        },
        fetchDriverListingFailure(state, action: PayloadAction<string>) {
            state.driverListing.loading = false;
            state.driverListing.error = action.payload;
        },
        resetDriverListing(state) {
            state.driverListing = driverInitialState.driverListing;
        },
        fetchDriverDetailsRequest(state) {
            state.driverDetails.loading = true;
            state.driverDetails.error = null;
        },
        fetchDriverDetailsSuccess(state, action: PayloadAction<IDriver>) {
            state.driverDetails.loading = false;
            state.driverDetails.data = action.payload;
        },
        fetchDriverDetailsFailure(state, action: PayloadAction<string>) {
            state.driverDetails.loading = false;
            state.driverDetails.error = action.payload;
        },
        resetDriverDetails(state) {
            state.driverDetails = driverInitialState.driverDetails;
        },
        setBlockStatusSuccess(state, action: PayloadAction<boolean>) {
            state.driverDetails.loading = false;
            state.driverDetails.blockStatus = action.payload;
        },
        setBlockStatusFailure(state, action: PayloadAction<string>) {
            state.driverDetails.loading = false;
            state.driverDetails.error = action.payload;
        },
        resetBlockStatus(state) {
            state.driverDetails.blockStatus = driverInitialState.driverDetails.blockStatus;
        },
        fetchDriverWalletListingRequest(state) {
            state.driverWalletListing.loading = true;
            state.driverWalletListing.error = null;
        },
        fetchDriverWalletListingSuccess(state, action: PayloadAction<IWalletListResponse>) {
            state.driverWalletListing.loading = false;
            state.driverWalletListing.userTransactionDto = action.payload;
        },
        fetchDriverWalletListingFailure(state, action: PayloadAction<string>) {
            state.driverWalletListing.loading = false;
            state.driverWalletListing.error = action.payload;
        },
        resetDriverWalletListing(state) {
            state.driverWalletListing = driverInitialState.driverWalletListing;
        },
        fetchDriverTotalEarningRequest(state) {
            state.driverTotalEarning.loading = true;
            state.driverTotalEarning.error = null;
        },
        fetchDriverTotalEarningSuccess(state, action: PayloadAction<IEarningsResponse>) {
            state.driverTotalEarning.loading = false;
            state.driverTotalEarning.data = action.payload;
        },
        fetchDriverTotalEarningFailure(state, action: PayloadAction<string>) {
            state.driverTotalEarning.loading = false;
            state.driverTotalEarning.error = action.payload;
        },
        resetDriverTotalEarning(state) {
            state.driverTotalEarning = driverInitialState.driverTotalEarning;
        },
        checkOnboardingLimitRequest(state) {
            state.onboardingLimit.loading = true;
            state.onboardingLimit.error = null;
        },
        checkOnboardingLimitSuccess(state, action: PayloadAction<boolean>) {
            state.onboardingLimit.loading = false;
            state.onboardingLimit.exceeded = action.payload;
        },
        checkOnboardingLimitFailure(state, action: PayloadAction<string>) {
            state.onboardingLimit.loading = false;
            state.onboardingLimit.error = action.payload;
        },
        fetchCabsDriverListingRequest(state) {
            state.cabsDriverListing.loading = true;
            state.cabsDriverListing.error = null;
        },
        fetchCabsDriverListingSuccess(state, action: PayloadAction<IDriverListResponse>) {
            state.cabsDriverListing.loading = false;
            state.cabsDriverListing.data = action.payload;
            state.cabsDriverListing.hasMore = action.payload.data.length === DEFAULT_SIZE;
        },
        fetchCabsDriverListingFailure(state, action: PayloadAction<string>) {
            state.cabsDriverListing.loading = false;
            state.cabsDriverListing.error = action.payload;
        },
        fetchCabsDriverListingLoadMoreRequest(state) {
            state.cabsDriverListing.isLoadingMore = true;
            state.cabsDriverListing.error = null;
        },
        fetchCabsDriverListingLoadMoreSuccess(state, action: PayloadAction<IDriverListResponse>) {
            state.cabsDriverListing.isLoadingMore = false;
            state.cabsDriverListing.data = {
                ...action.payload,
                data: [...state.cabsDriverListing.data.data, ...action.payload.data],
            };
            state.cabsDriverListing.hasMore = action.payload.data.length === DEFAULT_SIZE;
        },
        fetchCabsDriverListingLoadMoreFailure(state, action: PayloadAction<string>) {
            state.cabsDriverListing.isLoadingMore = false;
            state.cabsDriverListing.error = action.payload;
            state.cabsDriverListing.hasMore = false;
        },
        resetCabsDriverListing(state) {
            state.cabsDriverListing = driverInitialState.cabsDriverListing;
        },
        // File upload
        uploadDriverFileRequest(state) {
            state.driverFileUpload.loading = true;
            state.driverFileUpload.error = null;
            state.driverFileUpload.success = false;
        },
        uploadDriverFileSuccess(state) {
            state.driverFileUpload.loading = false;
            state.driverFileUpload.success = true;
            state.driverFileUpload.error = null;
        },
        uploadDriverFileFailure(state, action: PayloadAction<string>) {
            state.driverFileUpload.loading = false;
            state.driverFileUpload.error = action.payload;
            state.driverFileUpload.success = false;
        },
        setDriverUploadFile(state, action: PayloadAction<IFilesData>) {
            state.driverFileUpload.uploadFile = action.payload;
            state.driverFileUpload.loading = false;
            state.driverFileUpload.error = null;
        },
        resetDriverFileUpload(state) {
            state.driverFileUpload = driverInitialState.driverFileUpload;
        },
        // Preview listing
        fetchDriverPreviewListingRequest(state) {
            state.driverPreviewListing.loading = true;
            state.driverPreviewListing.error = null;
        },
        fetchDriverPreviewListingSuccess(state, action: PayloadAction<IDriverListResponse>) {
            state.driverPreviewListing.loading = false;
            state.driverPreviewListing.data = action.payload;
        },
        fetchDriverPreviewListingFailure(state, action: PayloadAction<string>) {
            state.driverPreviewListing.loading = false;
            state.driverPreviewListing.error = action.payload;
        },
        resetDriverPreviewListing(state) {
            state.driverPreviewListing = driverInitialState.driverPreviewListing;
        },
    },
});

export const {
    fetchDriverRequestListRequest,
    fetchDriverRequestListSuccess,
    fetchDriverRequestListFailure,
    resetDriverRequests,
    fetchDriverListingRequest,
    fetchDriverListingSuccess,
    fetchDriverListingFailure,
    resetDriverListing,
    fetchDriverDetailsRequest,
    fetchDriverDetailsSuccess,
    fetchDriverDetailsFailure,
    resetDriverDetails,
    setBlockStatusFailure,
    setBlockStatusSuccess,
    resetBlockStatus,
    fetchDriverWalletListingRequest,
    fetchDriverWalletListingSuccess,
    fetchDriverWalletListingFailure,
    resetDriverWalletListing,
    fetchDriverTotalEarningRequest,
    fetchDriverTotalEarningSuccess,
    fetchDriverTotalEarningFailure,
    resetDriverTotalEarning,
    checkOnboardingLimitRequest,
    checkOnboardingLimitSuccess,
    checkOnboardingLimitFailure,
    fetchCabsDriverListingLoadMoreRequest,
    fetchCabsDriverListingLoadMoreSuccess,
    fetchCabsDriverListingLoadMoreFailure,
    resetCabsDriverListing,
    fetchCabsDriverListingRequest,
    fetchCabsDriverListingSuccess,
    fetchCabsDriverListingFailure,
    uploadDriverFileRequest,
    uploadDriverFileSuccess,
    uploadDriverFileFailure,
    setDriverUploadFile,
    resetDriverFileUpload,
    fetchDriverPreviewListingRequest,
    fetchDriverPreviewListingSuccess,
    fetchDriverPreviewListingFailure,
    resetDriverPreviewListing,
} = driverSlice.actions;

export const DriverReducer = driverSlice.reducer;
