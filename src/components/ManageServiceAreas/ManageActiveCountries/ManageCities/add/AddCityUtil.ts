import { translateMessage } from 'src/i18n/createTranslation';
interface IAddCity {
    id?: string;
    cityName: string;
    radius: string;
    countryId: string;
    latitude: number;
    longitude: number;
    taxes: ITaxInfo[];
    activeStatus: boolean;
    riderSharePercent: string;
    minServiceFee: string;
    serviceFeePercentage: string;
}

interface ICountryData {
    name: string;
    distanceUnit: string;
    countryISO: string;
    currency: string;
}

interface ICityErrors {
    apiError: string;
    cityName: string;
    radius: string;
    taxes: { taxName?: string; taxPercentage?: string }[];
    riderSharePercent: string;
    serviceFeePercentage: string;
    minServiceFee: string;
}

interface ITaxInfo {
    id?: number;
    taxName: string;
    taxPercentage: string;
    deleted: boolean;
}



function generateInitialCityData(): IAddCity {
    return {
        cityName: '',
        radius: '',
        countryId: '',
        taxes: [{ taxName: '', taxPercentage: '', deleted: false }],
        latitude: 0,
        longitude: 0,
        activeStatus: true,
        riderSharePercent: '',
        minServiceFee: '',
        serviceFeePercentage: '',
    }
}

function generateInitialErrorsData(): ICityErrors {
    return {
        cityName: '',
        radius: '',
        taxes: [{ taxName: '', taxPercentage: '' }],
        apiError: '',
        riderSharePercent: '',
        minServiceFee: '',
        serviceFeePercentage: ''
    }
}

const validateCity = (cityData: IAddCity) => {
    let isValid = true;

    // Accepts 0–100, integers only
    const integerRangeRegex = /^(100|\d{1,2})$/;
    // Accepts non-negative integers (for radius, minServiceFee)
    const nonNegativeIntegerRegex = /^\d+$/;

    const errors: ICityErrors = {
        cityName: '',
        radius: '',
        taxes: [],
        apiError: '',
        minServiceFee: '',
        riderSharePercent: '',
        serviceFeePercentage: ''
    };

    if (!cityData.cityName) {
        errors.cityName = translateMessage('Admin.Delivery.City.Name.Required');
        isValid = false;
    }

    if (cityData.radius === '' || cityData.radius === null || cityData.radius === undefined) {
        errors.radius = translateMessage('Admin.Delivery.App.Country.Distance.Unit');
        isValid = false;
    } else if (!nonNegativeIntegerRegex.test(cityData.radius)) {
        errors.radius = translateMessage('Admin.Delivery.App.Country.Radius.Numberic');
        isValid = false;
    }

    if (cityData.serviceFeePercentage === '' || cityData.serviceFeePercentage === null || cityData.serviceFeePercentage === undefined) {
        errors.serviceFeePercentage = translateMessage('Admin.Delivery.App.Country.Valid.To.Percentage');
        isValid = false;
    } else if (!integerRangeRegex.test(cityData.serviceFeePercentage)) {
        errors.serviceFeePercentage = translateMessage('Admin.Delivery.App.Country.Valid.To.Percentage');
        isValid = false;
    }

    if (cityData.riderSharePercent === '' || cityData.riderSharePercent === null || cityData.riderSharePercent === undefined) {
        errors.riderSharePercent = translateMessage('Admin.Delivery.App.Country.Valid.To.Percentage');
        isValid = false;
    } else if (!integerRangeRegex.test(cityData.riderSharePercent)) {
        errors.riderSharePercent = translateMessage('Admin.Delivery.App.Country.Valid.To.Percentage');
        isValid = false;
    }

    if (cityData.minServiceFee === '' || cityData.minServiceFee === null || cityData.minServiceFee === undefined) {
        errors.minServiceFee = translateMessage('Admin.Delivery.App.Country.MinimumServiceFee.Numeric.No.Decimal');
        isValid = false;
    } else if (!nonNegativeIntegerRegex.test(cityData.minServiceFee)) {
        errors.minServiceFee = translateMessage('Admin.Delivery.App.Country.MinimumServiceFee.Numeric.No.Decimal');
        isValid = false;
    }

    errors.taxes = cityData.taxes.map((tax) => {
        const taxErrors: { taxName?: string; taxPercentage?: string } = { taxName: '', taxPercentage: '' };

        if (tax.deleted) {
            return { taxName: '', taxPercentage: '' };
        }

        if (!tax.taxName.trim()) {
            taxErrors.taxName = translateMessage('Admin.Delivery.App.Country.Tax.Required');
            isValid = false;
        }

        if (tax.taxPercentage === '' || tax.taxPercentage === null || tax.taxPercentage === undefined) {
            taxErrors.taxPercentage = translateMessage('Admin.Delivery.App.Country.Tax.Percentage.Required');
            isValid = false;
        } else if (!integerRangeRegex.test(tax.taxPercentage.trim())) {
            taxErrors.taxPercentage = translateMessage('Admin.Delivery.App.Country.Valid.To.Percentage');
            isValid = false;
        }

        return taxErrors;
    });
    

    return { isValid, errors };
};

export { generateInitialCityData, generateInitialErrorsData, IAddCity, ICityErrors, ICountryData, ITaxInfo, validateCity };
