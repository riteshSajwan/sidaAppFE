import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshUserToken } from 'src/common/service/auth/action';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { ROLES } from 'src/common/utils/permissionUtils';
import { getRefreshToken } from 'src/common/utils/refreshTokenUtils';
import { getUserRole } from 'src/common/utils/roleStorageUtils';
import { getUserToken } from 'src/common/utils/tokenUtils';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';
import { getCurrentLang } from 'src/i18n/i18nUtils';
import { store } from 'src/store';
// export const getTenantId = () => {
//   return 'uberfixed_1774256598959';
// };
export const getTenantHeaders = (tenantId?: string | null): Record<string, string> => {
  if (!tenantId) return {};

  return {
    'X-Tenant-ID': tenantId,
  };
};
class RestServiceWrapper {
  public getAuthHeader(token?: string, skipTenantId: boolean = false): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Accept-Language': getCurrentLang(),
    };

    // Add X-Tenant-Id header if tenantId exists in AsyncStorage and not skipped
    if (skipTenantId) {
      return Promise.resolve(headers);
    }

    return AsyncStorage.getItem(AsyncStorageKey.TENANT_ID)
      .then((tenantId: string | null) => {
        if (tenantId) {
          headers['X-Tenant-Id'] = tenantId;
        }
        return headers;
      })
      .catch(() => {
        // Silently fail if unable to get tenantId
        return headers;
      });
  }

  public generateUserRole() {
    return getUserRole().then((role) => {
      return {
        role: role || ROLES.SUPERADMIN,
      };
    });
  }

  public async generateHeaders(headers?: { [headerName: string]: string }, skipTenantId: boolean = false) {
    const token = await getUserToken();

    if (!token) {
      return;
    }

    const authHeaders = await this.getAuthHeader(token, skipTenantId);

    return {
      ...authHeaders,
      ...headers,
    };
  }

  public fetch(input: Request | string, init?: RequestInit, retry = true): Promise<any> {
    type ResponseData = ArrayBuffer | string | Record<string, unknown>;
    const handleResponse = (response: Response): Promise<ResponseData> => {
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        if (!!contentDisposition && !contentType) {
          return response.arrayBuffer();
        }

        if (contentType?.includes('application/json')) {
          return response.json();
        }
        return response.text();
      } else if (response.status === 401 && retry) {
        return this.refreshTokenAndRetry(init).then((updatedInit) => {
          if (updatedInit) {
            return this.fetch(input, updatedInit, false);
          }
          throw new Error('Unauthorized');
        });
      }
      return response
        .clone()
        .json()
        .then((error) => {
          throw error;
        });
    };

    const fetchPromise = fetch(input, init)
      .then(handleResponse)
      .catch((error) => {
        throw error;
      });
    return fetchPromise;
  }

  private refreshInProgress: Promise<string | null> | null = null;
  private async refreshTokenAndRetry(init?: RequestInit): Promise<RequestInit | null> {
    if (!this.refreshInProgress) {
      this.refreshInProgress = this.performTokenRefresh();
    }

    const newToken = await this.refreshInProgress;
    this.refreshInProgress = null;

    if (newToken) {
      const authHeaders = await this.getAuthHeader(newToken, false);
      const updatedHeaders = {
        ...init?.headers,
        ...authHeaders,
      };
      return {
        ...init,
        headers: updatedHeaders,
      };
    }
    return null;
  }

  private async performTokenRefresh(): Promise<string | null> {
    const deviceToken = await getDeviceToken();
    const refreshToken = await getRefreshToken();

    if (deviceToken && refreshToken) {
      const refreshResponse = await store.dispatch(refreshUserToken({ deviceToken, refreshToken }));

      if (refreshResponse) {
        const newToken = await getUserToken();
        return newToken;
      }
    }
    return null;
  }
}

export default new RestServiceWrapper();
