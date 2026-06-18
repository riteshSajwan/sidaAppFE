import { activateBusinessApi, addBusinessApi, createCustomPlanApi, deactivateBusinessApi, fetchBusinessSignupAnalyticsApi, getAllBusinessList, getBusinessDetailsById, getFixedPlansApi, getPlanBenefitsApi, getPlanByIdApi, IAddBusinessPayload, ICreateCustomPlanPayload } from 'src/common/service/business/api';
import {
    addBusinessFailure,
    addBusinessRequest,
    addBusinessSuccess,
    clearAddBusinessState,
    clearBenefitsError,
    clearCreateCustomPlanState,
    clearFixedPlansError,
    clearPlanDetailsState,
    clearSelectedPlan,
    clearUpdateCustomPlanState,
    createCustomPlanFailure,
    createCustomPlanRequest,
    createCustomPlanSuccess,
    fetchBusinessDetailsFailure,
    fetchBusinessDetailsRequest,
    fetchBusinessDetailsSuccess,
    fetchBusinessListingFailure,
    fetchBusinessListingRequest,
    fetchBusinessListingSuccess,
    fetchBusinessSignupAnalyticsFailure,
    fetchBusinessSignupAnalyticsRequest,
    fetchBusinessSignupAnalyticsSuccess,
    fetchFixedPlansFailure,
    fetchFixedPlansRequest,
    fetchFixedPlansSuccess,
    fetchPlanBenefitsFailure,
    fetchPlanBenefitsRequest,
    fetchPlanBenefitsSuccess,
    fetchPlanDetailsFailure,
    fetchPlanDetailsRequest,
    fetchPlanDetailsSuccess,
    resetPlanBenefitsSelection,
    SelectedPlanData,
    setSelectedPlan,
    toggleBenefitSelection,
    toggleBusinessStatusFailure,
    toggleBusinessStatusRequest,
    toggleBusinessStatusSuccess,
    updateCustomPlanFailure,
    updateCustomPlanRequest,
    updateCustomPlanSuccess
} from 'src/common/service/business/slice';
import { IBusiness, IBusinessListFilter } from 'src/components/Business/BusinessListUtils';
import { ICutsomerData } from 'src/components/ReportsPage/ReportUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store/index';

