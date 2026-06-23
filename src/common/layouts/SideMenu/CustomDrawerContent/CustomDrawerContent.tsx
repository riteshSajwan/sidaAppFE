import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';
import { Href, router, usePathname } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { RenderImage } from 'src/common/components/Image/Image';
import ThemeToggle from 'src/common/components/ThemeToggle/ThemeToggle';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { useTenantId } from 'src/common/hooks/useTenantId';
import { useDrawerStyle } from 'src/common/layouts/SideMenu/CustomDrawerContent/CustomDrawerContentStyle';
import { logout } from 'src/common/service/auth/action';
import { getDeviceToken } from 'src/common/utils/getDeviceToken';
import { MenuType } from 'src/common/utils/permissionUtils';
import { getRefreshToken } from 'src/common/utils/refreshTokenUtils';
import { IS_SAAS } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const styles = useDrawerStyle();
  const { theme, mode, toggleTheme } = useAppTheme();
  const dispatch: AppDispatch = useDispatch();
  const { isProductAdmin } = usePermission(MenuType.DASHBOARD);
    const { isTenantView } = useTenantId();
  
  // const [isDesktop, setIsDesktop] = useState(
  //   Dimensions.get('window').width > 1199,
  // );
  // useEffect(() => {
  //   const subscription = Dimensions.addEventListener('change', ({ window }) => {
  //     setIsDesktop(window.width > 1199);
  //   });
  //   return () => {
  //     subscription?.remove();
  //   };
  // }, []);
  const handleLogOut = () => {
    Promise.resolve(getDeviceToken() ?? '')
      .then((deviceToken) =>
        getRefreshToken().then((refreshToken) => ({
          deviceToken,
          refreshToken: refreshToken ?? '',
        })),
      )
      .then((payload) => dispatch(logout(payload)))
      .then(() => router.replace(Routes.LOGIN))
      .catch(() => {});
  };
  const pathname = usePathname();
  const { navigation } = props;
  const hiddenForProductAdmin = [
  Routes.COUNTRIES,
  Routes.COUPON,
  Routes.TICKET,
  Routes.REPORT,
  Routes.ROLES,
  Routes.USERS,
  Routes.BUSINESS,
  Routes.CABS,
];
  const drawerOptions = [
    // {
    //   label: TranslateMessage('Admin.Delivery.App.Restaurants'),
    //   path: Routes.RESTAURANTS,
    //   icon: 'silverware-fork-knife',
    // },
    
    {
      label: TranslateMessage('Admin.Sida.App.Layout.Upload'),
      path: `${Routes.UPLOAD}`,
      icon: 'upload',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Reports'),
      path: Routes.SCRUTINYREPORT,
      icon: 'statsDownSquare',
    },
    {
      label: TranslateMessage('Admin.Sida.APP.ArchitectDetails.Details'),
      path: Routes.ARCHITECTDETAILS,
      icon: 'architect',
    },

    {
      label: TranslateMessage('Admin.Delivery.App.Ticket'),
      path: Routes.TICKET,
      icon: 'ticketLine',
    },
    
    // {
    //   label: TranslateMessage('Admin.Delivery.App.Reports'),
    //   path: Routes.REPORT,
    //   icon: 'statsDownSquare',
    // },
    {
      label: TranslateMessage('Admin.Delivery.App.Profile.Label'),
      path: Routes.PROFILE,
      icon: 'userCircle',
    },
    {
      label: TranslateMessage('Admin.Delivery.App.Roles.Label'),
      path: Routes.ROLES,
      icon: 'communityOutline',
    },
     {
      label: TranslateMessage('Admin.Delivery.App.Users.Label'),
      path: Routes.USERS,
      icon: 'userOutlineGroup',
    },
    {
      label: TranslateMessage('Admin.Delivery.App.Business'),
      path: Routes.BUSINESS,
      icon: 'statsDownSquare',
    },
    // {
    //   label: TranslateMessage('Admin.Delivery.App.Cabs.Title'),
    //   path: Routes.CABS,
    //   icon: 'car',
    // },
    {
      label: TranslateMessage('Admin.Delivery.App.InvoiceManagement'),
      path: Routes.INVOICING,
      icon: 'userCircle',
    },
    {
      label: TranslateMessage('Admin.Delivery.App.LogOut.Label'),
      path: Routes.LOGIN,
      icon: 'logout',
      onPress: handleLogOut,
    },

    //Required in Future
    // {
    //   label: TranslateMessage('Admin.Delivery.App.Trip.Details'),
    //   path: Routes.TRIPDETAILS,
    //   icon: 'earth',
    // },
    //  {
    //   label: TranslateMessage('Admin.Delivery.App.Order.Detail'),
    //   path:   Routes.ORDERDETAILS,
    //   icon: 'cart',
    // },
    // {
    //   label: 'Wallet',
    //   path: Routes.WALLET,
    //   icon: 'wallet',
    // },
    // this code required in future
    // {
    //   label: 'Internal Users',
    //   path: Routes.DEFAULT,
    //   icon: 'account-multiple',
    // },
    // {
    //   label: 'Delivery Partner',
    //   path: Routes.DEFAULT,
    //   icon: 'bike',
    // },
    // {
    //   label: 'Support Staff',
    //   path: Routes.DEFAULT,
    //   icon: 'account-group',
    // },
    // {
    //   label: 'Customer Master',
    //   path: Routes.DEFAULT,
    //   icon: 'account-star',
    // },
    // {
    //   label: 'Offers & Promos',
    //   path: Routes.DEFAULT,
    //   icon: 'ticket-percent',
    // },
  ];
  const visibleForProductAdmin: string[] = [
    Routes.PROFILE,
  Routes.BUSINESS,
  Routes.LOGIN,
];

 const hiddenFromTenant: string[] = [
  Routes.BUSINESS,
];

 const hiddenFromProductAdminAsTenant: string[] = [
  Routes.BUSINESS,
  Routes.PROFILE
];

 // Routes hidden in non-SaaS mode
 const hiddenWhenNotSaas: string[] = [
  Routes.ROLES,
  Routes.USERS,
  Routes.INVOICING,
];

 const filteredDrawerOptions = isProductAdmin && !isTenantView
  ? drawerOptions.filter((item) => visibleForProductAdmin.includes(item.path))
  : isProductAdmin && isTenantView
  ? drawerOptions.filter((item) => !hiddenFromProductAdminAsTenant.includes(item.path))
  : drawerOptions.filter((item) => {
      if (!IS_SAAS && hiddenWhenNotSaas.includes(item.path)) return false;
      return !hiddenFromTenant.includes(item.path);
    });
  
  const footerItems = [
    {
      key: 'themeToggle',
      component: <ThemeToggle />,
    },
  ];
  const onCloseDrawerHandler = () => {
    navigation.closeDrawer();
  };

  const pageRedirectHandle = () => {
    router.push(Routes.DASHBOARD);
  };

  const userDetails = useSelector((state: RootState) => state.profile.data);

  return (
    <DrawerContentScrollView {...props} scrollEnabled={true}>
      {
        <View style={layout.sideBarLogo}>
          {/* <View style={{ width: '100%' }}>
            <Pressable onPress={onCloseDrawerHandler}>
              <Icon name='closeAlt' size={20} color={theme.colors.iconBase} />
            </Pressable>
          </View> */}
          {/* <RenderImage
              uri={userDetails?.profileUrl}
              style={styles.avatarImage}
            /> */}
          <Pressable onPress={pageRedirectHandle}>
            <Typography variant='subTitle'>
              {TranslateMessage('Admin.Sida.App.Sida')}
            </Typography>
          </Pressable>
          {/* <Pressable onPress={pageRedirectHandle}>
            <BrandLogo width={155} height={45} color={theme.colors.iconBase} />
          </Pressable> */}
        </View>
      }

      {filteredDrawerOptions.map((option) => {
        const isMenuActive = pathname.includes(option.path);
        return (
          <DrawerItem
            key={option.label}
            label={option.label}
            onPress={() =>
              option.onPress
                ? option.onPress()
                : router.push(option.path as Href)
            }
            icon={() => (
              <View style={styles.iconContainer}>
                <Icon
                  name={option.icon as IconName}
                  size={24}
                  color={
                    isMenuActive
                      ? theme.colors.iconInverse
                      : theme.colors.iconBase
                  }
                />
              </View>
            )}
            labelStyle={[
              styles.drawerItemLabel,
              {
                color: isMenuActive
                  ? theme.colors.textInverse
                  : theme.colors.textBody,
              },
            ]}
            style={{
              ...styles.drawerItem,
              backgroundColor: isMenuActive
                ? theme.colors.surfaceInverse
                : 'transparent', // Active item background color
            }}
          />
        );
      })}

      {footerItems.map((item) => (
        <React.Fragment key={item.key}>{item.component}</React.Fragment>
      ))}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
