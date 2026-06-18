import { setLoginStatus } from 'src/common/service/auth/slice';
import {
  getActiveCityList,
  getCityInfo,
  getCountryInfo,
  getLegalData,
  getProfileData,
  getRiderBankData,
  legalInformationData,
  legalUpdatedInformationData,
  personalInformationData,
  removeImage,
  updateBankData,
  uploadInsuranceImage,
  uploadLicenseImage,
  uploadProfileImage,
  uploadRegistrationImage,
} from 'src/common/service/onboarding/api';
import {
  fetchBankDataFailure,
  fetchBankDataRequest,
  fetchBankDataSuccess,
  fetchLegalDataFailure,
  fetchLegalDataRequest,
  fetchLegalDataSuccess,
  fetchProfileDataFailure,
  fetchProfileDataRequest,
  fetchProfileDataSuccess,
  resetOnboardingStep,
  setCurrentStep,
  updateBankDataFailure,
  updateBankDataRequest,
  updateBankDataSuccess,
  updateLegalDataFailure,
  updateLegalDataRequest,
  updateLegalDataSuccess,
  updateProfileDataFailure,
  updateProfileDataRequest,
  updateProfileDataSuccess,
} from 'src/common/service/onboarding/slice';
import { IBankDataResponse } from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import { IImageRes, ILegalInfo, ILegalResponse, ILegalUpdatedInfo, IRemoveImage } from 'src/components/DriverOnboarding/LegalDocuments/LegalDocumentUtil';
import { IProfileImageResponse, IProfileResponse } from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';
import { IActiveCityListResponse, IApiErrorDetailResponse, ICityData, ICityRequestData, ICountryData } from 'src/components/DriverOnboarding/util/OnBoardingUtil';
import { AppThunk } from 'src/store';

export const getCities =
  (id: string, page?: number, size?: number): AppThunk =>
  (dispatch) => {
    return getActiveCityList(id, page, size)
      .then((response: IActiveCityListResponse) => response)
      .catch((error) => {
        throw error;
      });
  };

// Reactive action for fetching profile data
export const fetchProfileDataAction =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchProfileDataRequest());

    return getProfileData(id)
      .then((response: IProfileResponse) => {
        dispatch(fetchProfileDataSuccess(response));
        dispatch(setLoginStatus(true));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to fetch profile data';

        dispatch(fetchProfileDataFailure(errorMessage));
        throw error;
      });
  };

// Reactive action for updating personal information
export const updatePersonalInformationAction =
  (data: FormData): AppThunk =>
  (dispatch) => {
    dispatch(updateProfileDataRequest());

    return personalInformationData(data)
      .then((response) => {
        dispatch(updateProfileDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update personal information';

        dispatch(updateProfileDataFailure(errorMessage));
        throw error;
      });
  };

// export const sendPersonalInformation =
//   (data: IRiderRequestDto): AppThunk<Promise<IProfileResponse>> =>
//   async (dispatch) => {
//     try {
//       const response = await personalInformationData(data);
//       await dispatch(profileData(response));
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   };

export const sendLegalInformation =
  (data: ILegalInfo): AppThunk<Promise<ILegalResponse>> =>
  () => {
    return legalInformationData(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const sendLegalUpdatedInformation =
  (data: ILegalUpdatedInfo): AppThunk<Promise<ILegalResponse>> =>
  () => {
    return legalUpdatedInformationData(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const uploadProfileImg =
  (data: FormData): AppThunk<Promise<IProfileImageResponse>> =>
  () => {
    return uploadProfileImage(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const uploadLicenseImg =
  (data: FormData): AppThunk<Promise<IImageRes>> =>
  () => {
    return uploadLicenseImage(data)
      .then((response: IImageRes) => response)
      .catch((error) => {
        throw error;
      });
  };

export const uploadRegistrationImg =
  (data: FormData): AppThunk<Promise<IImageRes>> =>
  () => {
    return uploadRegistrationImage(data)
      .then((response: IImageRes) => response)
      .catch((error) => {
        throw error;
      });
  };

export const uploadInsuranceImg =
  (data: FormData): AppThunk<Promise<IImageRes>> =>
  () => {
    return uploadInsuranceImage(data)
      .then((response: IImageRes) => response)
      .catch((error) => {
        throw error;
      });
  };

export const removeImgData =
  (data: IRemoveImage): AppThunk<Promise<boolean>> =>
  () => {
    return removeImage(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const getCountryId =
  (data: string): AppThunk<Promise<ICountryData>> =>
  () => {
    return getCountryInfo(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const getCityId =
  (payload: ICityRequestData): AppThunk<Promise<ICityData>> =>
  () => {
    return getCityInfo(payload)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

export const updateBankDetails =
  (data: IBankDataResponse[]): AppThunk<Promise<IBankDataResponse[]>> =>
  () => {
    return updateBankData(data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  };

// Reactive action for fetching bank data
export const fetchBankDataAction =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchBankDataRequest());

    return getRiderBankData(id)
      .then((response: IBankDataResponse[]) => {
        dispatch(fetchBankDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to fetch bank data';

        dispatch(fetchBankDataFailure(errorMessage));
        throw error;
      });
  };

// Reactive action for updating bank data
export const updateBankDataAction =
  (data: IBankDataResponse[]): AppThunk =>
  (dispatch) => {
    dispatch(updateBankDataRequest());

    return updateBankData(data)
      .then((response: IBankDataResponse[]) => {
        dispatch(updateBankDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update bank data';

        dispatch(updateBankDataFailure(errorMessage));
        throw error;
      });
  };

// Onboarding Step Management Actions
export const updateOnboardingStep =
  (step: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setCurrentStep(step));
    } catch (error) {
      throw error;
    }
  };

export const resetOnboardingStepAction = (): AppThunk => async (dispatch) => {
  try {
    dispatch(resetOnboardingStep());
  } catch (error) {
    throw error;
  }
};

// Reactive action for fetching legal data
export const fetchLegalDataAction =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchLegalDataRequest());

    return getLegalData(id)
      .then((response: ILegalResponse) => {
        dispatch(fetchLegalDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to fetch legal data';

        dispatch(fetchLegalDataFailure(errorMessage));
        throw error;
      });
  };

// Reactive action for updating legal information (new)
export const updateLegalInformationAction =
  (data: ILegalInfo): AppThunk =>
  (dispatch) => {
    dispatch(updateLegalDataRequest());

    return legalInformationData(data)
      .then((response: ILegalResponse) => {
        dispatch(updateLegalDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update legal information';

        dispatch(updateLegalDataFailure(errorMessage));
        throw error;
      });
  };

// Reactive action for updating legal information (existing)
export const updateLegalInformationUpdatedAction =
  (data: ILegalUpdatedInfo): AppThunk =>
  (dispatch) => {
    dispatch(updateLegalDataRequest());

    return legalUpdatedInformationData(data)
      .then((response: ILegalResponse) => {
        dispatch(updateLegalDataSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || 'Failed to update legal information';

        dispatch(updateLegalDataFailure(errorMessage));
        throw error;
      });
  };
