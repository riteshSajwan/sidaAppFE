import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import Header from 'src/common/layouts/Header/Header';
import { getHeaderTitle } from 'src/common/layouts/Header/HeaderTitle';
import CustomDrawerContent from 'src/common/layouts/SideMenu/CustomDrawerContent/CustomDrawerContent';

const SideMenu = () => {
  const { theme } = useAppTheme();
  const [isDesktop, setIsDesktop] = useState(
    Dimensions.get('window').width > 1199
  );
  const pathname = usePathname();
  const headerTitle = getHeaderTitle(pathname);

  const screenOptionValues: DrawerNavigationOptions = {
    drawerStyle: {
      backgroundColor: theme.colors.surfaceBase,
      width: 350,
      borderLeftColor: theme.colors.borderLow,
      borderRightColor: theme.colors.borderLow,
    },
    drawerType: isDesktop ? 'permanent' : 'front',
    drawerPosition: 'left',
    drawerActiveBackgroundColor: theme.colors.surfaceBase,
    headerShown: !isDesktop,
    swipeEdgeWidth: 0,
    header: (props) => <Header {...props} headerTitle={headerTitle} />,
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsDesktop(window.width > 1199);
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      backBehavior='history'
      screenOptions={screenOptionValues}
    />
  );
};

export default SideMenu;
