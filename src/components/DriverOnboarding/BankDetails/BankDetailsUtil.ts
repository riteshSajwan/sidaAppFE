import { TCountryCode } from 'countries-list';
import { ALLOW_BANK_ACCOUNT_INPUT_SIZE, ALLOW_BANK_IFSC_INPUT_SIZE } from 'src/components/DriverOnboarding/constant/index';
import { translateMessage } from 'src/i18n/createTranslation';
export interface IBankTransferErrors {
  accountHolderNameError: string;
  ribNumberError: string;
  confirmRibNumberError: string;
  primaryAccountError: string;
}

export interface IMobilePaymentErrors {
  accountHolderNameError: string;
  mobileNumberError: string;
  confirmMobileNumberError: string;
  primaryAccountError: string;
}

export interface IBankTransfer {
  accountHolderName: string;
  ribNumber: string;
  confirmRibNumber: string;
  isPrimary: boolean;
  primaryAccount: boolean;
  paymentMethod: string;
}

export interface IMobilePayment {
  accountHolderName: string;
  mobileNumber: string;
  confirmMobileNumber: string;
  primaryAccount: boolean;
  isPrimary: boolean;
  paymentMethod: string;
  countryCode: TCountryCode;
  callingCode: string;
}

export interface IBankErrors {
  paymentModeError: string;
  bankTransfer: IBankTransferErrors;
  orangeTransfer: IMobilePaymentErrors;
  wave: IMobilePaymentErrors;
  apiError: string;
}

function generateBankIntialErrorMsg(): IBankErrors {
  return {
    paymentModeError: '',
    bankTransfer: {
      accountHolderNameError: '',
      primaryAccountError: '',
      ribNumberError: '',
      confirmRibNumberError: '',
    },
    orangeTransfer: {
      accountHolderNameError: '',
      primaryAccountError: '',
      mobileNumberError: '',
      confirmMobileNumberError: '',
    },
    wave: {
      accountHolderNameError: '',
      primaryAccountError: '',
      mobileNumberError: '',
      confirmMobileNumberError: '',
    },
    apiError: '',
  };
}
interface IPaymentsOption {
  label: string;
  value: string;
}
function validateIfscCode(ifscCode: string) {
  if (ifscCode.trim() === '') {
    return translateMessage('Admin.Bank.Details.IFSC.Required');
  }
  if (ifscCode.length > ALLOW_BANK_IFSC_INPUT_SIZE) {
    return translateMessage('Admin.Delivery.App.Error.Character.Limit.Field', {
      characterLimit: ALLOW_BANK_IFSC_INPUT_SIZE.toString(),
    });
  }
  return '';
}
function validatePaymentMode(paymentMode: string) {
  if (paymentMode.trim() === '') {
    return translateMessage('Admin.Bank.Details.paymentMode.Required');
  }
  return '';
}
function validateBankAccountNumber(bankAccountNumber: string) {
  if (bankAccountNumber.trim() === '') {
    return translateMessage('Admin.Bank.Details.AccountNumber.Required');
  }
  if (!/^\d+$/.test(bankAccountNumber)) {
    return translateMessage('Admin.Bank.Details.AccountNumber.Invalid');
  }
  if (bankAccountNumber.length > ALLOW_BANK_ACCOUNT_INPUT_SIZE) {
    return translateMessage('Admin.Delivery.App.Error.Character.Limit.Field', {
      characterLimit: ALLOW_BANK_ACCOUNT_INPUT_SIZE.toString(),
    });
  }
  return '';
}

function validateConfirmBankAccountNumber(bankAccountNumber: string, confirmBankAccountNumber: string) {
  if (confirmBankAccountNumber.trim() === '') {
    return translateMessage('Admin.Bank.Details.ConfirmAccountNumber.Required');
  }
  if (!/^\d+$/.test(confirmBankAccountNumber)) {
    return translateMessage('Admin.Bank.Details.AccountNumber.Invalid');
  }
  if (bankAccountNumber !== confirmBankAccountNumber) {
    return translateMessage('Admin.Bank.Details.AccountNumber.Mismatch');
  }
  if (bankAccountNumber.length > ALLOW_BANK_ACCOUNT_INPUT_SIZE) {
    return translateMessage('Admin.Delivery.App.Error.Character.Limit.Field', {
      characterLimit: ALLOW_BANK_ACCOUNT_INPUT_SIZE.toString(),
    });
  }
  return '';
}

export type OrangeTransfer = {
  accountHolderName: string;
  mobileNumber: string;
  isPrimary: boolean;
  paymentMethod: string;
  countryCode: string;
  callingCode: string;
};
export interface IBankInfo {
  selectedPayment: string;
  bankTransfer: IBankTransfer;
  orangeTransfer: IMobilePayment;
  wave: IMobilePayment;
}
export type bankDetailsResponse = {
  id: number;
  userId: number;
  accountHolderName: string;
  paymentMethod: string;
  ribNumber: string | null;
  mobileNumber: string;
  isPrimary: boolean;
  deleted: boolean;
  activeStatus: boolean;
  onboardingSubmitted: string | null;
  requestType: string | null;
  requestName: string | null;
};

export interface IBankDataResponse {
  accountHolderName: string;
  isPrimary: boolean;
  paymentMethod: string;
  ribNumber?: string;
  mobileNumber?: string;
}
export enum PaymentOptions {
  BANKTRANSFER = 'BANKTRANSFER',
  ORANGETRANSFER = 'ORANGETRANSFER',
  WAVE = 'WAVE',
}

export enum OtpCodes {
  MAX_LIMIT = '60203',
  OTP_EXPIRED = '20404',
  TEMP_BLOCK = '60410',
  INCORRECT_OTP = 'error.Incorrect.OTP',
  MAX_VERIFY = '60202',
  BLOCKED = 'auth.blocked.user',
  OTP_VALIDATION = 'validation',
  USER_EXISTS_DIFFERENT_ROLE = 'auth.user.exist.with.other.role',
}

export { generateBankIntialErrorMsg, IPaymentsOption };
