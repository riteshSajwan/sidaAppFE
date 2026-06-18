import { FunctionComponent } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';

interface ICustomTextProps {
    style?: StyleProp<TextStyle>;
    text: string;
}

const CustomText: FunctionComponent<ICustomTextProps> = (props) => {
    const layout = useLayoutStyle();
    const {
        text,
        style = layout.accordionTitleHeader,
    } = props;
    
    return (
        <View>
            <Text style={style}>
                {text}
            </Text>
        </View>
    );
};

export default CustomText;