import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBusiness, IBusinessListResponse } from 'src/components/Business/BusinessListUtils';
import { PlanType } from 'src/components/Business/Plans/PlansUtils';
import { IOption } from 'src/components/ReportsPage/ReportUtil';

export interface SelectedPlanData {
    planId: string;
    planName: string;
    planType: PlanType;
    price: number;
}

export interface IPlanBenefit {
    id: number;
    benefitName: string;
    description: string | null;
    unitPrice: number | null;
    quantity: number | null;
}

export interface ISelectedBenefit {
    id: number;
    selected: boolean;
}

export interface IPlanBenefitsState {
    data: IPlanBenefit[];
    selectedBenefits: ISelectedBenefit[];
    loading: boolean;
    error: string |null;
}

export interface IFixedPlan {
    id: number;
    planName: string;
    planType: string;
    durationMonths: number;
    billingCycleMonths?: number;
    price: number;
    totalPrice: number;
    currency: string;
    benefits: IPlanBenefit[];
    createdAt: string;
    riderLimit: number;
    extraRideChargePercentage?: number;
    shortRideAmount?: number;
    shortRideShareAmount?: number;
    longRideShareAmount?: number;
    monthlyCharges?: number;
    onboardingFirstTimeCharge?: number;
    countryName?: string;
    countryISO?: string;
}

export interface IFixedPlansState {
    data: IFixedPlan[];
    loading: boolean;
    error: string |null;
}
export interface ICustomPlanReponse{
 success: boolean;
  planId: number;
  message: string;
}
export interface ICreateCustomPlanState {
    loading: boolean;
    error: string |null;
    success: boolean;
    data: ICustomPlanReponse | null; 
}

export interface IPlanDetailsState {
    loading: boolean;
    error: string | null;
    data: IFixedPlan | null;
}

export interface IAddBusinessState {
    loading: boolean;
    error: string | null;
    success: boolean;
}
export interface BuisnessListingState {
    loading: boolean;
    error: string | null;
    data: IBusinessListResponse;
    snackbarVisible: boolean;
    toggleSuccess: boolean;
}
interface BusinessDetailsState {
    loading: boolean;
    error: string | null;
    data: IBusiness | null;
  }
interface BusinessSignupAnalyticsState {
    loading: boolean;
    error: string | null;
    data: IOption[];
}

export interface BusinessState {
    selectedPlan: SelectedPlanData | null;
    planBenefits: IPlanBenefitsState;
    fixedPlans: IFixedPlansState;
    planDetails: IPlanDetailsState;
    createCustomPlan: ICreateCustomPlanState;
    updateCustomPlan: ICreateCustomPlanState;
    addBusiness: IAddBusinessState;
    businessListing: BuisnessListingState;
    businessDetails: BusinessDetailsState;
    businessSignupAnalytics: BusinessSignupAnalyticsState;
}

export const BusinessInitialState: BusinessState = {
    selectedPlan: null,
    planBenefits: {
        data: [],
        selectedBenefits: [],
        loading: false,
        error: null,
    },
    fixedPlans: {
        data: [],
        loading: false,
        error: null,
    },
    planDetails: {
        data: null,
        loading: false,
        error: null,
    },
    createCustomPlan: {
        loading: false,
        error: null,
        success: false,
        data: null,
    },
    updateCustomPlan: {
        loading: false,
        error: null,
        success: false,
        data: null,
    },
    addBusiness: {
        loading: false,
        error: null,
        success: false,
    },
    businessListing: {
        loading: false,
        error: null,
        data: { data: [], total: 0, page: 0, size: 0 },
        snackbarVisible: false,
        toggleSuccess: false,
    },
    businessDetails: {
        loading: false,
        error: null,
        data: null,
      },
    businessSignupAnalytics: {
        loading: false,
        error: null,
        data: [],
    },
      
};

