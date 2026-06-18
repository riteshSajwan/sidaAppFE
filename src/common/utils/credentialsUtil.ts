import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuperAdminProperties } from 'src/common/model/auth/login';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

function setUserCredentials(userData: string) {
  return AsyncStorage.setItem(AsyncStorageKey.ADMIN_PROPERTIES, userData)
    .then(() => true)
    .catch(() => null);
}

function getUserCredentails() {
  return AsyncStorage.getItem(AsyncStorageKey.ADMIN_PROPERTIES)
    .then((cred) => {
      return cred ? (JSON.parse(cred) as SuperAdminProperties) : null;
    })
    .catch(() => null);
}

export { getUserCredentails, setUserCredentials };

