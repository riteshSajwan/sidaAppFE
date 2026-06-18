import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Switch } from 'react-native-paper';
import { IOption } from 'src/common/components/CustomDropdown/CustomDropdown';
import { useAppTheme } from 'src/common/context/AppTheme';
import { changeNotificationStatus } from 'src/common/service/settings/api';
import { useSettingStyle } from 'src/components/Account/Settings/SettingsStyle';
import { NOTIFICATION_OPTION } from 'src/components/Account/Settings/SettingsUtils';

interface ICustomSwitchBtnSelectorProps {
    selectedValue: IOption;
    onValueChange: (selectedValue: IOption) => void;
    label: string;
}

const SwitchBtnSelector: FunctionComponent<ICustomSwitchBtnSelectorProps> = (
  props
) => {
  const { selectedValue, label } = props;

  const { value } = selectedValue;

  const { t: TranslateMessage } = useTranslation();
  const {theme} = useAppTheme();

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (value) {
      value === NOTIFICATION_OPTION.DISABLE
        ? setIsSwitchOn(false)
        : setIsSwitchOn(true);
    }
  }, [value]);

  async function saveLangInfo() {
    try {
      setLoading(true);
      await changeNotificationStatus(isSwitchOn);
    } catch {
      setError(TranslateMessage('Admin.Delivery.App.SomethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }

  const onToggleSwitch = () => {
    setIsSwitchOn((prevState) => !prevState);
    onValueChange(!isSwitchOn);
  };

  function onValueChange(switchValue: boolean) {
    const select = {
      label: TranslateMessage(
          `Custmor.Delivery.App.Notification.${switchValue ? 'Enabled' : 'Disabled'}`
      ),
      value: switchValue ? NOTIFICATION_OPTION.ENABLE : NOTIFICATION_OPTION.DISABLE,
  };
    props.onValueChange(select);
  }
  const styles = useSettingStyle();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
      }}
    >
      <Text allowFontScaling={false} style={styles.modalOption}>{label}</Text>
      <Switch
        value={isSwitchOn}
        onValueChange={onToggleSwitch}
        color={theme.colors.iconBase}
      />
    </View>
  );
};

export default SwitchBtnSelector;