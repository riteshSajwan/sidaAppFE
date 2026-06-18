export const removeCallingCode = (phoneNumber: string, callingCode: string): string => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (cleanedPhoneNumber.startsWith(callingCode)) {
      return cleanedPhoneNumber.slice(callingCode.length);
    }
    return cleanedPhoneNumber;
  };