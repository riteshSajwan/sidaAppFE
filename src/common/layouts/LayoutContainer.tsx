import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import SideMenu from 'src/common/layouts/SideMenu/SideMenu';
import Header from './Header/Header';

const LayoutContainer = () => {
  const layout = useLayoutStyle();
  const [isDesktop, setIsDesktop] = useState(
    Dimensions.get('window').width > 1199
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsDesktop(window.width > 1199);
    });
    return () => {
      subscription?.remove();
    };
  }, []);
  
  return (
    <View style={layout.flexCol}>
      {isDesktop && <Header />}
      <SideMenu />
    </View>
  );
};

export default LayoutContainer;
