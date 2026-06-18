import React from 'react';
import { Appbar } from 'react-native-paper';
import { useAppbarStyle } from 'src/common/components/HeaderTitle/style';
import { useUserStyle } from 'src/common/assets/styles/user';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { Pressable } from 'react-native';

interface HeaderTitleProps {
  title: string;
  onBackPress?: () => void; // Optional function for back action
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, onBackPress }) => {
  const userStyle = useUserStyle();
  const AppbarStyle = useAppbarStyle();
  const {theme} = useAppTheme();
  return (
    <Appbar.Header style={AppbarStyle.appbarHeader}>
      <Pressable onPress={onBackPress}>
        <Icon name='chevronLeft' size={25} color={theme.colors.iconBase} />
      </Pressable>
      <Appbar.Content title={title} titleStyle={AppbarStyle.appbarTitle} />
    </Appbar.Header>
  );
};

export default HeaderTitle;
