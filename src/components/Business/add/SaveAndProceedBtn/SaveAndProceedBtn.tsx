import { FunctionComponent } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import CustomButton, { IButtonProps } from 'src/common/components/CustomButton/CustomButton';
import { useDefaultBtnStyle } from 'src/common/components/CustomButton/CustomButtonUtil';

interface ISaveAndProceedBtn extends Omit<IButtonProps, 'btnTitle'> {
    viewLayoutStyle?: StyleProp<ViewStyle>;
    btnTitle?:string;
}

const defaultBtnStyle = [
    { marginTop: 12, width:234 },
];

const SaveAndProceedBtn: FunctionComponent<ISaveAndProceedBtn> = (props) => {

    const {
        disabled,
        viewLayoutStyle = defaultBtnStyle,
        onClick,
        btnStyle,
        btnTitle='Next'
    } = props;
    const defaultStyle = useDefaultBtnStyle();
    return (
        <View
            style={viewLayoutStyle}
        >
                <CustomButton
                    btnTitle={btnTitle}
                    onClick={onClick}
                    disabled={disabled}
                    btnStyle={btnStyle ?? defaultStyle}
                />
        </View>
    );
};

export default SaveAndProceedBtn;
