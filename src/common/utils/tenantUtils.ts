import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from 'src/constants/storageKeyConstant';

// Simple event emitter for tenant ID changes
type TenantChangeListener = () => void;
const listeners: Set<TenantChangeListener> = new Set();

export const subscribeTenantChange = (listener: TenantChangeListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const emitTenantChange = () => {
  listeners.forEach((listener) => listener());
};

/**
 * Set tenant ID in AsyncStorage
 */
export const setTenantId = (tenantId: string): Promise<void> => {
  return AsyncStorage.setItem(AsyncStorageKey.TENANT_ID, tenantId)
    .then(() => {
      // Emit change event after a small delay to ensure state updates
      setTimeout(() => emitTenantChange(), 100);
    })
    .catch((error) => {
      console.error('Failed to set tenant ID:', error);
    });
};

/**
 * Get tenant ID from AsyncStorage
 */
export const getTenantId = (): Promise<string | null> => {
  return AsyncStorage.getItem(AsyncStorageKey.TENANT_ID)
    .then((tenantId) => {
      return tenantId;
    })
    .catch((error) => {
      console.error('Failed to get tenant ID:', error);
      return null;
    });
};

/**
 * Remove tenant ID from AsyncStorage
 */
export const removeTenantId = (): Promise<void> => {
  return AsyncStorage.removeItem(AsyncStorageKey.TENANT_ID)
    .then(() => {
      // Emit change event after a small delay to ensure state updates
      setTimeout(() => emitTenantChange(), 100);
    })
    .catch((error) => {
      console.error('Failed to remove tenant ID:', error);
    });
};

/**
 * Check if tenant ID exists
 */
export const hasTenantId = (): Promise<boolean> => {
  return AsyncStorage.getItem(AsyncStorageKey.TENANT_ID)
    .then((tenantId) => {
      return tenantId !== null;
    })
    .catch((error) => {
      console.error('Failed to check tenant ID:', error);
      return false;
    });
};