export const fetchPlanBenefits = (): AppThunk => (dispatch) => {
  try {
    dispatch(fetchPlanBenefitsRequest());
    
    getPlanBenefitsApi()
      .then((response) => {
        dispatch(fetchPlanBenefitsSuccess(response));
      })
      .catch(() => {
        dispatch(fetchPlanBenefitsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  } catch {
    dispatch(fetchPlanBenefitsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
  }
};

export const fetchFixedPlans = (): AppThunk => (dispatch) => {
  try {
    dispatch(fetchFixedPlansRequest());
    
    getFixedPlansApi()
      .then((response) => {
        dispatch(fetchFixedPlansSuccess(response));
      })
      .catch(() => {
        dispatch(fetchFixedPlansFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  } catch {
    dispatch(fetchFixedPlansFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
  }
};

export const fetchPlanDetails = (id: string): AppThunk => (dispatch) => {
  try {
    dispatch(fetchPlanDetailsRequest());

    getPlanByIdApi(id)
      .then((response) => {
        dispatch(fetchPlanDetailsSuccess(response));
      })
      .catch(() => {
        dispatch(fetchPlanDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  } catch {
    dispatch(fetchPlanDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
  }
};

export const toggleBenefit = (id: number): AppThunk => (dispatch) => {
  dispatch(toggleBenefitSelection(id));
};

export const clearBenefitErrors = (): AppThunk => (dispatch) => {
  dispatch(clearBenefitsError());
};

export const clearFixedPlanErrors = (): AppThunk => (dispatch) => {
  dispatch(clearFixedPlansError());
};

export const selectPlan = (planData: SelectedPlanData): AppThunk => (dispatch) => {
  dispatch(setSelectedPlan(planData));
};

export const clearPlan = (): AppThunk => (dispatch) => {
  dispatch(clearSelectedPlan());
};

export const createCustomPlan = (payload: ICreateCustomPlanPayload): AppThunk => (dispatch) => {
  try {
    dispatch(createCustomPlanRequest());
    
    createCustomPlanApi(payload)
      .then((response) => {
        dispatch(createCustomPlanSuccess(response));
        dispatch(setSelectedPlan(response));
      })
      .catch(() => {
        dispatch(createCustomPlanFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  } catch {
    dispatch(createCustomPlanFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
  }
};

export const clearCustomPlanState = (): AppThunk => (dispatch) => {
  dispatch(clearCreateCustomPlanState());
  dispatch(clearUpdateCustomPlanState());
  dispatch(clearPlanDetailsState());
};

export const resetPlanState = (): AppThunk => (dispatch) => {
  dispatch(clearCreateCustomPlanState());
  dispatch(clearUpdateCustomPlanState());
  dispatch(clearPlanDetailsState());
  dispatch(clearSelectedPlan());
  dispatch(resetPlanBenefitsSelection());
};

export const updateCustomPlan = (id: string, payload: ICreateCustomPlanPayload): AppThunk => (dispatch) => {
  try {
    dispatch(updateCustomPlanRequest());

    createCustomPlanApi({ ...payload, id })
      .then((response) => {
        dispatch(updateCustomPlanSuccess(response));
      })
      .catch((error) => {
        dispatch(updateCustomPlanFailure(  error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      });
  } catch {
    dispatch(updateCustomPlanFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
  }
};

export const addBusiness = (payload: Omit<IAddBusinessPayload, 'tenantId'>): AppThunk => (dispatch) => {
  dispatch(addBusinessRequest());
  return addBusinessApi(payload)
    .then((response) => {
      dispatch(addBusinessSuccess());
      return response;
    })
    .catch((error) => {
      let errorMessage = translateMessage('Admin.Delivery.App.SomethingWentWrong');
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      dispatch(addBusinessFailure(errorMessage));
    });
};
export const clearAddBusiness = (): AppThunk => (dispatch) => {
  dispatch(clearAddBusinessState());
};

export const fetchBusinessListingAction = (filter: IBusinessListFilter, page: number, size: number): AppThunk => (dispatch) => {
  dispatch(fetchBusinessListingRequest());
  return getAllBusinessList(filter, page, size)
      .then((result) => {
          dispatch(fetchBusinessListingSuccess(result));
          return result;
      })
      .catch(() => {
          dispatch(fetchBusinessListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
          );
      });
};

export const fetchBusinessDataDetailsAction = (id: string): AppThunk<Promise<IBusiness | undefined>> => (dispatch) => {
  dispatch(fetchBusinessDetailsRequest());
  return getBusinessDetailsById(id).then((result: IBusiness) => {
      dispatch(fetchBusinessDetailsSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchBusinessDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
      return undefined;
    });
};

export const fetchBusinessSignupAnalyticsAction = (startMonth: string, endMonth: string): AppThunk => (dispatch) => {
  dispatch(fetchBusinessSignupAnalyticsRequest());
  return fetchBusinessSignupAnalyticsApi(startMonth, endMonth)
    .then((result: ICutsomerData[]) => {
      const transformed = result.map((item) => ({
        label: item.monthName,
        value: item.count,
      }));

      dispatch(fetchBusinessSignupAnalyticsSuccess(transformed));
      return transformed;
    })
    .catch(() => {
      dispatch(fetchBusinessSignupAnalyticsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
    });
};

export const toggleBusinessStatus = (tenantId: number, isActive: boolean): AppThunk => (dispatch) => {
  dispatch(toggleBusinessStatusRequest());
  
  const apiCall = isActive ? deactivateBusinessApi(tenantId) : activateBusinessApi(tenantId);
  
  return apiCall
    .then(() => {
      dispatch(toggleBusinessStatusSuccess());
      return true;
    })
    .catch((error) => {
      let errorMessage = translateMessage('Admin.Delivery.App.SomethingWentWrong');
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      dispatch(toggleBusinessStatusFailure(errorMessage));
      return false;
    });
};
