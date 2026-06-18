import { useTranslation } from "react-i18next";
import { translateMessage } from "src/i18n/createTranslation";
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// VALIDATION BLOCK FOR LOGIN FORM---------------------------------
export const LoginFormValidation = (value: any) => {
    let errors: any = {};

    if (!value.username) {
        errors['username'] = translateMessage( 'Admin.Delivery.App.Email.Required')
    }
    if (!value.password) {
        errors['password'] = translateMessage( 'Admin.Delivery.App.Password.Required')
    }

    return errors;
}

//VALIDATION BLOCK FOR FORGOT_PASSWORD FORM-------------------------
export const validateEmail = (value: any) => {

    let errors: any = {}
    if (!emailRegex.test(value.username)) {
        errors['email'] = translateMessage( 'Admin.Delivery.App.Invalids.Email')
    }
    if (!value.username) {
        errors['email'] = translateMessage( 'Admin.Delivery.App.Email.Required')
    }


    return errors;
};

//VALIDATION BLOCK FOR FORGOT_PASSWORD FORM-------------------------
export const validateUserName = (value: any) => {

    let errors: any = {}
    if (!value.username) {
        errors['username'] =translateMessage( 'Admin.Delivery.App.Email.Required')
    }

    return errors;
};