const businessSlice = createSlice({
    name: 'business',
    initialState: BusinessInitialState,
    reducers: {
        setSelectedPlan(state, action: PayloadAction<SelectedPlanData>) {
            state.selectedPlan = action.payload;
        },
        clearSelectedPlan(state) {
            state.selectedPlan = null;
        },
        fetchPlanBenefitsRequest(state) {
            state.planBenefits.loading = true;
            state.planBenefits.error = null;
        },
        fetchPlanBenefitsSuccess(state, action: PayloadAction<IPlanBenefit[]>) {
            state.planBenefits.loading = false;
            state.planBenefits.data = action.payload;
            state.planBenefits.selectedBenefits = action.payload.map(benefit => ({
                id: benefit.id,
                selected: true,
            }));
        },
        fetchPlanBenefitsFailure(state, action: PayloadAction<string>) {
            state.planBenefits.loading = false;
            state.planBenefits.error = action.payload;
        },
        toggleBenefitSelection(state, action: PayloadAction<number>) {
            const benefitId = action.payload;
            const benefit = state.planBenefits.selectedBenefits.find((b: ISelectedBenefit) => b.id === benefitId);
            if (benefit) {
                benefit.selected = !benefit.selected;
            }
        },
        clearBenefitsError(state) {
            state.planBenefits.error = null;
        },
        resetPlanBenefitsSelection(state) {
            state.planBenefits.selectedBenefits = state.planBenefits.data.map(benefit => ({
                id: benefit.id,
                selected: true,
            }));
        },
        fetchFixedPlansRequest(state) {
            state.fixedPlans.loading = true;
            state.fixedPlans.error = null;
        },
        fetchFixedPlansSuccess(state, action: PayloadAction<IFixedPlan[]>) {
            state.fixedPlans.loading = false;
            state.fixedPlans.data = action.payload;
        },
        fetchFixedPlansFailure(state, action: PayloadAction<string>) {
            state.fixedPlans.loading = false;
            state.fixedPlans.error = action.payload;
        },
        clearFixedPlansError(state) {
            state.fixedPlans.error = null;
        },
        fetchPlanDetailsRequest(state) {
            state.planDetails.loading = true;
            state.planDetails.error = null;
            state.planDetails.data = null;
        },
        fetchPlanDetailsSuccess(state, action: PayloadAction<IFixedPlan>) {
            state.planDetails.loading = false;
            state.planDetails.data = action.payload;
        },
        fetchPlanDetailsFailure(state, action: PayloadAction<string>) {
            state.planDetails.loading = false;
            state.planDetails.error = action.payload;
        },
        clearPlanDetailsState(state) {
            state.planDetails.loading = false;
            state.planDetails.error = null;
            state.planDetails.data = null;
        },
        createCustomPlanRequest(state) {
            state.createCustomPlan.loading = true;
            state.createCustomPlan.error = null;
            state.createCustomPlan.success = false;
            state.createCustomPlan.data = null;
        },
        createCustomPlanSuccess(state, action: PayloadAction<ICustomPlanReponse>) {
            state.createCustomPlan.loading = false;
            state.createCustomPlan.success = true;
            state.createCustomPlan.data = action.payload;
            state.planBenefits.selectedBenefits = state.planBenefits.selectedBenefits.map(b => ({
                ...b,
                selected: false,
            }));
        },
        createCustomPlanFailure(state, action: PayloadAction<string>) {
            state.createCustomPlan.loading = false;
            state.createCustomPlan.error = action.payload;
            state.createCustomPlan.success = false;
        },
        clearCreateCustomPlanState(state) {
            state.createCustomPlan.loading = false;
            state.createCustomPlan.error = null;
            state.createCustomPlan.success = false;
            state.createCustomPlan.data = null;
        },
        updateCustomPlanRequest(state) {
            state.updateCustomPlan.loading = true;
            state.updateCustomPlan.error = null;
            state.updateCustomPlan.success = false;
            state.updateCustomPlan.data = null;
        },
        updateCustomPlanSuccess(state, action: PayloadAction<ICustomPlanReponse>) {
            state.updateCustomPlan.loading = false;
            state.updateCustomPlan.success = true;
            state.updateCustomPlan.data = action.payload;
        },
        updateCustomPlanFailure(state, action: PayloadAction<string>) {
            state.updateCustomPlan.loading = false;
            state.updateCustomPlan.error = action.payload;
            state.updateCustomPlan.success = false;
        },
        clearUpdateCustomPlanState(state) {
            state.updateCustomPlan.loading = false;
            state.updateCustomPlan.error = null;
            state.updateCustomPlan.success = false;
            state.updateCustomPlan.data = null;
        },
        addBusinessRequest(state) {
            state.addBusiness.loading = true;
            state.addBusiness.error = null;
            state.addBusiness.success = false;
        },
        addBusinessSuccess(state) {
            state.addBusiness.loading = false;
            state.addBusiness.success = true;
        },
        addBusinessFailure(state, action: PayloadAction<any>) {
            state.addBusiness.loading = false;
            state.addBusiness.error = action.payload;
            state.addBusiness.success = false;
        },
        clearAddBusinessState(state) {
            state.addBusiness.loading = false;
            state.addBusiness.error = null;
            state.addBusiness.success = false;
        },
        fetchBusinessListingRequest(state) {
            state.businessListing.loading = true;
            state.businessListing.error = null;
        },
        fetchBusinessListingSuccess(state, action: PayloadAction<IBusinessListResponse>) {
            state.businessListing.loading = false;
            state.businessListing.data = action.payload;
        },
        fetchBusinessListingFailure(state, action: PayloadAction<string>) {
            state.businessListing.loading = false;
            state.businessListing.error = action.payload;
        },
        resetBusinessListing(state) {
            state.businessListing = BusinessInitialState.businessListing;
        },
        fetchBusinessDetailsRequest(state) {
            state.businessDetails.loading = true;
            state.businessDetails.error = null;
          },
        fetchBusinessDetailsSuccess(state, action: PayloadAction<IBusiness>) {
            state.businessDetails.loading = false;
            state.businessDetails.data = action.payload;
          },
        fetchBusinessDetailsFailure(state, action: PayloadAction<string>) {
            state.businessDetails.loading = false;
            state.businessDetails.error = action.payload;
        },
        resetBusinessDetails(state) {
            state.businessDetails = BusinessInitialState.businessDetails;
          },
        fetchBusinessSignupAnalyticsRequest(state) {
            state.businessSignupAnalytics.loading = true;
            state.businessSignupAnalytics.error = null;
        },
        fetchBusinessSignupAnalyticsSuccess(state, action: PayloadAction<IOption[]>) {
            state.businessSignupAnalytics.loading = false;
            state.businessSignupAnalytics.data = action.payload;
        },
        fetchBusinessSignupAnalyticsFailure(state, action: PayloadAction<string>) {
            state.businessSignupAnalytics.loading = false;
            state.businessSignupAnalytics.error = action.payload;
        },
        toggleBusinessStatusRequest(state) {
            state.businessListing.loading = true;
            state.businessListing.error = null;
            state.businessListing.toggleSuccess = false;
        },
        toggleBusinessStatusSuccess(state) {
            state.businessListing.loading = false;
            state.businessListing.toggleSuccess = true;
        },
        toggleBusinessStatusFailure(state, action: PayloadAction<string>) {
            state.businessListing.loading = false;
            state.businessListing.error = action.payload;
            state.businessListing.toggleSuccess = false;
        },
        resetToggleSuccess(state) {
            state.businessListing.toggleSuccess = false;
        },
    },
});

