import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { getUserToken, removeUserToken } from 'src/common/utils/tokenUtils';
import { Routes } from 'src/routing/paths';

const MainLayout = () => {
  const [loginto, setLoginTo] = useState<Routes.LOGIN | Routes.DASHBOARD>(Routes.LOGIN);

const checkTokenAndRedirect = () => {
  getUserToken()
    .then((token) => {
      if (token) {
        try {
          setLoginTo(Routes.DASHBOARD);
        } catch (err) {
          removeUserToken().then(() => {
            setLoginTo(Routes.LOGIN);
          });
        }
      } else {
        setLoginTo(Routes.LOGIN);
      }
    })
    .catch(() => {
      setLoginTo(Routes.LOGIN);
    });
};


  useEffect(() => {
    checkTokenAndRedirect();
  }, []);

  if (loginto) {
    return <Redirect href={loginto as Routes} />;
  }
};

export default MainLayout;
