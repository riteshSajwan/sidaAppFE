import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';

interface IOption {
  label: string;
  value: string;
}

interface IDropDownProps {
  data: IOption[];
  selectedValue: IOption;
  disabled?:boolean;
  error?:string;
  onChange: (item: IMinuteOption) => void;
  style?:StyleProp<ViewStyle>;
 
}

const Customdropdown: FunctionComponent<IDropDownProps> = (props: IDropDownProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const {theme} = useAppTheme();
  const { data,style=layout.dropdownHeight,selectedValue, disabled=false, error='', onChange } = props;

  const renderItem = (item: IOption) => {
    return (
      <View style={layout.dropDownItem}>
        <Text style={{color: theme.colors.textBody}}>{item.label}</Text>
      </View>
    );
  };
  return (
    <View style={{ width: '100%'}}>
      <Dropdown
        style={[style,layout.dropdown,disabled && layout.disabledDropdown, error!='' && formStyle.errorBorderColor]}
        placeholderStyle={layout.placeholderStyle}
        selectedTextStyle={[layout.placeholderStyle,selectedValue.value !='' && layout.selectedTextStyle]}
        inputSearchStyle={layout.inputSearchStyle}
        // iconStyle={layout.iconStyle}
        data={data}
        disable={disabled}
        labelField='label'
        valueField='value'
        placeholder={selectedValue.label ? selectedValue.label : TranslateMessage('Admin.Delivery.App.Select')}
        value={selectedValue.value}
        maxHeight={200}
        onChange={onChange}
        renderItem={renderItem}
      />
    </View>
  );
};
export default Customdropdown;
