import { countries } from 'countries-list';

export const getCountryAndCallingCodeByPhoneNumber = (phoneNumber: string): { countryName: string | null, callingCode: string | null, countryCode: string | null } => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    for (let [code, country] of Object.entries(countries)) {
      const callingCodes = country.phone || [];
      for (let callingCode of callingCodes) {
        if (cleanedPhoneNumber.startsWith(callingCode.toString())) {
          return {
            countryName: country.name,
            callingCode: callingCode.toString(),
            countryCode: code,
          };
        }
      }
    }
    return { countryName: null, callingCode: null, countryCode: null };
  };