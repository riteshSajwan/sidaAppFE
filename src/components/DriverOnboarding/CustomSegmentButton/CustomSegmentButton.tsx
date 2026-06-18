import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useSegmentStyle } from './styles';

interface ISegmentButtonProps {
  value: string;
  setValue: (value: string) => void;
  buttons: {
    value: string;
    label: string;
  }[];
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const CustomSegmentButton = ({
  value,
  setValue,
  buttons,
  style,
  buttonStyle,
  labelStyle,
}: ISegmentButtonProps) => {
  const segmentStyles = useSegmentStyle();
  const {theme} = useAppTheme();
  return (
    <View style={[segmentStyles.btnContainer, style]}>
      {buttons.map((button, index) => {
        const isSelected = value === button.value;
        const isFirst = index === 0;
        const isLast = index === buttons.length - 1;

        return (
          <Pressable
            key={button.value}
            style={[
              segmentStyles.button,
              buttonStyle,
              {
                backgroundColor: isSelected
                  ? theme.colors.surfaceInverse
                  : theme.colors.surfaceBase,
                borderTopLeftRadius: isFirst ? theme.roundness.xxl : 0,
                borderBottomLeftRadius: isFirst ? theme.roundness.xxl : 0,
                borderTopRightRadius: isLast ? theme.roundness.xxl : 0,
                borderBottomRightRadius: isLast ? theme.roundness.xxl : 0,
                borderLeftWidth: isFirst ? 0 : 1,
              },
            ]}
            onPress={() => setValue(button.value)}
          >
            <Text allowFontScaling={false} 
 
              style={[
                segmentStyles.label,
                labelStyle,
                {
                  color: isSelected
                    ? theme.colors.textInverse
                    : theme.colors.textHeading,
                },
              ]}
            >
              {button.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomSegmentButton;
