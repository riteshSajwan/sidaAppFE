import React, { FunctionComponent } from 'react';
import { Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { defaultBtnStyle } from 'src/common/components/CustomButton/CustomButtonUtil';

export interface IButtonProps {
    btnTitle: string;
    onClick: () => void;
    disabled?: boolean;
    btnStyle?: StyleProp<ViewStyle>;
}

const CustomButton: FunctionComponent<IButtonProps> = (props) => {

    const {
        btnTitle,
        onClick,
        disabled = false,
        btnStyle = defaultBtnStyle,
    } = props;

    const handleOnClick = disabled ? null : onClick;

    return (
        <Pressable onPress={handleOnClick} disabled={disabled}>
            <Text style={btnStyle}>
                {btnTitle}
            </Text>
        </Pressable>
    );
};

export default CustomButton;