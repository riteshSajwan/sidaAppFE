import { getCustomerDetails, getCustomerList, updateBlockUnblockCustomer } from 'src/common/service/customer/api';
import { fetchCustomerDetailsFailure, fetchCustomerDetailsRequest, fetchCustomerDetailsSuccess, fetchCustomerListingFailure, fetchCustomerListingRequest, fetchCustomerListingSuccess, setBlockStatusFailure, setBlockStatusRequest, setBlockStatusSuccess } from 'src/common/service/customer/slice';
import { ICustomer, ICustomerStatusRequest } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { IUserListFilter } from 'src/components/CustomerDetailPage/CustomerListUtil';
import { IApiErrorAuthResponse } from 'src/components/DriverDetailPage/Add/DriverDetailUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';
  
export const fetchCustomerListingAction = (filter: IUserListFilter,page: number,size: number): AppThunk => (dispatch) => {
    dispatch(fetchCustomerListingRequest());
    return getCustomerList(filter, page, size)
      .then((result) => {
        dispatch(fetchCustomerListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchCustomerListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };
  export const fetchCustomerDetailsAction =(id: string): AppThunk<Promise<ICustomer | undefined>> =>
  (dispatch) => {
    dispatch(fetchCustomerDetailsRequest());
    return getCustomerDetails(id)
      .then((result: ICustomer) => {
        dispatch(fetchCustomerDetailsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchCustomerDetailsFailure(translateMessage("Admin.Delivery.App.SomethingWentWrong")));
        return undefined;
      });
  };
export const customerBlockUnblockAction =(data:ICustomerStatusRequest): AppThunk<Promise<ICustomerStatusRequest | undefined>> =>(dispatch) => {
    dispatch(setBlockStatusRequest());
    return updateBlockUnblockCustomer(data)
      .then((result) => {
        dispatch(setBlockStatusSuccess(result.isBlocked));
        return result;
      })
      .catch((error) => {
         const errorresponse =error as IApiErrorAuthResponse;
        const apiError = errorresponse.message ?? translateMessage('Admin.Delivery.App.SomethingWentWrong');
        dispatch(setBlockStatusFailure(apiError));
        return undefined;
      });
    }
  
  
    