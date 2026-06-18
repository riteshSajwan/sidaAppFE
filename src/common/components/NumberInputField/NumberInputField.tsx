import { FunctionComponent } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useAppTheme } from 'src/common/context/AppTheme';

interface INumberInputFieldProps {
  placeholder: string;
  value: string;
  onChangeNumber: (value: string) => void;
  style: StyleProp<TextStyle>;
  label: string;
}

const NumberInputField: FunctionComponent<INumberInputFieldProps> = (props) => {
  const { value, onChangeNumber, placeholder, style, label } = props;
  const formStyle = useFormStyle();
  const {theme} = useAppTheme();
  return (
    <>
      <Text style={formStyle.labelTitle}>{label}</Text>
      <TextInput
        style={style}
        onChangeText={onChangeNumber}
        value={value}
        placeholder={placeholder}
        keyboardType='numeric'
        placeholderTextColor={theme.colors.textNeutral}
        mode='outlined'
        autoCapitalize='none'
        activeOutlineColor={theme.colors.borderErrorInverse}
        outlineColor={theme.colors.borderMedium}
        contentStyle={formStyle.inputPlaceholderLabel}
      />
    </>
  );
};

export default NumberInputField;
