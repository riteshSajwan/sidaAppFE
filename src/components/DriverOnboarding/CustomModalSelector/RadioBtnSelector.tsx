import React, { FunctionComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import styles from 'src/components/modules/admin/pages/settings/SettingsStyle';
import { getColorCode } from 'src/components/modules/admin/pages/settings/SettingsUtils';
import { IOption } from 'src/common/components/CustomDropdown/CustomDropdown';

interface ICustomRadioBtnSelectorProps {
    items: IOption[];
    selectedValue: IOption;
    onValueChange: (selectedValue: IOption) => void;
}

const RadioBtnSelector: FunctionComponent<ICustomRadioBtnSelectorProps> = (props) => {

    const {
        items,
        selectedValue,
    } = props;

    const { value } = selectedValue;

    function onValueChange(value: string) {
        const selectedValues = {
            label: '',
            value,
        }

        props.onValueChange(selectedValues);
    };

    const handleOptionSelection = (value: string) => () => {
        onValueChange(value);
    };

    return (
        <View style={styles.RadioOuter}>
            <RadioButton.Group
                onValueChange={onValueChange}
                value={value}
            >
                {items.map((items) => (
                    <TouchableOpacity
                        key={items.value}
                        style={styles.radioGroup}
                        onPress={handleOptionSelection(items.value)}
                    >
                        <RadioButton
                            value={items.value}
                            color={getColorCode(items.label, items.value)}
                        />
                        <Text allowFontScaling={false} style={styles.modalOption}>{items.label}</Text>
                    </TouchableOpacity>
                ))}
            </RadioButton.Group>
        </View>
    );
};

export default RadioBtnSelector;