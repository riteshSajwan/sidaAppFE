import { router, Tabs, usePathname } from 'expo-router';
import { FunctionComponent } from 'react';
import { Pressable, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useTabStyles } from 'src/common/layouts/TabLayout/tabsStyle';
import { isIOSPlatform } from 'src/common/utils/isMobilePlatform';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';

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
  const insets = useSafeAreaInsets();
  const tabsStyle = useTabStyles();
  const { theme } = useAppTheme();
  const pathname = usePathname();
  const layout = useLayoutStyle();

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
      }}
    >
      {tabScreens.map((screen) => {
        const { screenName, label, icon, path, hideTabBar, headerTitle, navigationRoute, iconSize } = screen;
        return (
          <Tabs.Screen
            key={screenName}
            name={screenName}
            options={{
              href: path ?? null,
              // headerShown: !!headerTitle,
              headerShown: false,
              tabBarStyle: hideTabBar
                ? { display: 'none' }
                : {
                  elevation: 10,
                  shadowColor: theme.colors.surfaceBase,
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 10.8,
                  backgroundColor: theme.colors.surfaceBase,
                  borderColor: theme.colors.borderDisabled,
                  height: 100,
                  padding: 10,
                  // alignItems: 'center',
                  marginBottom: isIOSPlatform() ? 0 : - insets.bottom,
                },
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: theme.fontFamily.medium,
                    fontSize: theme.fontSize.textButtonLarge,
                    color: focused ? theme.colors.themeText : theme.colors.textOnDisabled,
                  }}
                >
                  {label}
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <View>
                  <Icon
                    name={icon as IconName}
                    color={focused ? theme.colors.themeIcon : theme.colors.iconDisabled}
                    size={iconSize?.width ?? 25}
                  />
                </View>
              ),
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
