import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasTenantId, subscribeTenantChange } from 'src/common/utils/tenantUtils';

/**
 * Hook to check if tenant ID exists and listen for changes
 */
export const useTenantId = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isTenantView, setIsTenantView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkTenantId = () => {
    hasTenantId()
      .then(async (hasTenant) => {
        setIsTenantView(hasTenant);

        // ✅ get actual tenantId
        if (hasTenant) {
          const id = await AsyncStorage.getItem('TENANT_ID');
          setTenantId(id);
        } else {
          setTenantId(null);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setIsTenantView(false);
        setTenantId(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Check on mount
    checkTenantId();

    // Subscribe to tenant ID changes
    const unsubscribe = subscribeTenantChange(() => {
      checkTenantId();
    });

    return unsubscribe;
  }, []);

  return { tenantId, isTenantView, isLoading };
};