import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface ICouponTag {
    id?: string;
    couponName: string;
    expirationDateTime: string | Date | null | DateType;
    minimumOrderValue:string;
    maximumOrderValue:string;
    couponDiscountPercent: string;
    maxDiscountAvailable: string;
    couponFrenchName:string;
}

interface ICouponErrors {
    apiError: string;
    couponName: string;
    expirationDateTime: string;
    minimumOrderValue: string;
    couponDiscountPercent:string;
    maxDiscountAvailable: string;
    maximumOrderValue: string,
    couponFrenchName:string,
}

function generateInitialCouponData(): ICouponTag {
    return {
        couponName: '',
        expirationDateTime: null,
        minimumOrderValue:'',
        couponDiscountPercent:'',
        maxDiscountAvailable: '',
        maximumOrderValue: '',
        couponFrenchName:'',
    }
}

function generateInitialErrorsData(): ICouponErrors {
    return {
        couponName: '',
        expirationDateTime: '',
        minimumOrderValue: '',
        apiError: '',
        couponDiscountPercent: '',
        maxDiscountAvailable: '',
        maximumOrderValue: '',
        couponFrenchName:'',
    }
}

const validateCoupon = (Coupondata: ICouponTag) => {
    let isValid = true;
    const percentageRegex = /^(100(\.00?)?|(\d{1,2}(\.\d{1,2})?))$/;
    const errors = {
        apiError: '',
        couponName: '',
        expirationDateTime: '',
        minimumOrderValue: '',
        maximumOrderValue: '',
        couponDiscountPercent: '',
        maxDiscountAvailable: '',
        couponFrenchName:''
    };

    if (!Coupondata.couponName) {
        errors.couponName =translateMessage('Admin.Delivery.App.Coupon.couponCode.required');
        isValid = false;
    }
    if (!Coupondata.minimumOrderValue) {
        errors.minimumOrderValue = translateMessage('Admin.Delivery.App.Coupon.Minimum.Order.Amount.required');
        isValid = false;
    }
    if (!Coupondata.expirationDateTime) {
        errors.expirationDateTime = translateMessage('Admin.Delivery.App.Expiry.Date.required');
        isValid = false;
    }
    if (!Coupondata.couponDiscountPercent) {
        errors.couponDiscountPercent = translateMessage('Admin.Delivery.App.Coupan.value.required');
        isValid = false;
    }
    else if(Number(Coupondata.couponDiscountPercent)<1){
        errors.couponDiscountPercent = translateMessage('Admin.Delivery.App.Country.Valid.Percentage');
        isValid = false;
    }
    else if (!percentageRegex.test(Coupondata.couponDiscountPercent)) {
        errors.couponDiscountPercent = translateMessage('Admin.Delivery.App.Country.Valid.Percentage');
        isValid = false;
    }
    if (!Coupondata.maxDiscountAvailable) {
        errors.maximumOrderValue = translateMessage('Admin.Delivery.App.Coupon.Minimum.Discount.Amount.required');
        isValid = false;
    }
    if (!Coupondata.couponFrenchName) {
        errors.couponFrenchName = translateMessage('Admin.Delivery.App.French.Name.required');
        isValid = false;
    }


    return { isValid, errors };
};

export { ICouponTag, ICouponErrors, generateInitialCouponData, generateInitialErrorsData, validateCoupon }