import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

function setRefreshToken(tokenValue: string) {
  return AsyncStorage.setItem(AsyncStorageKey.USER_REFRESH_TOKEN, tokenValue)
    .then(() => true)
    .catch((err) => {
      console.error('Error setting the refreshToken:', err);
      return null;
    });
}

function getRefreshToken() {
  return AsyncStorage.getItem(AsyncStorageKey.USER_REFRESH_TOKEN)
    .then((refreshToken) => refreshToken)
    .catch((err) => {
      console.error('Error fetching the refreshToken:', err);
      return null;
    });
}

function removeRefreshToken() {
  return AsyncStorage.removeItem(AsyncStorageKey.USER_REFRESH_TOKEN)
    .then(() => true)
    .catch((err) => {
      console.error('Error removing the refreshToken:', err);
      return null;
    });
}

export { getRefreshToken, removeRefreshToken, setRefreshToken };

