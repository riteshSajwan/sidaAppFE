import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IBankDataResponse } from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import { ILegalResponse } from 'src/components/DriverOnboarding/LegalDocuments/LegalDocumentUtil';
import { IProfileResponse } from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';

export interface IProfileDataState {
  data: IProfileResponse | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean; // Flag to track if it's an update operation
  updateSuccess: boolean; // Flag to track successful update
}

export interface ILegalDataState {
  data: ILegalResponse | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateSuccess: boolean;
}

export interface IBankDataState {
  data: IBankDataResponse[] | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateSuccess: boolean;
}

export interface IOnboardingState {
  currentStep: string;
  fromProfile: boolean;
  fromLegal: boolean;
  fromBank: boolean;
  profileData: IProfileDataState;
  legalData: ILegalDataState;
  bankData: IBankDataState;
}

const initialProfileDataState: IProfileDataState = {
  data: null,
  loading: false,
  error: null,
  isUpdating: false,
  updateSuccess: false,
};

const initialLegalDataState: ILegalDataState = {
  data: null,
  loading: false,
  error: null,
  isUpdating: false,
  updateSuccess: false,
};

const initialBankDataState: IBankDataState = {
  data: null,
  loading: false,
  error: null,
  isUpdating: false,
  updateSuccess: false,
};

const initialState: IOnboardingState = {
  currentStep: 'step1',
  fromProfile: false,
  fromLegal: false,
  fromBank: false,
  profileData: initialProfileDataState,
  legalData: initialLegalDataState,
  bankData: initialBankDataState,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<string>) {
      state.currentStep = action.payload;
    },
    resetOnboardingStep(state) {
      state.currentStep = initialState.currentStep;
    },
    // Profile Data Actions
    fetchProfileDataRequest(state) {
      state.profileData.loading = true;
      state.profileData.error = null;
      state.profileData.isUpdating = false;
      state.profileData.updateSuccess = false;
    },
    fetchProfileDataSuccess(state, action: PayloadAction<IProfileResponse>) {
      state.profileData.loading = false;
      state.profileData.data = action.payload;
      state.profileData.error = null;
      state.profileData.isUpdating = false;
      state.profileData.updateSuccess = false;
    },
    fetchProfileDataFailure(state, action: PayloadAction<string>) {
      state.profileData.loading = false;
      state.profileData.error = action.payload;
      state.profileData.isUpdating = false;
      state.profileData.updateSuccess = false;
    },
    updateProfileDataRequest(state) {
      state.profileData.loading = true;
      state.profileData.error = null;
      state.profileData.isUpdating = true;
      state.profileData.updateSuccess = false;
    },
    updateProfileDataSuccess(state, action: PayloadAction<IProfileResponse>) {
      state.profileData.loading = false;
      state.profileData.data = action.payload;
      state.profileData.error = null;
      state.profileData.isUpdating = false;
      state.profileData.updateSuccess = true;
    },
    updateProfileDataFailure(state, action: PayloadAction<string>) {
      state.profileData.loading = false;
      state.profileData.error = action.payload;
      state.profileData.isUpdating = false;
      state.profileData.updateSuccess = false;
    },
    resetProfileData(state) {
      state.profileData = initialProfileDataState;
    },
    resetUpdateSuccess(state) {
      state.profileData.updateSuccess = false;
    },
    // Legal Data Actions
    fetchLegalDataRequest(state) {
      state.legalData.loading = true;
      state.legalData.error = null;
      state.legalData.isUpdating = false;
      state.legalData.updateSuccess = false;
    },
    fetchLegalDataSuccess(state, action: PayloadAction<ILegalResponse>) {
      state.legalData.loading = false;
      state.legalData.data = action.payload;
      state.legalData.error = null;
      state.legalData.isUpdating = false;
      state.legalData.updateSuccess = false;
    },
    fetchLegalDataFailure(state, action: PayloadAction<string>) {
      state.legalData.loading = false;
      state.legalData.error = action.payload;
      state.legalData.isUpdating = false;
      state.legalData.updateSuccess = false;
    },
    updateLegalDataRequest(state) {
      state.legalData.loading = true;
      state.legalData.error = null;
      state.legalData.isUpdating = true;
      state.legalData.updateSuccess = false;
    },
    updateLegalDataSuccess(state, action: PayloadAction<ILegalResponse>) {
      state.legalData.loading = false;
      state.legalData.data = action.payload;
      state.legalData.error = null;
      state.legalData.isUpdating = false;
      state.legalData.updateSuccess = true;
    },
    updateLegalDataFailure(state, action: PayloadAction<string>) {
      state.legalData.loading = false;
      state.legalData.error = action.payload;
      state.legalData.isUpdating = false;
      state.legalData.updateSuccess = false;
    },
    resetLegalData(state) {
      state.legalData = initialLegalDataState;
    },
    resetLegalUpdateSuccess(state) {
      state.legalData.updateSuccess = false;
    },
    // Bank Data Actions
    fetchBankDataRequest(state) {
      state.bankData.loading = true;
      state.bankData.error = null;
      state.bankData.isUpdating = false;
      state.bankData.updateSuccess = false;
    },
    fetchBankDataSuccess(state, action: PayloadAction<IBankDataResponse[]>) {
      state.bankData.loading = false;
      state.bankData.data = action.payload;
      state.bankData.error = null;
      state.bankData.isUpdating = false;
      state.bankData.updateSuccess = false;
    },
    fetchBankDataFailure(state, action: PayloadAction<string>) {
      state.bankData.loading = false;
      state.bankData.error = action.payload;
      state.bankData.isUpdating = false;
      state.bankData.updateSuccess = false;
    },
    updateBankDataRequest(state) {
      state.bankData.loading = true;
      state.bankData.error = null;
      state.bankData.isUpdating = true;
      state.bankData.updateSuccess = false;
    },
    updateBankDataSuccess(state, action: PayloadAction<IBankDataResponse[]>) {
      state.bankData.loading = false;
      state.bankData.data = action.payload;
      state.bankData.error = null;
      state.bankData.isUpdating = false;
      state.bankData.updateSuccess = true;
    },
    updateBankDataFailure(state, action: PayloadAction<string>) {
      state.bankData.loading = false;
      state.bankData.error = action.payload;
      state.bankData.isUpdating = false;
      state.bankData.updateSuccess = false;
    },
    resetBankData(state) {
      state.bankData = initialBankDataState;
    },
    resetBankUpdateSuccess(state) {
      state.bankData.updateSuccess = false;
    },
  },
});

export const OnboardingReducer = onboardingSlice.reducer;
export const {
  setCurrentStep,
  resetOnboardingStep,
  fetchProfileDataRequest,
  fetchProfileDataSuccess,
  fetchProfileDataFailure,
  updateProfileDataRequest,
  updateProfileDataSuccess,
  updateProfileDataFailure,
  resetProfileData,
  resetUpdateSuccess,
  fetchLegalDataRequest,
  fetchLegalDataSuccess,
  fetchLegalDataFailure,
  updateLegalDataRequest,
  updateLegalDataSuccess,
  updateLegalDataFailure,
  resetLegalData,
  resetLegalUpdateSuccess,
  fetchBankDataRequest,
  fetchBankDataSuccess,
  fetchBankDataFailure,
  updateBankDataRequest,
  updateBankDataSuccess,
  updateBankDataFailure,
  resetBankData,
  resetBankUpdateSuccess,
} = onboardingSlice.actions;
