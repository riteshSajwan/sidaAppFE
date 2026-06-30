import React from 'react';
import { View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import SideMenu from 'src/common/layouts/SideMenu/SideMenu';

/**
 * LayoutContainer
 *
 * Desktop (>1199px):
 *   ┌──────────┬─────────────────────────────┐
 *   │          │  Header (with breadcrumbs)  │
 *   │ Sidebar  ├─────────────────────────────┤
 *   │ (full    │  Page content               │
 *   │  height) │                             │
 *   └──────────┴─────────────────────────────┘
 *
 * Mobile (≤1199px):
 *   ┌──────────────────────────────────────┐
 *   │  Header (back-button + title)        │
 *   ├──────────────────────────────────────┤
 *   │  Page content (drawer overlay)       │
 *   └──────────────────────────────────────┘
 *
 * On desktop the Drawer is set to `drawerType="permanent"` with `headerShown:true`.
 * This means the drawer renders the sidebar on the left and the header + content
 * on the right — the sidebar naturally stretches to the full height and the
 * header spans only the content column (to the right of the sidebar).
 */
const LayoutContainer = () => {
  const layout = useLayoutStyle();

  return (
    <View style={layout.flexCol}>
      <SideMenu />
    </View>
  );
};

export default LayoutContainer;
