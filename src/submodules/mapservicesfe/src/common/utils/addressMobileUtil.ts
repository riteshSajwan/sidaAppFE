import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';

export type GooglePlacesAutocompleteRef = {
  setAddressText(address: string): void;
  getAddressText(): string;
  getCurrentLocation: () => void;
} & TextInput;

export interface IAddressDetails{
  city: string;
  state: string;
  country: string;
  pinCode: string;
  countryCode: string;
}

export interface IAddressInfo{
  address: string;
  addressDetails: IAddressDetails;
}

export interface ISearchIconInfo{
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

export enum SearchType{
  PRIMARY = 'primary',
  SECONDARY= 'secondary'
}


export function getValue(value:string) {
  return value || ''
};