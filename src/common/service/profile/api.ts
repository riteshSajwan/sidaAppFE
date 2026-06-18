import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILangInfo } from 'src/common/components/LangaugeSelector/LanguageSelectorUtil';
import { IProfileImageResponseDTO } from 'src/common/model/profile/profile';
import restService from 'src/common/service/restService/restService';
import { ROLES } from 'src/common/utils/permissionUtils';
import { AUTH_BASE_URL } from 'src/constants/index';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

export const getProfile = (token: string) => {
  // Check if user is product admin from AsyncStorage
  // Product admins should NEVER send tenant ID in profile API
  return AsyncStorage.getItem(AsyncStorageKey.ROLE)
    .then((role) => {
      let isProductAdmin = false;

      if (role === ROLES.BUSINESS_ADMIN) {
        isProductAdmin = true;
        // If parsing fails, assume not product admin
      }

      // Skip tenant ID if user is product admin
      const skipTenantId = isProductAdmin;

      return restService
        .generateHeaders(
          {
            Authorization: 'Bearer ' + token,
            'Content-type': 'application/json; charset=UTF-8',
          },
          skipTenantId,
        )
        .then((headers) => {
          return fetch(AUTH_BASE_URL + `/api/auth/profile`, {
            method: 'GET',
            headers,
          }).then((resp) => resp.json());
        });
    })
    .catch(() => {
      // If error reading storage, don't skip tenant ID (safer default)
      return restService
        .generateHeaders(
          {
            Authorization: 'Bearer ' + token,
            'Content-type': 'application/json; charset=UTF-8',
          },
          false,
        )
        .then((headers) => {
          return fetch(AUTH_BASE_URL + `/api/auth/profile`, {
            method: 'GET',
            headers,
          }).then((resp) => resp.json());
        });
    });
};

const uploadProfileImg = async (data: FormData): Promise<IProfileImageResponseDTO> => {
  const headers = await restService.generateHeaders();
  return AsyncStorage.getItem(AsyncStorageKey.ROLE).then((role) => {
    let isProductAdmin = false;

    if (role === ROLES.BUSINESS_ADMIN) {
      isProductAdmin = true;
      // If parsing fails, assume not product admin
    }

    // Skip tenant ID if user is product admin
    const skipTenantId = isProductAdmin;

    return restService.generateHeaders({}, skipTenantId).then((headers) => {
      return restService.fetch(AUTH_BASE_URL + '/api/auth/profile-image/add-edit-profile-image', {
        method: 'POST',
        headers,
        body: data,
      });
    });
  });
};
const saveSettingsInfo = async (settingsInfo: ILangInfo) => {
  const payload = { language: settingsInfo.langCode };
  const headers = await restService.generateHeaders({
    'Content-type': 'application/json',
  });
  return AsyncStorage.getItem(AsyncStorageKey.ROLE).then((role) => {
    let isProductAdmin = false;

    if (role === ROLES.BUSINESS_ADMIN) {
      isProductAdmin = true;
      // If parsing fails, assume not product admin
    }

    // Skip tenant ID if user is product admin
    const skipTenantId = isProductAdmin;

    return restService
      .generateHeaders(
        {
          'Content-type': 'application/json;',
        },
        skipTenantId,
      )
      .then((headers) => {
        return restService.fetch(`${AUTH_BASE_URL}/api/auth/users/update-language`, { method: 'POST', headers, body: JSON.stringify(payload) });
      });
  });
};

export { saveSettingsInfo, uploadProfileImg };
