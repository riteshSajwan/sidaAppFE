import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

/**
 * Store user role in AsyncStorage
 * @param role - Role name to store
 */
export const setUserRole = (role: string): Promise<void> => {
  return AsyncStorage.setItem(AsyncStorageKey.ROLE, role).catch((error) => {
    console.error('Error storing user role:', error);
  });
};

/**
 * Get user role from AsyncStorage
 * @returns Role name or null if not found
 */
export const getUserRole = (): Promise<string | null> => {
  return AsyncStorage.getItem(AsyncStorageKey.ROLE)
    .then((role) => {
      return role;
    })
    .catch((error) => {
      console.error('Error retrieving user role:', error);
      return null;
    });
};

/**
 * Remove user role from AsyncStorage
 */
export const removeUserRole = (): Promise<void> => {
  return AsyncStorage.removeItem(AsyncStorageKey.ROLE).catch((error) => {
    console.error('Error removing user role:', error);
  });
};
