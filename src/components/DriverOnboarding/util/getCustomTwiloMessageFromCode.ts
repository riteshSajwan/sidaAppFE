import { OtpCodes } from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import { translateMessage } from 'src/i18n/createTranslation';

const getCustomTwiloMessageFromCode = (code?: string, message?: string): string => {
  switch (code) {
    case OtpCodes.MAX_LIMIT:
    case OtpCodes.MAX_VERIFY:
      return translateMessage('Admin.Delivery.App.Max.Otp');
    case OtpCodes.OTP_EXPIRED:
      return message ?? translateMessage('Admin.Delivery.App.Otp.Invalid');
    case OtpCodes.TEMP_BLOCK:
      return translateMessage('Admin.Delivery.App.Otp.Block');
    case OtpCodes.INCORRECT_OTP:
      return translateMessage('Admin.Delivery.App.Incorrect.OTP');
    case OtpCodes.BLOCKED:
      return message ?? translateMessage('Admin.Delivery.App.Otp.Error');
    case OtpCodes.OTP_VALIDATION:
    case OtpCodes.USER_EXISTS_DIFFERENT_ROLE:
      return message ?? translateMessage('Admin.Delivery.App.Incorrect.OTP');
    default:
      return translateMessage('Admin.Delivery.App.Otp.Error');
  }
};

export { getCustomTwiloMessageFromCode };
