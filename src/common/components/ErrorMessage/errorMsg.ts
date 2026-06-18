import { TLocaleId } from "src/i18n/localesTypes";

export enum ChangePasswordErrorMessages {
    SOMETHING_WRONG = '*Problem Occurred Try Again!',
    OLD_PASSWORD = '*Old Password is wrong!',

}

export enum LoginAuthMessages {
    AUTH_FAILED = 'auth.invalid.credentials',
    AUTH_INVALID = 'auth.invalid.credentialSuperAdmin',
    AUTH_BUSSIESS_INVALID = 'auth.wrong.password'
}

export const LoginErrorMessage: { [key in LoginAuthMessages]: TLocaleId } = {
    [LoginAuthMessages.AUTH_FAILED]: 'Admin.Delivery.App.Authentication.Failed',
    [LoginAuthMessages.AUTH_INVALID]:  'Admin.Delivery.App.Blocked.Many.Attempts',
    [LoginAuthMessages.AUTH_BUSSIESS_INVALID]:  'Admin.Delivery.App.Authentication.Failed',


}

export enum ChangePasswordError {
    SOMETHING_WRONG = 'Problem Occurred Try Again!',
    OLD_PASSWORD = 'Old password is wrong',
}
