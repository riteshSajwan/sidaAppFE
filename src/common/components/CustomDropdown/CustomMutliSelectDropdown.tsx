import { MaterialIcons } from '@expo/vector-icons';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IMultiSelectDropdownProps, IOption } from 'src/common/components/CustomDropdown/CustomDropdownUtil';
import { useAppTheme } from 'src/common/context/AppTheme';

const CustomMultiSelectDropdown: FunctionComponent<IMultiSelectDropdownProps> = ({
  data,
  selectedValues,
  onChange,
  disabled = false,
  error = '',
  style
}) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const {theme} = useAppTheme();

  const selectedValueKeys = selectedValues.map(item => item.value);

  const renderItem = (item: IOption) => {
    const isSelected = selectedValueKeys.includes(item.value);
    return (
      <View style={[layout.renderMultiSelect, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={{color: theme.colors.textBody}}>{item.label}</Text>
        <MaterialIcons
          name={isSelected ? 'check-box' : 'check-box-outline-blank'}
          size={20}
          color={isSelected ? theme.colors.iconBase : theme.colors.iconDisabled}
          style={{ marginRight: 10 }}
        />
      </View>
    );
  };

  const handleChange = (selected: string[]) => {
    const newSelection = data.filter(item => selected.includes(item.value));
    onChange(newSelection);
  };

  return (
    <View style={{ width: '100%' }}>
      <MultiSelect
        style={[
          style,
          layout.dropdown, layout.dropdownHeight,
          disabled && layout.disabledDropdown,
          error !== '' && formStyle.errorBorderColor,
        ]}
        placeholderStyle={layout.placeholderStyle}
        selectedTextStyle={[
          layout.placeholderStyle,
          selectedValues.length > 0 && layout.selectedTextStyle,
        ]}
        inputSearchStyle={layout.inputSearchStyle}
        data={data}
        disable={disabled}
        labelField='label'
        valueField='value'
        value={selectedValueKeys}
        maxHeight={200}
        placeholder={
          selectedValues.length > 0
            ? selectedValues.map(item => item.label).join(', ')
            : TranslateMessage('Admin.Delivery.App.Select')
        }
        onChange={handleChange}
        renderItem={renderItem}
        renderSelectedItem={() => <></>}
      />
    </View>
  );
};

export default CustomMultiSelectDropdown;
