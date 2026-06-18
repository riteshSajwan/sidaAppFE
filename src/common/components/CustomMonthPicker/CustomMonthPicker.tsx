import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Modal, Pressable, Text, TouchableWithoutFeedback, View, } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Props } from 'src/common/components/CustomMonthPicker/CustomMonthPickerUtils';
import { useMonthPickerStyle } from 'src/common/components/CustomMonthPicker/CutomMonthPickerStyle';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';

const CustomMonthYearRangePicker: React.FC<Props> = ({ startMonthYear, endMonthYear, onRangeSelect, placeholder, locale, }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [showStartDropdown, setShowStartDropdown] = useState<boolean>(false);
  const [showEndDropdown, setShowEndDropdown] = useState<boolean>(false);
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const styles = useMonthPickerStyle();
  const {theme} = useAppTheme();
  const currentDate = useMemo(() => new Date(), []);
  const startMonthYearOptions = useMemo(() => {
    const options = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      const startMonth = year === currentYear ? currentMonth : 11;
      const endMonth = 0;
      for (let month = startMonth; month >= endMonth; month--) {
        const date = new Date(year, month, 1);
        const formatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' });
        options.push({
          label: formatter.format(date),
          value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
        });
      }
    }
    return options;
  }, [currentDate, locale]);
  const [startValue, setStartValue] = useState(startMonthYear);
  const [endValue, setEndValue] = useState(endMonthYear);
  const [tempStartValue, setTempStartValue] = useState(startValue);
  const [tempEndValue, setTempEndValue] = useState(endValue);
  const [originalStartValue, setOriginalStartValue] = useState(startValue);
  const [originalEndValue, setOriginalEndValue] = useState(endValue);

  useEffect(() => {
    setStartValue(startMonthYear);
    setTempStartValue(startMonthYear);
  }, [startMonthYear]);

  useEffect(() => {
    setEndValue(endMonthYear);
    setTempEndValue(endMonthYear);
  }, [endMonthYear]);

  const formatValueToText = (value: string) => {
    if (!value) return '';
    const [year, month] = value.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  };

  const getDisplayText = () =>
    startValue && endValue
      ? `${formatValueToText(startValue)} - ${formatValueToText(endValue)}`
      : placeholder;
  const isValidRange = useMemo(() => {
    if (!tempStartValue || !tempEndValue) return false;

    const [startYear, startMonth] = tempStartValue.split('-').map(Number);
    const [endYear, endMonth] = tempEndValue.split('-').map(Number);

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);
    if (startDate > endDate) return false;
    const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    return monthsDiff <= 12;
  }, [tempStartValue, tempEndValue]);

  const filteredEndOptions = useMemo(() => {
    if (!tempStartValue) return [];

    const [startYear, startMonth] = tempStartValue.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, 1);
    const maxEndDate = new Date(startYear, startMonth - 1 + 11, 1);
    const currentMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const actualMaxEndDate = maxEndDate > currentMonthDate ? currentMonthDate : maxEndDate;

    const options = [];
    let tempDate = new Date(startDate);

    while (tempDate <= actualMaxEndDate) {
      const formatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' });
      options.push({
        label: formatter.format(tempDate),
        value: `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}`,
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    return options;
  }, [tempStartValue, locale, currentDate]);
  useEffect(() => {
    if (tempStartValue && tempStartValue !== originalStartValue) {
      setTempEndValue('');
    }
  }, [tempStartValue, originalStartValue]);

  const openModal = () => {
    setOriginalStartValue(startValue);
    setOriginalEndValue(endValue);
    setTempStartValue(startValue);
    setTempEndValue(endValue);
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    if (!isValidRange) return;
    setStartValue(tempStartValue);
    setEndValue(tempEndValue);
    onRangeSelect(tempStartValue, tempEndValue);
    setIsModalVisible(false);
    setShowStartDropdown(false);
    setShowEndDropdown(false);
  };

  const closeModal = () => {
    setTempStartValue(originalStartValue);
    setTempEndValue(originalEndValue);
    setIsModalVisible(false);
    setShowStartDropdown(false);
    setShowEndDropdown(false);
  };

  const toggleDropdown = (type: 'start' | 'end') => {
    if (type === 'start') {
      setShowStartDropdown(!showStartDropdown);
      setShowEndDropdown(false);
    } else {
      if (!tempStartValue) return;
      setShowEndDropdown(!showEndDropdown);
      setShowStartDropdown(false);
    }
  };

  const renderDropdown = (
    value: string,
    setValue: (val: string) => void,
    isVisible: boolean,
    placeholderText: string,
    type: 'start' | 'end',
    options: { label: string, value: string }[],
    disabled: boolean = false
  ) => (
    <View style={{ position: 'relative', zIndex: isVisible ? 10 : 1 }}>
      <Pressable
        style={[
          styles.dropdownInput,
          isVisible && styles.dropdownInputActive,
          disabled && styles.disabledDropdown
        ]}
        onPress={() => !disabled && toggleDropdown(type)}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownInputText,
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {value ? formatValueToText(value) : placeholderText}
        </Text>
        <Text style={[
          styles.dropdownArrow,
          disabled && styles.disabledText
        ]}>
          <Icon name={isVisible ? 'chevronUp' : 'chevronDown'} size={12} color={theme.colors.iconBase}/>
        </Text>
      </Pressable>

      {isVisible && !disabled && (
        <View style={styles.absoluteDropdown}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            style={styles.dropdownList}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <Pressable
                style={[styles.dropdownItem, item.value === value && styles.selectedItem]}
                onPress={() => {
                  setValue(item.value);
                  setShowStartDropdown(false);
                  setShowEndDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    item.value === value && styles.selectedItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );

  return (
    <>
      <Pressable onPress={openModal} style={styles.inputContainer}>
        <Text style={[styles.inputText, (!startValue || !endValue) && styles.placeholderText]}>
          {getDisplayText()}
        </Text>
        <Icon name='calendar' size={20} color={theme.colors.iconBase} spacing={7}/>
      </Pressable>

      <Modal transparent visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={layout.flexCol}>
                  <Text style={styles.modalTitle}>{TranslateMessage('Admin.Delivery.App.Select.Date.Range')}</Text>

                  <Text style={styles.label}>{TranslateMessage('Admin.Delivery.App.Select.Start.Month.Year')}</Text>
                  {renderDropdown(
                    tempStartValue,
                    setTempStartValue,
                    showStartDropdown,
                    TranslateMessage('Admin.Delivery.App.Select.Start.Month.Year.placeholder'),
                    'start',
                    startMonthYearOptions
                  )}

                  <Text style={[styles.label, styles.endLabel]}>{TranslateMessage('Admin.Delivery.App.Select.End.Month.Year')}</Text>
                  {renderDropdown(
                    tempEndValue,
                    setTempEndValue,
                    showEndDropdown,
                    !tempStartValue ?  TranslateMessage('Admin.Delivery.App.Select.Start.Month.Year.placeholder'): TranslateMessage('Admin.Delivery.App.Select.End.Month.Year.placeholder'),
                    'end',
                    filteredEndOptions,
                    !tempStartValue 
                  )}

                  {/* {tempStartValue && tempEndValue && tempStartValue > tempEndValue && (
                    <Text style={styles.errorText}>
                      Start date must be before or equal to end date
                    </Text>
                  )}

                  {tempStartValue && tempEndValue && !isValidRange && tempStartValue <= tempEndValue && (
                    <Text style={styles.errorText}>
                      Date range cannot exceed 12 months
                    </Text>
                  )}

                  {!tempStartValue && (
                    <Text style={styles.errorText}>
                      Please select a start date first
                    </Text>
                  )} */}
                </View>

                <View style={[styles.buttonsRow, { zIndex: -1 }]}>
                  <Pressable onPress={closeModal} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>{TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirm}
                    style={[styles.confirmButton, !isValidRange && styles.disabledButton]}
                    disabled={!isValidRange}
                  >
                    <Text style={[styles.confirmText, !isValidRange && styles.disabledText]}>
                      {TranslateMessage('Admin.Delivery.App.Apply')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default CustomMonthYearRangePicker;