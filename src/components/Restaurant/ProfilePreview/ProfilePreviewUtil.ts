import { translateMessage } from "src/i18n/createTranslation";


interface ISellerImages {
  imageUrl: string;
}

interface SellerBankDetailsState {
  accountHolderName: string
  paymentMethod: string
  ribNumber: string | null
  mobileNumber: string
}


 interface PrimaryBankDetailsDTO {
  accountHolderName: string
  paymentMethod: string
  ribNumber: string | null
  mobileNumber: string
}

 interface SellerBankDetailDTO {
  primaryBankDetails: PrimaryBankDetailsDTO
}


interface IStaffMemberResponse {
  id?: string;
  memberEmail: string;
  memberPhone: string;
  memberName: string;
  role: string;
}

export enum DocumentType {
  LICENCE = 'LICENCE',
  TAX = 'TAX',
}



function checkIfEmpty(data: string | null | undefined) {
  if (!data) {
    return '';
  }
  return data;
}
enum IPaymentType {
   ORANGEMONEY='ORANGETRANSFER',
   BANKTRANSFER='BANKTRANSFER',
   WAVE='WAVE',
  }



  export function getPaymentMethodByKey(key: string | undefined | null): string {
    if (!key) return '';
    const translationKey = ReportReasonLabelKeys[key];
    return translationKey ? translateMessage(translationKey) : key;
  }

  const ReportReasonLabelKeys: Record<string, string> = {
    [IPaymentType.ORANGEMONEY]: 'Admin.Delivery.App.Orange.Money.Payment',
    [IPaymentType.BANKTRANSFER]: 'Admin.Delivery.App.Bank.Payment',
    [IPaymentType.WAVE]: 'Admin.Delivery.App.Wave.Payment',
  
      
    };
  


export {
  checkIfEmpty,
  SellerBankDetailsState
};
