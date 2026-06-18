import { useTranslation } from 'react-i18next';
import { usePermission } from 'src/common/hooks/usePermission';
import { useTenantId } from 'src/common/hooks/useTenantId';
import TabLayout, { ITabScreen } from 'src/common/layouts/TabLayout/TabLayout';
import { MenuType } from 'src/common/utils/permissionUtils';
import { IS_INTERCITY, IS_SAAS } from 'src/constants';
import { Routes } from 'src/routing/paths';

const TabLayoutContainer = () => {
  const { t: TranslateMessage } = useTranslation();
  const { isTenantView, isLoading } = useTenantId();
  const { isProductAdmin } = usePermission(MenuType.DASHBOARD);

  const tabScreens: ITabScreen[] = [
    {
      screenName: 'dashboard/index',
      label: TranslateMessage('Admin.Delivery.App.Dashboard.Title'),
      icon: 'dashboard',
      path: Routes.DASHBOARD,
      headerTitle: TranslateMessage('Admin.Delivery.App.Dashboard.Title'),
      navigationRoute: Routes.DASHBOARD,
    },
    {
      screenName: 'rider/index',
      label: TranslateMessage('Admin.Delivery.App.Drivers'),
      icon: 'steering',
      path: Routes.DRIVER,
      headerTitle: TranslateMessage('Admin.Delivery.App.Drivers'),
      navigationRoute: Routes.DRIVER,
      iconSize: { width: 25, height: 25 },
    },
    {
      screenName: 'customer/index',
      label: TranslateMessage('Admin.Delivery.App.Customers'),
      icon: 'userOutline',
      path: Routes.CUSTOMER,
      headerTitle: TranslateMessage('Admin.Delivery.App.Customers'),
      navigationRoute: Routes.CUSTOMER,
      iconSize: { width: 20, height: 20 },
    },
    {
      screenName: 'newBooking/index',
      label: TranslateMessage('Admin.Delivery.App.New.Bookings.Title'),
      icon: 'coin',
      path: Routes.NEWBOOKING,
      headerTitle: TranslateMessage('Admin.Delivery.App.New.Bookings.Title'),
      navigationRoute: Routes.NEWBOOKING,
      iconSize: { width: 25, height: 25 },
    },
    {
      screenName: 'booking/index',
      label: TranslateMessage('Admin.Delivery.App.Bookings.Title'),
      icon: 'coin',
      path: Routes.BOOKING,
      headerTitle: TranslateMessage('Admin.Delivery.App.Bookings.Title'),
      navigationRoute: Routes.BOOKING,
      iconSize: { width: 25, height: 25 },
    },
    {
      screenName: 'requestManagement/index',
      label: TranslateMessage('Admin.Delivery.App.Request.Title'),
      icon: 'userOutlineGroup',
      path: Routes.REQUESTS,
      headerTitle: TranslateMessage('Admin.Delivery.App.Request.Title'),
      navigationRoute: Routes.REQUESTS,
      iconSize: { width: 25, height: 25 },
    },
    {
      screenName: 'chat/index',
      label: TranslateMessage('Admin.Delivery.App.Support'),
      icon: 'chatEmpty',
      path: Routes.CHAT,
      headerTitle: TranslateMessage('Admin.Delivery.App.Support'),
      navigationRoute: Routes.CHAT,
      iconSize: { width: 20, height: 20 },
    },
    {
      screenName: 'requestManagement/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/categoryinfo/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/driverBank/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/driverInsurance/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/driverLicense/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/driverOnboarding/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/driverVehicle/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/imageinfo/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/info/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/licenceinfo/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/onboarding/index',
      hideTabBar: true,
    },
    {
      screenName: 'requestManagement/[id]/timinginfo/index',
      hideTabBar: true,
    },
    {
      screenName: 'customer/customerdetails/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/driverdetails/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/driverdetails/[id]/driverWallet/index',
      hideTabBar: true,
    },
    {
      screenName: 'booking/bookingdetails/[id]/index',
      hideTabBar: true,
    },
     {
      screenName: 'booking/bookingdetails/[id]/tripChat/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/bookingHistory/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'customer/bookingHistory/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/onboarding/new/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/onboarding/[id]/index',
      hideTabBar: true,
    },
    {
      screenName: 'rider/driverUploadPreview/index',
      hideTabBar: true,
    },
  ];

  // Tabs hidden when IS_SAAS=false
  const saasOnlyTabs = ['newBooking/index'];

  // Filter tabs based on tenant view for product admins
  const allowedTabsWithoutTenant = ['dashboard/index', 'chat/index'];

  const filteredTabScreens: ITabScreen[] = tabScreens.map((tab) => {
    // Hide SaaS-only tabs when not in SaaS mode
    if (!IS_SAAS && tab.label && saasOnlyTabs.includes(tab.screenName)) {
      return { ...tab, path: null };
    }

    // Hide intercity tab when not in intercity mode
    if (!IS_INTERCITY && tab.label && saasOnlyTabs.includes(tab.screenName)) {
      return { ...tab, path: null };
    }

    // Only apply filtering for product admins
    if (isProductAdmin && tab.label) {
      if (!isTenantView && !allowedTabsWithoutTenant.includes(tab.screenName)) {
        return { ...tab, path: null };
      }
    }

    return tab;
  });

  // Don't render until we've checked tenant status
  if (isLoading) {
    return null;
  }

  return <TabLayout tabScreens={filteredTabScreens} />;
};

export default TabLayoutContainer;
