import { Slot } from 'expo-router';

/**
 * Layout for the (sideMenu) route group.
 * Using <Slot /> instead of <Stack /> means no navigator chrome is added —
 * no header, no back button, no screen title. The drawer in SideMenu
 * already provides the single shared header for all screens.
 */
const SideMenuLayout = () => {
  return <Slot />;
};

export default SideMenuLayout;
