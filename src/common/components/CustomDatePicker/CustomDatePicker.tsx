import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DatePickerInput, registerTranslation } from 'react-native-paper-dates';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';

type Mode = 'outlined' | 'flat';

type PresentationStyle = 'overFullScreen' | 'pageSheet';

type InputMode = 'start' | 'end';

interface ICustomDatePicker {
  value: DateType;
  onChange: (date: DateType) => void;
  label: string;
  mode: Mode;
  presentationStyle?: PresentationStyle;
  inputMode: InputMode;
  activeOutlineColor:string;
  outlineColor:string;
  validRange?: { startDate?: Date; endDate?: Date };
}


const CustomDatePicker: FunctionComponent<ICustomDatePicker> = (props) => {
  const { t: TranslateMessage } = useTranslation();
  registerTranslation("en-US", {
    mustBeHigherThan: (date) =>       
    TranslateMessage('Admin.Delivery.Custom.DatePicker.MustBeHigherThan',{ date : date}),
    save: '',
    selectSingle: '',
    selectMultiple: '',
    selectRange: '',
    notAccordingToDateFormat: () => '',
    mustBeLowerThan: () => '',
    mustBeBetween: () => '',
    dateIsDisabled: '',
    previous: '',
    next: '',
    typeInDate: '',
    pickDateFromCalendar: '',
    close: '',
    hour: '',
    minute: ''
  });
  
  const {
    value,
    onChange,
    label,
    activeOutlineColor,
    outlineColor,
    mode,
    presentationStyle,
    inputMode,
    validRange
  } = props;

  const handleDateChange = (date: DateType) => {
    onChange(date);
  };

  return (
    <DatePickerInput
      locale='en-US'
      style={[{backgroundColor:'transparent',} ]}
      label={label}
      value={value}
      saveLabel='Save'
      activeOutlineColor={activeOutlineColor}
      outlineColor={outlineColor}
      mode={mode}
      inputMode={inputMode}
      hideValidationErrors={true}
      onChange={handleDateChange}
      presentationStyle={presentationStyle}
      validRange={validRange}
      hasError={false}
    />
  );
};

export default CustomDatePicker;
