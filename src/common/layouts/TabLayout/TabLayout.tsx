import { router, Tabs, usePathname } from 'expo-router';
import { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useTabStyles } from 'src/common/layouts/TabLayout/tabsStyle';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';

export interface ITabScreen {
  screenName: string;
  label?: string;
  icon?: string;
  path?: Routes | null;
  hideTabBar?: boolean;
  headerTitle?: string;
  navigationRoute?: Routes;
  iconSize?: { width: number; height: number };
}

interface ITabLayoutProps {
  tabScreens: ITabScreen[];
}

const TabLayout: FunctionComponent<ITabLayoutProps> = ({ tabScreens }) => {
  const tabsStyle = useTabStyles();
  const { theme } = useAppTheme();
  const pathname = usePathname();

  const navigateToPrevious = (navigationRoute?: Routes) => () => {
    if (navigationRoute) {
      router.push(navigationRoute);
      return;
    }
    router.back();
  };

  return (
    <Tabs
      key={pathname}
      backBehavior="history"
      initialRouteName="dashboard/index"
      screenOptions={{
        sceneStyle: { backgroundColor: theme.colors.surfaceLow },
        // Always hide the tab bar entirely — navigation is handled by the sidebar
        tabBarStyle: { display: 'none' },
      }}
      // Returning null from tabBar completely removes the tab bar component
      tabBar={() => null}
    >
      {tabScreens.map((screen) => {
        const { screenName, path, headerTitle, navigationRoute } = screen;
        return (
          <Tabs.Screen
            key={screenName}
            name={screenName}
            options={{
              href: path ?? null,
              headerShown: false,
              header: () =>
                headerTitle ? (
                  <View style={tabsStyle.navHeader}>
                    <Pressable onPress={navigateToPrevious(navigationRoute)}>
                      <Icon name='chevronLeft' color={theme.colors.iconBase} size={18} spacing={10} />
                    </Pressable>
                    <Text style={tabsStyle.headerTitle}>{headerTitle}</Text>
                  </View>
                ) : null,
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default TabLayout;
