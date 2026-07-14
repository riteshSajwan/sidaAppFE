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
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';

type DrawerOption = {
  label: string;
  path: string;
  icon: IconName;
  onPress?: () => void;
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const styles = useDrawerStyle();
  const { theme, mode, toggleTheme } = useAppTheme();
  const dispatch: AppDispatch = useDispatch();
  const { isProductAdmin, isSuperAdmin } = usePermission(MenuType.DASHBOARD);
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
      .catch(() => { });
  };
  const pathname = usePathname();
  const { navigation } = props;

  const logoutOption: DrawerOption = {
    label: TranslateMessage('Admin.Delivery.App.LogOut.Label'),
    path: Routes.LOGIN,
    icon: 'logout',
    onPress: handleLogOut,
  };

  // Super admin: full platform oversight menu
  const superAdminDrawerOptions: DrawerOption[] = [
    {
      label: TranslateMessage('Admin.Sida.App.Dasboard'),
      path: `${Routes.DASHBOARD}`,
      icon: 'dashboard',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Applications'),
      path: Routes.APPLICATIONS,
      icon: 'page',
    },
     {
      label: TranslateMessage('Admin.Sida.App.Upload'),
      path: Routes.UPLOAD,
      icon: 'trophy',
    },
    {
      label: TranslateMessage('Admin.Sida.App.ScheduleAwards'),
      path: Routes.SCHEDULE_AWARDS,
      icon: 'trophy',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Certificates'),
      path: Routes.CERTIFICATES,
      icon: 'pdf',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Payments'),
      path: Routes.Payment,
      icon: 'wallet',
    },
    {
      label: TranslateMessage('Admin.Sida.App.DocumentStore'),
      path: Routes.DOCUMENT_STORE,
      icon: 'multiplePagesAdd',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Performance'),
      path: Routes.PERFORMANCE,
      icon: 'graphdown',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Roles'),
      path: Routes.ROLES,
      icon: 'userOutlineGroup',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Reports'),
      path: Routes.REPORTS,
      icon: 'statsDownSquare',
    },
    {
      label: TranslateMessage('Admin.Sida.App.AuditLogs'),
      path: Routes.AUDIT_LOGS,
      icon: 'legal',
    },
    {
      label: TranslateMessage('Admin.Sida.App.Settings'),
      path: Routes.SETTINGS,
      icon: 'setting',
    },
    logoutOption,
  ];

  // Private architect: personal application workspace
  const privateArchitectDrawerOptions: DrawerOption[] = [
    {
      label: TranslateMessage('Admin.Sida.App.Dasboard'),
      path: `${Routes.DASHBOARD}`,
      icon: 'dashboard',
    },
    {
      label: TranslateMessage('Admin.Sida.App.NewApplication'),
      path: `${Routes.NEWAPPLICATION}`,
      icon: 'multiplePagesAdd',
    },
    {
      label: TranslateMessage('Admin.Sida.App.MyApplication'),
      path: `${Routes.MYAPPLICATION}`,
      icon: 'page',
    },
    {
      label: TranslateMessage('Admin.Sida.App.DocumentVault'),
      path: Routes.DOCUMENT_VAULT,
      icon: 'pdf',
    },
    logoutOption,
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

  // const filteredDrawerOptions = isSuperAdmin
  //   ? superAdminDrawerOptions
  //   : isProductAdmin && !isTenantView
  //     ? businessAdminDrawerOptions.filter((item) => visibleForProductAdmin.includes(item.path))
  //     : isProductAdmin && isTenantView
  //       ? businessAdminDrawerOptions.filter((item) => !hiddenFromProductAdminAsTenant.includes(item.path))
  //       : isProductAdmin
  //         ? businessAdminDrawerOptions.filter((item) => {
  //           if (!IS_SAAS && hiddenWhenNotSaas.includes(item.path)) return false;
  //           return !hiddenFromTenant.includes(item.path);
  //         })
  //         : privateArchitectDrawerOptions;

  const filteredDrawerOptions = superAdminDrawerOptions

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
