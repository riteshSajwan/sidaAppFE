import React, { FunctionComponent } from 'react';
import { Pressable } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';

interface ICustomIconButtonProp {
  icon: IconName;
  iconColor?: string;
  size?: number;
  spacing?: number;
  onPress?: () => void;
}

const CustomIconButton: FunctionComponent<ICustomIconButtonProp> = ({
  icon,
  iconColor = '#000',
  size = 24,
  spacing = 0,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={size}
        color={iconColor}
        spacing={spacing}
      />
    </Pressable>
  );
};

export default CustomIconButton;
