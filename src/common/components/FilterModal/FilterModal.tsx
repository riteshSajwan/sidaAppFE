import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useUserStyle } from 'src/common/assets/styles/user';
import { IFilterModalProps } from 'src/common/components/FilterModal/FIlterModalUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import Typography from 'src/common/components/Typography/Typography';

const FilterModal: React.FC<IFilterModalProps> = ({
  visible,
  hideModal,
  title,
  children,
  onClear,
  onSave,
  disableSave = false,
  style=[],
}) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const userStyle = useUserStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const {theme} = useAppTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={[userStyle.modalContainer,layout.pb0,style]}
      >
        <View style={userStyle.modalHeader}>
          <Typography variant='subTitle'>{title}</Typography>
          <Pressable style={userStyle.closeButton} onPress={hideModal}>
            <Icon name='closeAlt' size={25} color={theme.colors.iconBase} spacing={10}/>
          </Pressable>
        </View>
        <ScrollView>
          <View style={[layout.flexCol]}>{children}</View>
        </ScrollView>
        <View style={[formStyle.formRow, {justifyContent:'space-between',gap:16,marginHorizontal:16,marginTop:7}]}>
          <View style={[layout.flexCol]}>
            <Pressable onPress={onClear} style={[button.btnBase, button.btnOutlineDanger]}>
              <Typography variant='btnText' color={theme.colors.textErrorDark}>{TranslateMessage('Admin.Delivery.App.ClearBtnTitle')}</Typography>
            </Pressable>
          </View>
          <View style={[layout.flexCol]}>
            <Pressable
              onPress={onSave}
              disabled={disableSave}
              style={[
                button.btnBase,
                button.btnPrimary,
                disableSave && { opacity: 0.5 },
              ]}
            >
              <Typography variant='btnText' color={theme.colors.textInverse}>{TranslateMessage('Admin.Delivery.App.Apply')}</Typography>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default FilterModal;
