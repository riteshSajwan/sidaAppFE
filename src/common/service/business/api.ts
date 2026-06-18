import { buildQueryParam } from 'src/common/service/ApiUtil';
import { IFixedPlan, IPlanBenefit } from 'src/common/service/business/slice';
import { default as restService, default as RestService } from 'src/common/service/restService/restService';
import { IBusinessListFilter, IBusinessListResponse } from 'src/components/Business/BusinessListUtils';
import { ICustomPlanResponseDto } from 'src/components/Business/Plans/PlansUtils';
import { IAddBusinessResponse } from 'src/components/Business/add/addBusinessUtils';
import { ICutsomerData } from 'src/components/ReportsPage/ReportUtil';
import { AUTH_BASE_URL } from 'src/constants';

export const getPlanBenefitsApi = (): Promise<IPlanBenefit[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(AUTH_BASE_URL + `/api/subscription/benefits`, {
      method: 'GET',
      headers,
    });
  });
};

export const getFixedPlansApi = (): Promise<IFixedPlan[]> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(AUTH_BASE_URL + `/api/subscription/plans?planType=FIXED`, {
      method: 'GET',
      headers,
    });
  });
};

export const getPlanByIdApi = (id: string): Promise<IFixedPlan> => {
  return RestService.generateHeaders().then((headers) => {
    return RestService.fetch(AUTH_BASE_URL + `/api/subscription/plans/${id}`, {
      method: 'GET',
      headers,
    });
  });
};

export interface ICreateCustomPlanPayload {
  id?: string | number;
  activePlanId?: string;
  planName: string;
  billingCycleMonths: number;
  benefitIds: number[];
  planType: string;
  billingCycle: string,
  riderLimit: number;
  price?: number;
  extraRideChargePercentage?: number;
  shortRideAmount?: number;
  shortRideShareAmount?: number;
  longRideShareAmount?: number;
  monthlyCharges: number;
  onboardingFirstTimeCharge: number;
  countryName?: string;
  countryISO?: string;
  currency?: string;
}

export interface IAddBusinessPayload {
    id:string
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
    fleetSize: number;
    riderLimit: number;
    businessAddress: string;
    planId?: string; // Add planId as optional field
    rideLimit?: number; // Add rideLimit as optional field
}

export const createCustomPlanApi = async (
  payload: ICreateCustomPlanPayload
): Promise<ICustomPlanResponseDto> => {
  const headers = await restService.generateHeaders({
    'Content-Type': 'application/json',
  });

  return restService.fetch(
    `${AUTH_BASE_URL}/api/subscription/plans`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }
  );
};

export const addBusinessApi = async (
  payload: IAddBusinessPayload
): Promise<IAddBusinessResponse> => {
  const headers = await restService.generateHeaders({
    'Content-Type': 'application/json',
  });

  return restService.fetch(
    `${AUTH_BASE_URL}/api/tenant/provision`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    }
  );
};

export const getAllBusinessList = (filter: IBusinessListFilter, page?: number, size?: number): Promise<IBusinessListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const queryParams = [
      buildQueryParam('sortField', filter.sortField),
      buildQueryParam('sortOrder', filter.sortOrder),
      buildQueryParam('searchKey', filter.searchKey),
      buildQueryParam('active', filter.active),
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/tenant/all/paginated?${queryParams}`, {
      method: 'GET',
      headers,
    }
    );
  });
};

export const getBusinessDetailsById = (id: string) => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(AUTH_BASE_URL + `/api/tenant/${id}`, {
      method: 'GET',
      headers,
    })
  );
};

export const fetchBusinessSignupAnalyticsApi = (startMonth: string, endMonth: string): Promise<ICutsomerData[]> => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(`${AUTH_BASE_URL}/api/tenant/signup-analytics?startMonth=${startMonth}&endMonth=${endMonth}`, {
      method: 'GET',
      headers,
    })
  );
};

export const activateBusinessApi = async (tenantId: number): Promise<void> => {
  const headers = await restService.generateHeaders({
    'Content-Type': 'application/json',
  });

  return restService.fetch(
    `${AUTH_BASE_URL}/api/tenant/activate/${tenantId}`,
    {
      method: 'POST',
      headers,
    }
  );
};

export const deactivateBusinessApi = async (tenantId: number): Promise<void> => {
  const headers = await restService.generateHeaders({
    'Content-Type': 'application/json',
  });

  return restService.fetch(
    `${AUTH_BASE_URL}/api/tenant/deprovision/${tenantId}`,
    {
      method: 'DELETE',
      headers,
    }
  );
};
