
import { StyleProp, ViewStyle } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';

export const useDefaultBtnStyle = (): StyleProp<ViewStyle> => {
    const button = useButtonStyle();
    const layout = useLayoutStyle();

    return [button.btn, button.btnPrimary, layout.btnend];
};