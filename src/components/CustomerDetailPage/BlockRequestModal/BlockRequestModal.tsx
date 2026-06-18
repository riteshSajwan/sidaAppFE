import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { Dialog, Icon, Portal, Text, TextInput } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { BLOCK_REASON_CHARACTER_LIMIT } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { useManageStyle } from 'src/components/RequestManagement/Style';

interface IRejectRequestModalProps {
  description: string | null;
  isModalVisible: boolean;
  handleChange: (text: string) => void;
  toggleModal : () => void;
  handleRequestRejection : () => void;
  error?: string;
  modalTitle?:string,
  loading?:boolean
}

const BlockRequestModal = (props: IRejectRequestModalProps) => {
  const {
    description,
    isModalVisible,
    handleChange,
    toggleModal,
    handleRequestRejection,
    error,
    modalTitle,
    loading
  } = props;

  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const ManageStyle = useManageStyle();
  const {theme} = useAppTheme();
  
  function renderLimitationText() {
    return (
      <View>
        <Text style={{ color: theme.colors.textErrorDark, fontSize: theme.fontSize.textCaptionS, marginTop: 6 }}>* {TranslateMessage('Admin.Delivery.App.Customer.Error.Mandatory.Field')}</Text>
        <Text style={{ color: theme.colors.textErrorDark, fontSize: theme.fontSize.textCaptionS, marginTop: 6 }}>{TranslateMessage('Admin.Delivery.App.Customer.Error.Character.Limit.Field', { characterLimit: BLOCK_REASON_CHARACTER_LIMIT })} </Text>
      </View>
    );
  }

  return (
    <Portal>
      <Loader loading={loading}/>
      <Dialog
        visible={isModalVisible}
        onDismiss={toggleModal}
        style={ManageStyle.dialogModal}
      >
        <View style={[userStyle.modalHeader,{marginTop:0,}]}>
          <Text style={ManageStyle.modalTitle}>
          {modalTitle}
          </Text>
          <Pressable
            onPress={toggleModal}
            style={[ManageStyle.closeButton, { marginEnd: 0 }]}
          >
            <Icon source='close' size={30} color={theme.colors.iconBase} />
          </Pressable>
        </View>
        <Dialog.Content style={ManageStyle.modalBody}>
          <View style={[formStyle.formRow,layout.mb0]}>
            <View style={[formStyle.formCol]}>
              <TextInput
                style={[
                  formStyle.inputField,
                  { height: 'auto', paddingVertical: 10 },
                ]}
                value={description || ''}
                onChangeText={handleChange}
                activeOutlineColor={theme.colors.borderErrorInverse}
                outlineColor={theme.colors.borderMedium}
                placeholderTextColor={theme.colors.textNeutral}
                mode='outlined'
                autoCapitalize='none'
                secureTextEntry={false}
                editable={true}
                multiline={true}
                contentStyle={formStyle.inputLabel}
                numberOfLines={5}
                placeholder={TranslateMessage(
                  'Admin.Delivery.Request.Rejection.DescriptionPlaceHolder'
                )}
              />
            </View>
            
          </View>
          {!error && renderLimitationText()}
          {error && (
            <Text style={layout.blockErrorMessage}>{error}</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions style={layout.dialogFooter}>
          <Pressable style={layout.flexCol} onPress={toggleModal}>
            <Text style={[button.btnBase, button.btnOutlineDanger]}>
              {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
            </Text>
          </Pressable>
          <Pressable style={layout.flexCol} onPress={handleRequestRejection} disabled={!description && true || !!error}>
            <Text style={[button.btnBase, button.btnPrimary]}>
              {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
            </Text>
          </Pressable>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default BlockRequestModal;
