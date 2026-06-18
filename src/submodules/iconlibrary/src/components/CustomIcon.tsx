import { SvgProps } from 'react-native-svg';
import { IconName, icons } from '../assets/icons';
import { View, StyleSheet } from 'react-native';

interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
  spacing?: number;
}

export default function Icon({
  name,
  size = 24,
  spacing = 0,
  color = '#000',
  ...props
}: IconProps) {
  const SvgIcon = icons[name];
  if (!SvgIcon) return null;

  return (
    <View style={styles(spacing).container}>
      <SvgIcon
        width={size}
        height={size}
        color={color}
        stroke={color}
        {...props}
      />
    </View>
  );
}

const styles = (spacing: number) =>
  StyleSheet.create({
    container: {
      margin: spacing,
    },
  });
