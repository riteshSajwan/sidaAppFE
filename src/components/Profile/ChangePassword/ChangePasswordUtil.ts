export interface IPasswordError {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    apiError: string;
}

export interface IApiErrorResponse {
    errors: string[],
    code?: string;
    message?: string

}

export interface IImageApiErrorResponse {
    details: string[],
}