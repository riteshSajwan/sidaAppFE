import { AppThunk } from 'src/store';
import { fetchRateTierByIdFailure, fetchRateTierByIdRequest, fetchRateTierByIdSuccess, fetchRateTierListFailure, fetchRateTierListRequest, fetchRateTierListSuccess, fetchVehicleCategoryFailure, fetchVehicleCategoryRequest, fetchVehicleCategorySuccess, saveRateTierFailure, saveRateTierRequest, saveRateTierSuccess } from 'src/common/service/rateTier/slice';
import { getRateTierById, getRateTierListing, getVehicleCategory, SaveRateTier } from 'src/common/service/rateTier/api';
import { translateMessage } from 'src/i18n/createTranslation';
import { IRateTier } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';

export const fetchRateTierListAction = (id :string,page: number, size: number ,  ): AppThunk =>(dispatch) => {
    dispatch(fetchRateTierListRequest());
    return getRateTierListing(id,page, size)
      .then((result) => {
        dispatch(fetchRateTierListSuccess(result));
        return result;
      })
      .catch((err) => {
        dispatch(fetchRateTierListFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
        throw err;
      });
  };
  export const fetchVehicleCategoryInitAction = (id: string): AppThunk => (dispatch) => {
    dispatch(fetchVehicleCategoryRequest()); 

    return getVehicleCategory(id)
      .then((categories: string[]) => {
        dispatch(fetchVehicleCategorySuccess(categories));
        return categories;
      })
      .catch((error) => {
        dispatch(
          fetchVehicleCategoryFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        throw error;
      });
  };
export const fetchRateTierByIdAction = (id: string): AppThunk => (dispatch) => {
    dispatch(fetchRateTierByIdRequest());
  
    return getRateTierById(id)
      .then((result) => {
        dispatch(fetchRateTierByIdSuccess(result));
        return result;
      })
      .catch((error) => {
        dispatch(
          fetchRateTierByIdFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        throw error;
      });
  };
  export const saveRateTierAction = (payload: IRateTier): AppThunk<Promise<IRateTier>> => (dispatch) => {
    dispatch(saveRateTierRequest());
  
    return SaveRateTier(payload)
      .then((result) => {
        dispatch(saveRateTierSuccess());
        return result;
      })
      .catch((error) => {
        dispatch(saveRateTierFailure(
          translateMessage('Admin.Delivery.App.SomethingWentWrong')
        ));
        throw error;
      });
  };
  
  
  

  
  
  
