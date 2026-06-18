import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimePickerModal } from 'react-native-paper-dates';
import { ITime } from 'src/components/Restaurant/utils/RestaurantUtil';

interface ICustomTimePickerProps {
  label: string;
  visible: boolean;
  onDismiss: () => void;
  onConfirm: ({ hours, minutes }: ITime) => void;
  currentTime: Date | string;
}

const CustomTimePicker = (props: ICustomTimePickerProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { label, visible, onDismiss, onConfirm, currentTime } = props;
  const currentTimeUpdated = new Date(currentTime);
  return (
    <TimePickerModal
      defaultInputType='picker'
      label={label}
      visible={visible}
      onDismiss={onDismiss}
      onConfirm={onConfirm}
      hours={currentTimeUpdated.getHours()}
      minutes={currentTimeUpdated.getMinutes()}
      use24HourClock={true}
      cancelLabel={TranslateMessage('Admin.Delivery.App.Cancel')}
      confirmLabel={TranslateMessage('Admin.Delivery.App.Save')}
    />
  );
};

export default CustomTimePicker;
