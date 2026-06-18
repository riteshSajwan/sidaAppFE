import React, { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLACEHOLDER = require('src/common/assets/images/Avator.png');

interface Props {
  uri?: string;
  style?: object;
}

export const RenderImage: React.FC<Props> = React.memo(({ uri, style }) => {
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('TENANT_ID')
      .then((id) => setTenantId(id))
      .catch(() => {});
  }, []);

  const source = useMemo(() => {
    if (!uri || !tenantId) return undefined;
    return {
      uri,
      headers: {
        'X-Tenant-ID': tenantId,
      },
    };
  }, [uri, tenantId]);

  return (
    <Image
      source={source}
      placeholder={PLACEHOLDER}
      cachePolicy="memory-disk"
      contentFit="cover"
      style={style} 
    />
  );
});