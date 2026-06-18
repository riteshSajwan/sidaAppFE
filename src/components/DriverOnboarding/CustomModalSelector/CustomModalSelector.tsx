import React, { FunctionComponent, ReactNode} from 'react';
import { View, Text, Pressable, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { isIOSPlatform } from 'src/common/utils/isMobilePlatform';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useOnBoardingStyle } from '../PersonalInformation/onBoardingstyle';

interface ICustomModalSelectorProps {
    isModalVisible: boolean;
    toggleModal?: () => void;
    children: ReactNode;
    label:string;
    orderModal?: boolean
    bankStyle?:boolean
    walletStyle?:boolean
    orderTracker?:boolean
}

const CustomModalSelector: FunctionComponent<ICustomModalSelectorProps> = (props) => {
    const styles = useOnBoardingStyle();
    const layout = useLayoutStyle();
    const {theme} = useAppTheme();
    const {
        isModalVisible,
        toggleModal,
        label,
        orderModal,
        bankStyle,
        walletStyle,
        orderTracker
    } = props;

    const getCloseButtonStyle = ({ bankStyle, walletStyle }: { bankStyle?: boolean; walletStyle?: boolean }) => {
  switch (true) {
    case walletStyle:
      return styles.walletIcon;
    case bankStyle:
      return styles.closeButtonOtp;
    default:
      return styles.closeButton;
  }
};


    return (
        <View>
            <Portal>
                <Pressable  style={{ flex: 1, pointerEvents: 'box-none' }}>
                    <Modal
                        visible={isModalVisible}
                        onDismiss={toggleModal}
                        dismissable={!bankStyle && !orderTracker}
                        contentContainerStyle={
                            bankStyle
                            ? styles.dialogContainer
                                : styles.modalContainerModalIos
                        }
                        
                        style={
                            bankStyle
                            ? {marginBottom:theme.spacing.xxl * 4}
                            : orderModal
                                ? { marginHorizontal: theme.spacing.lg }
                                : [{ position: 'relative', marginBottom: isIOSPlatform() ? -32 : -20 }]
                        }
                        
                        >
                        <TouchableWithoutFeedback  accessible={false}>
                            <View>
                                {!orderModal && <View style={[styles.modalHeader, layout.justifyBetween, layout.alignItemCenter]}>
                                    <Text allowFontScaling={false} style={walletStyle ? styles.walletTitle : styles.modalTitle}>{label}</Text>
                                    <Pressable onPress={toggleModal} style={getCloseButtonStyle({ bankStyle, walletStyle })}>
                                        <Icon name='closeAlt' size={bankStyle ? 20 : 15} color={theme.colors.iconBase}/>
                                    </Pressable>
                                </View>}
                                {props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </Pressable>
            </Portal>
        </View>
    );
};

export default CustomModalSelector;