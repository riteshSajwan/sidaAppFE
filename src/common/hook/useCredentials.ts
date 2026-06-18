import { useEffect, useState } from 'react';
import { SuperAdminProperties } from 'src/common/model/auth/login';
import { getUserCredentails } from 'src/common/utils/credentialsUtil';

export function useCredentials() {
  const [credentials, setCredentials] = useState<SuperAdminProperties | null>(null);

  useEffect(() => {
    const fetchKey = () => {
      getUserCredentails()
        .then((cred) => {
          if (cred) {
            setCredentials(cred);
          }
        })
        .catch((error) => {
          console.error("Failed to get data", error);
          setCredentials(null);
        });
    };

    fetchKey();
  }, []);

  return credentials;
}
