import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Dialog, Icon, Portal, Text, TextInput } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useManageStyle } from 'src/components/RequestManagement/Style';
import { rejectionOptions } from 'src/components/RequestManagement/RequestDetails/RejectRequestModal/RequestRequestModalUtil';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { useTranslation } from 'react-i18next';
import { BLOCK_REASON_CHARACTER_LIMIT } from 'src/components/CustomerDetailPage/Add/CustomDetailUtil';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';

interface IRejectRequestModalProps {
  description: string | null;
  isModalVisible: boolean;
  handleChange: (text: string) => void;
  toggleModal : () => void;
  handleRequestRejection : () => void;
  error?: string;
  loading?:boolean | undefined;
}

const RejectRequestModal = (props: IRejectRequestModalProps) => {
  const {
    description,
    isModalVisible,
    handleChange,
    toggleModal,
    loading,
    handleRequestRejection,
    error,
  } = props;

  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const ManageStyle = useManageStyle();
  const {theme} = useAppTheme();
  const [activeOption, setActiveOption] = useState<string>(''); // Track active option with type Option

  const toggleOption = (option: IMinuteOption) => () => {
    setActiveOption(option.value); 
    handleChange(option.label)
  };

  function renderValidationText() {
    return (
      <View>
        <Text style={{ color: 'red', fontSize: 12, marginTop: 6 }}>* {TranslateMessage('Admin.Delivery.App.Customer.Error.Mandatory.Field')}</Text>
        <Text style={{ color: 'red', fontSize: 12, marginTop: 6 }}>{TranslateMessage('Admin.Delivery.App.Customer.Error.Character.Limit.Field', { characterLimit: BLOCK_REASON_CHARACTER_LIMIT })} </Text>
      </View>
    );
  }
  return (
    <Portal>
      <Loader loading={loading ?? false}/>
      <Dialog
        visible={isModalVisible}
        onDismiss={toggleModal}
        style={ManageStyle.dialogModal}
      >
        <View style={ManageStyle.modalHeader}>
          <Text style={ManageStyle.modalTitle}>
            {TranslateMessage('Admin.Delivery.Request.Rejection.Heading')}
          </Text>
          <Pressable
            onPress={toggleModal}
            style={[ManageStyle.closeButton, { marginEnd: 0 }]}
          >
            <Icon source='close' size={30} color='#000000' />
          </Pressable>
        </View>
        <Dialog.Content style={ManageStyle.modalBody}>
          <View style={formStyle.formRow}>
            <View style={[formStyle.formCol]}>
              <Text style={formStyle.labelTitle}>
                {TranslateMessage(
                  'Admin.Delivery.Request.Rejection.DescriptionLabel'
                )}
              </Text>
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
                maxLength={255}
              />
            </View>
          </View>
          <View style={[formStyle.formRow]}>
            <View style={ManageStyle.infoOption}>
              {rejectionOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    ManageStyle.optionBtn,
                    activeOption === option.value && ManageStyle.optionActive,
                  ]}
                  onPress={toggleOption(option)}
                >
                  <Text
                    style={[
                      ManageStyle.optionLabel,
                      activeOption === option.value &&
                        ManageStyle.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          {!error && renderValidationText()}
          {error && (
            <Text style={{ color: 'red', fontSize: 12 }}>{error}</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Pressable style={layout.flexCol} onPress={toggleModal}>
            <Text style={[button.btn, button.btnOutlinePrimary]}>
              {TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
            </Text>
          </Pressable>
          <Pressable style={layout.flexCol} onPress={handleRequestRejection} disabled={!description && true || !!error}>
            <Text style={[button.btn, button.btnPrimary]}>
              {TranslateMessage('Admin.Delivery.App.SaveBtnTitle')}
            </Text>
          </Pressable>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default RejectRequestModal;
