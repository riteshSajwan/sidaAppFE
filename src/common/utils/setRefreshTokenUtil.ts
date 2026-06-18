import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

function setUserRefreshToken(tokenValue: string) {
  return AsyncStorage.setItem(AsyncStorageKey.USER_REFRESH_TOKEN, tokenValue)
    .then(() => true)
    .catch((err) => {
      console.error('Error setting the refresh token:', err);
      return null;
    });
}

function getUserRefreshToken() {
  return AsyncStorage.getItem(AsyncStorageKey.USER_REFRESH_TOKEN)
    .then((token) => token)
    .catch((err) => {
      console.error('Error fetching the refresh token:', err);
      return null;
    });
}

function removeUserRefreshToken() {
  return AsyncStorage.removeItem(AsyncStorageKey.USER_REFRESH_TOKEN)
    .then(() => true)
    .catch((err) => {
      console.error('Error removing the refresh token:', err);
      return null;
    });
}

export { getUserRefreshToken, removeUserRefreshToken, setUserRefreshToken };

