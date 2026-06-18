import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import {  StyleProp, ViewStyle } from 'react-native';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';



 export enum IServingTime{
    ONE = '1',
    TWO= '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    TEN = '10',
    FIFTEEN = '15',
    TWENTY = '20',
    TWENTY_FIVE = '25',
    THIRTY = '30',
    THIRTY_FIVE = '35',
    FORTY = '40',
    FORTY_FIVE = '45',
  }
const minuteOptions = [
     { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.FIVE}), value: IServingTime.FIVE },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.TEN}), value: IServingTime.TEN },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.FIFTEEN}), value: IServingTime.FIFTEEN },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.TWENTY}), value: IServingTime.TWENTY },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.TWENTY_FIVE}), value: IServingTime.TWENTY_FIVE },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.THIRTY}), value: IServingTime.THIRTY },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.THIRTY_FIVE}), value: IServingTime.THIRTY_FIVE },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.FORTY}), value: IServingTime.FORTY },
       { label: translateMessage('Admin.Delivery.App.Average.Preparation.Minutes',{minutes: IServingTime.FORTY_FIVE}), value: IServingTime.FORTY_FIVE },
];

const activeStatus = [
    { label: 'Active', value: 'true' },
    { label: 'InActive', value: 'false' },
]

function requestStatus() { 
  return [
  {
    label: translateMessage(
      'Admin.Delivery.App.RequestManagementList.Filter.All'
    ),
    value: '',
  },
  {
    label: translateMessage(
      'Admin.Delivery.App.RequestManagementList.Filter.Pending'
    ),
    value:  RequestType.PENDING,
  },
  {
    label: translateMessage(
      'Admin.Delivery.App.RequestManagementList.Filter.Approved'
    ),
    value: RequestType.APPROVED,
  },


  {
    label: translateMessage(
      'Admin.Delivery.App.RequestManagementList.Filter.Rejected'
    ),
    value: RequestType.REJECTED,
  },
];
}
const distanceUnit = [
    { label: translateMessage(
      'Admin.Delivery.App.Distance.Km'
    ), value: 'KM' },
    { label: translateMessage(
     'Admin.Delivery.App.Distance.miles'
    ), value: 'Miles' },
]

interface IOption {
  label: string;
  value: string;
}

interface IMultiSelectDropdownProps {
  data: IOption[];
  selectedValues: IOption[]; 
  onChange: (items: IMinuteOption[]) => void;
  disabled?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export {
    minuteOptions,
    activeStatus,
    distanceUnit,
    requestStatus,
    IMultiSelectDropdownProps,
    IOption
};