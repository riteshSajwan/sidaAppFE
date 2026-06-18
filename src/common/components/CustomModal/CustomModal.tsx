import React, { FunctionComponent, JSX, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Dialog, Icon, Portal } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useModalStyle } from 'src/common/components/CustomModal/CustomModalStyle';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { isIOSPlatform, isWebPlatform } from 'src/common/utils/isMobilePlatform';


interface ICustomDialogProps {
  visible: boolean;
  dismissOutside: boolean;
  title: string;
  bodyContent: {
    editable?: boolean;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    rightIcon?: JSX.Element;
  }[];
  onCancel: () => void;
  onSave?: () => void;
  error?: string;
  children?:ReactElement;
  confirmBtnTitle?: string;
  cancelBtnTitle?: string;
  isHome?: boolean;
  isCloseRequired?: boolean;
  isConfirmDisabled?: boolean;
  dialogStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
}

const CustomModal: FunctionComponent<ICustomDialogProps> = (props) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const modalStyle = useModalStyle();
  const {theme} = useAppTheme();
  const {
    visible,
    dismissOutside,
    title,
    bodyContent,
    onCancel,
    onSave,
    error,
    children,
    confirmBtnTitle = TranslateMessage('Restaurant.Delivery.App.Save'),
    cancelBtnTitle = TranslateMessage('Restaurant.Delivery.App.Cancel'),
    isHome = false,
    isCloseRequired = true,
    isConfirmDisabled = false,
    dialogStyle,
    loading = false,
  } = props;

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height); // Get the keyboard height
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function renderDialogContainer() {
    
    return (
      <Dialog
        visible={visible}
        dismissable={dismissOutside}
        onDismiss={onCancel}
        style={[modalStyle.dialogContainer, { maxWidth: 580 },
          isIOSPlatform() && keyboardVisible && {
          marginBottom: keyboardHeight,
          },
          isHome && {maxHeight: 600,minHeight: 200,maxWidth: 600},
          dialogStyle,
          ]}
      >
      {loading && (
        <Loader loading={loading} styles={layout.modalOverlayLoader} />
      )}
      {isCloseRequired &&  <View style={modalStyle.modalHeader}>
          <Text style={[modalStyle.modalTitle,{maxWidth:500}]}>{title}</Text>
          <Pressable
            onPress={onCancel}
            style={[modalStyle.closeButton, { marginEnd: 0 }]}
          >
            <Icon source='close' size={30} color={theme.colors.iconBase} />
          </Pressable>
        </View>}
        <Dialog.Content style={[modalStyle.modalBody]}>
        {children}
        {error ? <ErrorMessageContainer message={error} /> : null}
        </Dialog.Content>
        {!isHome && <Dialog.Actions style={modalStyle.modalFooter}>
          <View style={{flexDirection:'column', flex:1}}>
          <View style={[formStyle.formRow, layout.mb0]}>
            <View style={formStyle.formCol}>
              <Pressable onPress={onSave} disabled={isConfirmDisabled}>
                <Text style={[button.btnPrimary, button.btn, isConfirmDisabled && button.btnDisabled]}>
                  {confirmBtnTitle}
                </Text>
              </Pressable>
            </View>
            <View style={formStyle.formCol}>
              <Pressable onPress={onCancel}>
                <Text style={[button.btn,   button.btnOutlineDanger, layout.borderWidth]}>
                  {cancelBtnTitle}
                </Text>
              </Pressable>
            </View>
          </View>
          </View>
        </Dialog.Actions>}
      </Dialog>
    );
  }

  function renderDialog() {
    return isWebPlatform()
      ? renderDialogContainer()
      : visible && (
          <Pressable onPress={Keyboard.dismiss} style={layout.flexCol}>
            {renderDialogContainer()}
          </Pressable>
        );
  }

  return <Portal>{renderDialog()}</Portal>;
};

export default CustomModal;
