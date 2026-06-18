import { SignInRequestDto, SignInResponseDto } from 'src/common/model/auth/login';
import { ILogoutRequest } from 'src/common/service/auth/slice';
import restService from 'src/common/service/restService/restService';
import { ROLES } from 'src/common/utils/permissionUtils';
import { getTenantId } from 'src/common/utils/tenantUtils';
import { API_AUTH_BUSINESS_ADMIN_URL, API_AUTH_CUSTOMER_URL, AUTH_BASE_URL, BUSINESS_ADMIN_LOGIN_URL, IS_SAAS, LOGIN_URL } from 'src/constants/index';
import { getCurrentLang } from 'src/i18n/i18nUtils';

export interface UserDetails {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  language: string;
  state: string;
  city: string;
  address: string;
  pinCode: string;
  status: string;
  activeStatus: boolean;
  profileUrl: string;
  isSuperAdmin: boolean;
  requireSetPassword: boolean;
  roles: string;
  role: Role;
  dob: string;
  gender: string;
  terms: boolean;
  enrolledOffers: boolean;
  superAdmin: boolean;
  onboardingSubmitted: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface ISilentResponse {
  otpVerified: boolean;
  token: string;
  userDetails: UserDetails;
  refreshToken: string;
}

interface ILogoutData {
  refreshToken: string;
  deviceToken: string;
  tenantId?: string | null;
}

export const fetchLogin = (data: SignInRequestDto, tenantId?: string | null, retries = 3) => {
  const attemptFetch = (attempt: number): Promise<SignInResponseDto> => {
    const headers: Record<string, string> = {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Accept-Language': getCurrentLang(),
    };

    // Add X-Tenant-Id header if tenantId is provided
    if (tenantId) {
      headers['X-Tenant-Id'] = tenantId;
    }

    // Non-SaaS: always use the normal login endpoint regardless of tenantId
    const loginUrl = !IS_SAAS ? LOGIN_URL : tenantId ? LOGIN_URL : BUSINESS_ADMIN_LOGIN_URL;
    const loginBody = !IS_SAAS ? data : tenantId ? data : { ...data, role: ROLES.BUSINESS_ADMIN };

    return fetch(loginUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(loginBody),
    })      .then((res) => {
        if (!res.ok) {
          return res
            .json()
            .catch(() => res.status)
            .then((error) => {
              return Promise.reject(error);
            });
        }
        return res.json();
      })
      .catch((e) => {
        // if (attempt < retries) {
        //   return attemptFetch(attempt + 1);
        // }
        return Promise.reject(e);
      });
  };

  return attemptFetch(0);
};

export const silentSignIn = (data: ILogoutRequest): Promise<ISilentResponse> => {
  return getTenantId().then((tenantId) => {
    return restService.generateUserRole().then((roleData) => {
      // Non-SaaS: always use the customer (normal) silent sign-in endpoint
      const baseUrl = !IS_SAAS
        ? API_AUTH_CUSTOMER_URL
        : tenantId
        ? API_AUTH_CUSTOMER_URL
        : API_AUTH_BUSINESS_ADMIN_URL;
      return fetch(`${baseUrl}/silent-sign-in`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Accept-Language': getCurrentLang(),
          ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
        },
        body: JSON.stringify({
          ...data,
          ...roleData,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res
              .json()
              .catch(() => ({}))
              .then((error) => {
                const enrichedError = { ...error.message, status: res.status };
                return Promise.reject(enrichedError);
              });
          }

          return res.json();
        })
        .catch((e) => Promise.reject(e));
    });
  });
};

export const handleUserLogout = (data: ILogoutData): Promise<string> => {
  const { tenantId, ...logoutData } = data;
  const logoutUrl = tenantId ? `${AUTH_BASE_URL}/api/auth/logout` : `${AUTH_BASE_URL}/api/auth/admin/signout`;

  return restService
    .generateHeaders({
      'Content-type': 'application/json; charset=UTF-8',
    })
    .then((headers) => {
      return restService.generateUserRole().then((roleData) => {
        return restService.fetch(logoutUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...logoutData,
            ...roleData,
          }),
        });
      });
    });
};
