import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { updateBlockUnblockCustomer } from 'src/common/service/customer/api';
import { approveRejectRequest, checkOnboardingLimit, getDriverDetails, getDriverList, getDriverRequestDetails, getDriverRequestList, getDriverTotalEarnings, getDriverWalletList, uploadDriverFile, uploadDriverFilePreview } from 'src/common/service/driver/api';
import { checkOnboardingLimitFailure, checkOnboardingLimitRequest, checkOnboardingLimitSuccess, fetchCabsDriverListingFailure, fetchCabsDriverListingLoadMoreFailure, fetchCabsDriverListingLoadMoreRequest, fetchCabsDriverListingLoadMoreSuccess, fetchCabsDriverListingRequest, fetchCabsDriverListingSuccess, fetchDriverDetailsFailure, fetchDriverDetailsRequest, fetchDriverDetailsSuccess, fetchDriverListingFailure, fetchDriverListingRequest, fetchDriverListingSuccess, fetchDriverPreviewListingFailure, fetchDriverPreviewListingRequest, fetchDriverPreviewListingSuccess, fetchDriverRequestListFailure, fetchDriverRequestListRequest, fetchDriverRequestListSuccess, fetchDriverTotalEarningFailure, fetchDriverTotalEarningRequest, fetchDriverTotalEarningSuccess, fetchDriverWalletListingFailure, fetchDriverWalletListingRequest, fetchDriverWalletListingSuccess, setBlockStatusFailure, setBlockStatusSuccess, setDriverUploadFile, uploadDriverFileFailure, uploadDriverFileRequest, uploadDriverFileSuccess } from 'src/common/service/driver/slice';
import { ICustomerStatusRequest } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { IApiErrorAuthResponse, IDriver } from 'src/components/DriverDetailPage/Add/DriverDetailUtil';
import { IDriverListFilter, IDriverListResponse, IEarningsResponse } from 'src/components/DriverDetailPage/DriverListUtil';
import { IWalletListTempFilter } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';
import { IDriverRequestListFilter } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchDriverRequestListAction = (filter: IDriverRequestListFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchDriverRequestListRequest());
    return getDriverRequestList(filter, page, size)
      .then((result) => {
        dispatch(fetchDriverRequestListSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchDriverRequestListFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

export const fetchDriverListingAction = (filter: IDriverListFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchDriverListingRequest());
    return getDriverList(filter, page, size)
      .then((result) => {
        dispatch(fetchDriverListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchDriverListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

export const fetchDriverDetailsAction =
  (id: number, isRequestType: boolean = false): AppThunk<Promise<IDriver | undefined>> =>
  (dispatch) => {
    dispatch(fetchDriverDetailsRequest());
    const apiFn = isRequestType ? getDriverRequestDetails : getDriverDetails;
    return apiFn(id)
      .then((result: IDriver) => {
        dispatch(fetchDriverDetailsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchDriverDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return undefined;
      });
};

export const driverBlockUnblockAction =
  (data: ICustomerStatusRequest): AppThunk<Promise<ICustomerStatusRequest | undefined>> =>
  (dispatch) => {
    dispatch(fetchDriverDetailsRequest());
    return updateBlockUnblockCustomer(data)
      .then((result) => {
        dispatch(setBlockStatusSuccess(result.isBlocked));
        return result;
      })
      .catch((error) => {
        const errorresponse = error as IApiErrorAuthResponse;
        const apiError = errorresponse.message ?? translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(setBlockStatusFailure(apiError));
        return undefined;
      });
};

export const fetchDriverWalletListingAction = (id: string, filter: IWalletListTempFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchDriverWalletListingRequest());
    return getDriverWalletList(id, filter, page, size)
      .then((result) => {
        dispatch(fetchDriverWalletListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchDriverWalletListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

export const fetchDriverTotalEarningAction = (id: string): AppThunk<Promise<IEarningsResponse | undefined>> => (dispatch) => {
    dispatch(fetchDriverTotalEarningRequest());
    return getDriverTotalEarnings(id)
      .then((result: IEarningsResponse) => {
        dispatch(fetchDriverTotalEarningSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchDriverTotalEarningFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return undefined;
      });
};

export const driverRequestApprovalRejectionAction =
  (requestId: string, approvalRequestStatus: RequestType, comment?: string | null): AppThunk<Promise<ICustomerStatusRequest | undefined>> =>
  (dispatch) => {
    dispatch(fetchDriverDetailsRequest());
    return approveRejectRequest(requestId, approvalRequestStatus, comment || null)
      .then((result) => {
        dispatch(setBlockStatusSuccess(result.isBlocked));
        return result;
      })
      .catch((error) => {
        const errorresponse = error as IApiErrorAuthResponse;
        const apiError = errorresponse.message ?? translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(setBlockStatusFailure(apiError));
        return undefined;
      });
};

export const checkOnboardingLimitAction = (): AppThunk => (dispatch) => {
    dispatch(checkOnboardingLimitRequest());
    return checkOnboardingLimit()
      .then((result) => {
        dispatch(checkOnboardingLimitSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(checkOnboardingLimitFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

export const fetchCabsDriverListingAction = (filter: IDriverListFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchCabsDriverListingRequest());
    return getDriverList(filter, page, size)
      .then((result) => {
        dispatch(fetchCabsDriverListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchCabsDriverListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

export const fetchCabsDriverListingLoadMoreAction = (filter: IDriverListFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchCabsDriverListingLoadMoreRequest());
    return getDriverList(filter, page, size)
      .then((result) => {
        dispatch(fetchCabsDriverListingLoadMoreSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchCabsDriverListingLoadMoreFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
};

// Called from DriverList — fetches preview, stores file, then caller navigates
export const uploadDriverFilePreviewAction = (fileData: IFilesData, page?: number, size?: number): AppThunk<Promise<IDriverListResponse>> => (dispatch) => {
    dispatch(uploadDriverFileRequest());
    return uploadDriverFilePreview(fileData, page, size)
      .then((response) => {
        dispatch(setDriverUploadFile(fileData));
        return response as IDriverListResponse;
      })
      .catch((error) => {
        const errorMessage = error?.message || error?.error || translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(uploadDriverFileFailure(errorMessage));
        return Promise.reject(errorMessage);
      });
};

// Called from preview page for pagination
export const fetchDriverPreviewPageAction = (fileData: IFilesData, page: number, size: number): AppThunk<Promise<IDriverListResponse>> => (dispatch) => {
    dispatch(fetchDriverPreviewListingRequest());
    return uploadDriverFilePreview(fileData, page, size)
      .then((response) => {
        dispatch(fetchDriverPreviewListingSuccess(response as IDriverListResponse));
        return response as IDriverListResponse;
      })
      .catch((error) => {
        const errorMessage = error?.message || error?.error || translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(fetchDriverPreviewListingFailure(errorMessage));
        return Promise.reject(errorMessage);
      });
};

// Final upload
export const uploadDriverFileAction = (fileData: IFilesData): AppThunk<Promise<any>> => (dispatch) => {
    dispatch(uploadDriverFileRequest());
    return uploadDriverFile(fileData)
      .then((response) => {
        if (response !== true) {
          throw new Error(translateMessage('Admin.Delivery.App.SomethingWentWrong'));
        }
        dispatch(uploadDriverFileSuccess());
        return response;
      })
      .catch((error) => {
        const errorMessage = error?.message || error?.error || translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(uploadDriverFileFailure(errorMessage));
        return Promise.reject(errorMessage);
      });
};
