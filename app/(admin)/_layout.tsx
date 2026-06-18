import { router, usePathname } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LayoutContainer from 'src/common/layouts/LayoutContainer';
import { unreadNotificationCount } from 'src/common/service/notification/api';
import { getProfileDetail } from 'src/common/service/profile/action';
import { setNotificationCount } from 'src/common/service/profile/slice';
import { useOrderWebSocket } from 'src/common/service/websocket/useBookingWebSocket';
import { getUserToken } from 'src/common/utils/tokenUtils';
import NewIntercityBookingRequestPopup from 'src/components/NewBooking/NewIntercityBookingRequestPopup';
import { IS_INTERCITY } from 'src/constants';
import { updateUserLang } from 'src/i18n/i18nUtils';
import { setMomentLocale } from 'src/i18n/setMomentLocale';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store/index';

interface AuthenticatedComponentProps {
  children?: React.ReactNode;
}
const withAuth = <P extends AuthenticatedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent = (props: P) => {
    const pathname = usePathname();
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const userDetails = useSelector((state: RootState) => state.profile);

    useEffect(() => {
      if (!userDetails.data?.id ) return;
      if (userDetails.data?.id && !isLoggedIn) {
        router.replace(Routes.LOGIN);
      }
    }, [isLoggedIn, userDetails, pathname]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector((state: RootState) => state.profile.data);
  useOrderWebSocket({
    enabled: Boolean(userDetails?.id),
  });

useEffect(() => {
  if (!userDetails) {
    getUserToken()
      .then((token) => {
        if (token) {
          dispatch(getProfileDetail(token));
        } else {
          router.replace(Routes.LOGIN);
        }
      })
      .catch(() => {
        router.replace(Routes.LOGIN);
      });
  }
}, [dispatch, userDetails]);

const getUnreadNotification = useCallback(() => {
  return unreadNotificationCount(userDetails?.id ?? 0)
    .then((count) => {
      dispatch(setNotificationCount(count.unreadCount));
    })
    .catch(() => {
    });
}, [dispatch, userDetails?.id]);

  useEffect(() => {
    if (userDetails?.id) {
      getUnreadNotification();
    }
  }, [getUnreadNotification, userDetails?.id])

  const userLang = userDetails?.language;
  useEffect(() => {
    updateUserLang(userLang);
    setMomentLocale(userLang);
  }, [userLang]);

  return (
    <>
      <LayoutContainer />
      {IS_INTERCITY ? <NewIntercityBookingRequestPopup /> : null}
    </>
  );
};

export default withAuth(MainLayout);
