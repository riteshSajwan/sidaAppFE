import { translateMessage } from 'src/i18n/createTranslation';

interface IAddCountry {
    countryName?: string;
    distanceUnit?: string;
    currency?: string;
    countryISO?: string;
    activeStatus?: boolean;
    tip?: string;
    paymentMethods?: string[];
    timezones?: string | string[];
    timezone?: string;
    primaryTimezone?: string;
}
interface ICountries {
    id: number;
    countryName: string;
    distanceUnit: string;
    currencyType: string;
    countryISO: string;
    name:string;
    currency:string
  }

interface ICountryErrors {
    apiError: string;
    countryName: string;
    currency: string;
    countryISO: string;
    distanceUnit: string;
    tip: string;
    payment: string;
    timezones: string;
}
 interface IAllCountry {
  countryName: string;
  currency: string;
  currencyName: string;
  countryISO: string;
  distanceUnit: string;
  timezones?: string[];
  primaryTimezone?: string;
}


interface ICurrencyResponse {
    currencyName: string;
}

function generateInitialCountryData(): IAddCountry {
    return {
        countryName: '',
        distanceUnit: '',
        currency: '',
        countryISO: '',
        activeStatus: true,
        tip: '',
        paymentMethods: [],
        timezones: [],
        primaryTimezone: '',
    }
}

function generateInitialErrorsData(): ICountryErrors {
    return {
        countryName: '',
        distanceUnit: '',
        currency: '',
        countryISO: '',
        apiError: '',
        tip: '',
        payment: '',
        timezones: '',
    }
}

const validateCountry = (countryData: IAddCountry) => {
    let isValid = true;
    const errors = {
        countryName: '',
        distanceUnit: '',
        currency: '',
        countryISO: '',
        apiError: '',
        tip: '',
        payment: '',
        timezones: '',
    };

    if (!countryData.countryName) {
        errors.countryName = translateMessage('Admin.Delivery.App.Country.Name.required');
        isValid = false;
    }

    if (!countryData.timezones || countryData.timezones.length === 0) {
        errors.timezones = translateMessage('Admin.Delivery.App.Country.Timezone.Required');
        isValid = false;
    }

    // if (!countryData.paymentMethods || countryData.paymentMethods.length === 0) {
    //     errors.payment = translateMessage('Admin.Delivery.App.PaymentMethod.required');
    //     isValid = false;
    //   }
      
    //Required in Future
    // if (!countryData.distanceUnit) {
    //     errors.distanceUnit =translateMessage('Admin.Delivery.App.Country.Distance.Unit');
    //     isValid = false;
    // }
    // if (!countryData.countryISO) {
    //     errors.countryISO =translateMessage('Admin.Delivery.App.Country.Iso.Code');
    //     isValid = false;
    // }
    // if (!countryData.currency) {
    //     errors.currency = translateMessage('Admin.Delivery.App.Country.Currency.Required');
    //     isValid = false;
    // }
    // required in future
    // const tipRegex = /^(?!0(\.0+)?$)([+]?\d+(\.\d+)?|(\.\d+))$/;

    // if (!tipRegex.test(countryData.tip)) {
    //     errors.tip = translateMessage('Admin.Delivery.App.Country.Tip.Numeric');
    //     isValid = false;
    // }

    const tip = typeof countryData?.tip === 'string' ? countryData.tip.trim() : String(countryData?.tip || '');
 
    if (tip !== '' && isNaN(Number(tip))) {
        errors.tip = translateMessage('Admin.Delivery.App.Country.Tip.Numeric');
        isValid = false;
    }

    return { isValid, errors };
};

export { generateInitialCountryData, generateInitialErrorsData, IAddCountry, IAllCountry, ICountries, ICountryErrors, ICurrencyResponse, validateCountry };
