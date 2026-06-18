import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

export function getAsyncStorageItem(key: AsyncStorageKey) {
  return AsyncStorage.getItem(key)
    .then((data) => data)
    .catch((err) => {
      console.error('Error fetching from AsyncStorage:', err);
      return null;
    });
}