export const {
    setSelectedPlan,
    clearSelectedPlan,
    fetchPlanBenefitsRequest,
    fetchPlanBenefitsSuccess,
    fetchPlanBenefitsFailure,
    toggleBenefitSelection,
    clearBenefitsError,
    resetPlanBenefitsSelection,
    fetchFixedPlansRequest,
    fetchFixedPlansSuccess,
    fetchFixedPlansFailure,
    clearFixedPlansError,
    fetchPlanDetailsRequest,
    fetchPlanDetailsSuccess,
    fetchPlanDetailsFailure,
    clearPlanDetailsState,
    createCustomPlanRequest,
    createCustomPlanSuccess,
    createCustomPlanFailure,
    clearCreateCustomPlanState,
    updateCustomPlanRequest,
    updateCustomPlanSuccess,
    updateCustomPlanFailure,
    clearUpdateCustomPlanState,
    addBusinessRequest,
    addBusinessSuccess,
    addBusinessFailure,
    clearAddBusinessState,
    fetchBusinessListingRequest,
    fetchBusinessListingSuccess,
    fetchBusinessListingFailure,
    resetBusinessListing,
    fetchBusinessDetailsRequest,
    fetchBusinessDetailsSuccess,
    fetchBusinessDetailsFailure,
    resetBusinessDetails,
    fetchBusinessSignupAnalyticsRequest,
    fetchBusinessSignupAnalyticsSuccess,
    fetchBusinessSignupAnalyticsFailure,
    toggleBusinessStatusRequest,
    toggleBusinessStatusSuccess,
    toggleBusinessStatusFailure,
    resetToggleSuccess
} = businessSlice.actions;

export const BusinessReducer = businessSlice.reducer;
