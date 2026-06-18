import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { IOption } from 'src/common/components/CustomDropdown/CustomDropdownUtil';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';

interface CancelBookingModalProps {
  visible: boolean;
  cancelRemark: string;
  cancellationReasons: string[];
  loading?: boolean;
  error?: string | null;
  onCancelRemarkChange: (value: string) => void;
  onSelectReason: (reason: string) => void;
  onClose: () => void;
  onProceed: () => void;
}

const CancelBookingModal = ({
  visible,
  cancelRemark,
  cancellationReasons,
  loading = false,
  error,
  onCancelRemarkChange,
  onSelectReason,
  onClose,
  onProceed,
}: CancelBookingModalProps) => {
  const { t: TranslateMessage } = useTranslation();
  const formStyle = useFormStyle();
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();
  const cancellationReasonOptions: IOption[] = cancellationReasons.map((reason) => ({
    label: reason,
    value: reason,
  }));

  const selectedReason =
    cancellationReasonOptions.find((reason) => reason.value === cancelRemark) ||
    { label: '', value: cancelRemark };

  const handleReasonChange = (item: IMinuteOption) => {
    onSelectReason(item.value);
  };

  return (
    <CustomModal
      visible={visible}
      dismissOutside={true}
      title={TranslateMessage('Admin.Delivery.App.Cancel.Booking')}
      bodyContent={[]}
      onCancel={onClose}
      onSave={onProceed}
      loading={loading}
      error={error ?? ''}
      isConfirmDisabled={loading || !cancelRemark.trim()}
      confirmBtnTitle='Proceed'
      cancelBtnTitle={TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
      dialogStyle={{ maxWidth: 500, width: '100%' }}
    >
      <View style={formStyle.formRow}>
        <View style={formStyle.formCol}>
          <Text style={formStyle.labelTitle}>
            {TranslateMessage('Admin.Delivery.App.Cancel.Booking.QuickReasons')}
          </Text>
          <Customdropdown
            data={cancellationReasonOptions}
            selectedValue={selectedReason}
            onChange={handleReasonChange}
            style={layout.dropdownHeight}
          />
          <Text style={[formStyle.labelTitle, { marginTop: theme.spacing.md }]}>
            {TranslateMessage('Admin.Delivery.App.Remark')}
          </Text>
          <TextInput
            style={[
              formStyle.inputField,
              { height: 120, paddingVertical: theme.spacing.sm },
            ]}
            value={cancelRemark}
            onChangeText={onCancelRemarkChange}
            activeOutlineColor={theme.colors.borderErrorInverse}
            outlineColor={theme.colors.borderMedium}
            placeholderTextColor={theme.colors.textNeutral}
            mode='outlined'
            multiline={true}
            numberOfLines={4}
            contentStyle={formStyle.inputLabel}
            placeholder={TranslateMessage('Admin.Delivery.App.Cancellation.Remark')}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default CancelBookingModal;
