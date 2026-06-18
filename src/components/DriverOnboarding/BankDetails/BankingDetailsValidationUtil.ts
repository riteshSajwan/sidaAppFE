import { translateMessage } from 'src/i18n/createTranslation';
import { IBankErrors, IBankInfo, IPaymentsOption, PaymentOptions } from 'src/components/DriverOnboarding/BankDetails/BankDetailsUtil';
import { validatePhoneNumber } from 'src/components/DriverOnboarding/PersonalInformation/PersonalInfoUtil';

interface ValidationResult<T> {
    isValid: boolean;
    errors: T;
}

function validateBankingDetails(bankInfo: IBankInfo): ValidationResult<IBankErrors> {
    const errors: IBankErrors = {
        paymentModeError:'',
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
        apiError:''
    };
    
    let isValid = true;
    
     // Validate payment mode
     if (!bankInfo.selectedPayment.trim()) {
        errors.paymentModeError = translateMessage('Admin.Delivery.App.Bank.Payment.Method.Required');
        isValid = false;
    }

    if(bankInfo.selectedPayment === PaymentOptions.BANKTRANSFER){
    // Validate account holder name
    if (!bankInfo.bankTransfer.accountHolderName?.trim()) {
        errors.bankTransfer.accountHolderNameError = translateMessage('Admin.Delivery.App.Bank.Account.Holder.Name.Required');
        isValid = false;
    } else {
        const onlyAlphabetsRegex = /^[A-Za-z\s]+$/;

        if (!onlyAlphabetsRegex.test(bankInfo.bankTransfer.accountHolderName)) {
            errors.bankTransfer.accountHolderNameError = translateMessage('Admin.Delivery.App.Name.Validation');
            isValid = false;
        }
    }

    // Validate RIB number
    if (!bankInfo.bankTransfer.ribNumber.trim()) {
        errors.bankTransfer.ribNumberError = translateMessage('Admin.Delivery.App.RIB.Number.Required');
        isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(bankInfo.bankTransfer.ribNumber)) {
        errors.bankTransfer.ribNumberError = translateMessage('Admin.Delivery.App.RIB.Number.Invalid');
        isValid = false;
    } else if (!/^[a-zA-Z0-9]{18,25}$/.test(bankInfo.bankTransfer.ribNumber)) {
        errors.bankTransfer.ribNumberError = translateMessage('Admin.Delivery.App.RIB.Number.Length');
        isValid = false;
    }
    // Validate confirm RIB number
    if (!bankInfo.bankTransfer.confirmRibNumber.trim()) {
        errors.bankTransfer.confirmRibNumberError = translateMessage('Admin.Delivery.App.Confirm.RIB.Number.Required');
        isValid = false;
    } else if (bankInfo.bankTransfer.confirmRibNumber !== bankInfo.bankTransfer.ribNumber) {
        errors.bankTransfer.confirmRibNumberError = translateMessage('Admin.Delivery.App.RIB.Numbers.Do.Not.Match');
        isValid = false;
    }
    if(!(bankInfo.wave.primaryAccount || bankInfo.bankTransfer.primaryAccount || bankInfo.orangeTransfer.primaryAccount)){
        errors.bankTransfer.primaryAccountError = translateMessage('Admin.Delivery.App.Primary.Account.Required');
        isValid = false;
    }

    } else if(bankInfo.selectedPayment === PaymentOptions.ORANGETRANSFER){
        
    // Validate account holder name
    if (!bankInfo.orangeTransfer.accountHolderName?.trim()) {
        errors.orangeTransfer.accountHolderNameError = translateMessage('Admin.Delivery.App.Bank.Account.Holder.Name.Required');
        isValid = false;
    }
    else {
        const onlyAlphabetsRegex = /^[A-Za-z\s]+$/;

        if (!onlyAlphabetsRegex.test(bankInfo.orangeTransfer.accountHolderName)) {
            errors.orangeTransfer.accountHolderNameError = translateMessage('Admin.Delivery.App.Name.Validation');
            isValid = false;
        }
    }
    if (!bankInfo.orangeTransfer.mobileNumber.trim()) {
        errors.orangeTransfer.mobileNumberError = translateMessage('Admin.Delivery.App.Mobile.Number.Required');
        isValid = false;
    } else {
        const phoneError = validatePhoneNumber({
            callingCode: bankInfo.orangeTransfer.callingCode,
            phoneNumber: bankInfo.orangeTransfer.mobileNumber
        });
    
        if (phoneError) {
            errors.orangeTransfer.mobileNumberError = phoneError;
            isValid = false;
        } else {
            errors.orangeTransfer.mobileNumberError = '';
        }
    }
    
    // Validate confirm Mobile number
    if (!bankInfo.orangeTransfer.confirmMobileNumber.trim()) {
        errors.orangeTransfer.confirmMobileNumberError = translateMessage('Admin.Delivery.App.Re-Mobile.Mobile.Required');
        isValid = false;
    } else if (bankInfo.orangeTransfer.confirmMobileNumber !== bankInfo.orangeTransfer.mobileNumber) {
        errors.orangeTransfer.confirmMobileNumberError = translateMessage('Admin.Delivery.App.Mobile.Numbers.Do.Not.Match');
        isValid = false;
    }

    if(!(bankInfo.wave.primaryAccount || bankInfo.bankTransfer.primaryAccount || bankInfo.orangeTransfer.primaryAccount)){
        errors.orangeTransfer.primaryAccountError = translateMessage('Admin.Delivery.App.Primary.Account.Required');
        isValid = false;
    }

    } else if(bankInfo.selectedPayment === PaymentOptions.WAVE){

    // Validate account holder name
    if (!bankInfo.wave.accountHolderName?.trim()) {
        errors.wave.accountHolderNameError = translateMessage('Admin.Delivery.App.Bank.Account.Holder.Name.Required');
        isValid = false;
    } 
    else {
        const onlyAlphabetsRegex = /^[A-Za-z\s]+$/;

        if (!onlyAlphabetsRegex.test(bankInfo.wave.accountHolderName)) {
            errors.wave.accountHolderNameError = translateMessage('Admin.Delivery.App.Name.Validation');
            isValid = false;
        }
    }
    if (!bankInfo.wave.mobileNumber.trim()) {
        errors.wave.mobileNumberError = translateMessage('Admin.Delivery.App.Mobile.Number.Required');
        isValid = false;
    } else {
        const phoneError = validatePhoneNumber({
            callingCode: bankInfo.wave.callingCode,
            phoneNumber: bankInfo.wave.mobileNumber
        });
    
        if (phoneError) {
            errors.wave.mobileNumberError = phoneError;
            isValid = false;
        } else {
            errors.wave.mobileNumberError = ''; // clear any previous error
        }
    }
    
    // Validate confirm Mobile number
    if (!bankInfo.wave.confirmMobileNumber.trim()) {
        errors.wave.confirmMobileNumberError = translateMessage('Admin.Delivery.App.Re-Mobile.Mobile.Required');
        isValid = false;
    } else if (bankInfo.wave.confirmMobileNumber !== bankInfo.wave.mobileNumber) {
        errors.wave.confirmMobileNumberError = translateMessage('Admin.Delivery.App.Mobile.Numbers.Do.Not.Match');
        isValid = false;
    }
    if(!(bankInfo.wave.primaryAccount || bankInfo.bankTransfer.primaryAccount || bankInfo.orangeTransfer.primaryAccount)){
        errors.wave.primaryAccountError = translateMessage('Admin.Delivery.App.Primary.Account.Required');
        isValid = false;
    }
    } 
    
    return { isValid, errors };
}

function validatePaymentMethod(paymentOption: IPaymentsOption): ValidationResult<{paymentModeError: string}> {
    const errors = {
        paymentModeError: ''
    };
    let isValid = true;

    if (!paymentOption.value.trim()) {
        errors.paymentModeError = translateMessage('Admin.Delivery.App.Bank.Payment.Method.Required');
        isValid = false;
    }
    return { isValid, errors };
}

export { validateBankingDetails, validatePaymentMethod };