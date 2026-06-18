import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useTypographyStyle } from 'src/common/assets/styles/typographyStyle';
import { useAppTheme } from 'src/common/context/AppTheme';
 
type TypographyVariant = keyof ReturnType<typeof useTypographyStyle>;
type TextAlign = 'left' | 'center' | 'right';
type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';
type EllipsizeMode ='head' | 'middle' | 'tail' | 'clip';
interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  spacing?: { top?: number; bottom?: number };
  backgroundColor?: string;
  align?: TextAlign;
  color?: string;
  fontWeight?: FontWeight; // optional override
  numberOfLines?: number;
  ellipsizeMode?: EllipsizeMode;
}
 
const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  style,
  spacing,
  backgroundColor,
  align = 'left',
  color,
  fontWeight,
  numberOfLines,
  ellipsizeMode,
}) => {
  const typography = useTypographyStyle();
  const { theme } = useAppTheme();
 
  const variantStyle = typography[variant] || {};
 
  const weightFamily =
    fontWeight === 'bold'
      ? theme.fontFamily.bold
      : fontWeight === 'semiBold'
        ? theme.fontFamily.semiBold
        : fontWeight === 'medium'
          ? theme.fontFamily.medium
          : fontWeight === 'regular'
            ? theme.fontFamily.regular
            : undefined;
 
  const fontWeightStyle: TextStyle = weightFamily ? { fontFamily: weightFamily } : {};
 
  const spacingStyle: TextStyle = {
    marginTop: spacing?.top ?? 0,
    marginBottom: spacing?.bottom ?? 0,
  };
 
  const backgroundStyle: TextStyle = backgroundColor ? { backgroundColor } : {};
  const alignmentStyle: TextStyle = { textAlign: align };
  const colorStyle: TextStyle = color ? { color } : {};
 
  return (
    <Text
      style={[
        variantStyle,       
        fontWeightStyle,
        spacingStyle,
        backgroundStyle,
        alignmentStyle,
        colorStyle,
        style,
      ]}
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};
 
export default Typography;