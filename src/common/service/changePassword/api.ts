import AsyncStorage from '@react-native-async-storage/async-storage';
import RestService from 'src/common/service/restService/restService';
import { ROLES } from 'src/common/utils/permissionUtils';
import { API_AUTH_BUSINESS_ADMIN_URL, AUTH_BASE_URL } from 'src/constants';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

export const ChangePasswordApi = async (newUser: object) => {
  const role = await AsyncStorage.getItem(AsyncStorageKey.ROLE);
  const isBusinessAdmin = role === ROLES.BUSINESS_ADMIN;

  const url = isBusinessAdmin
    ? API_AUTH_BUSINESS_ADMIN_URL + '/change-password'
    : AUTH_BASE_URL + '/api/auth/change-password';

  const headers = await RestService.generateHeaders(
    { 'Content-type': 'application/json; charset=UTF-8' },
    isBusinessAdmin // skip tenant ID for business admin
  );

  return RestService.fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(newUser),
  });
};
