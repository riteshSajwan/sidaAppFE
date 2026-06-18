import { useEffect, useState } from 'react';
import { isAuthenticatedUser } from 'src/common/utils/isAuthenticatedUser';

const useAuthStatus = () => {
  const [userTokenPresent, setUserTokenPresent] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    isAuthenticatedUser()
      .then((isUserAuthenticated) => {
        setUserTokenPresent(isUserAuthenticated);
      })
      .catch(() => {
        setUserTokenPresent(false);
      });
  };

  return userTokenPresent;
};

export default useAuthStatus;
