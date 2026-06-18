import { NewPassword } from 'src/common/model/changePassword/changePassword';

export const isPassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    return passwordPattern.test(password)
}
export const validateForm = (password:NewPassword) => {
    let errors = { oldPassword: '', newPassword: '', confirmNewPassword: '',apiError: ''}
    let isErrorPresent = false;
    if (password.oldPassword === '') {
        errors.oldPassword = '*Current Password Required!';
        isErrorPresent = true
    }
    if (password.newPassword !== password.confirmNewPassword) {
        errors.confirmNewPassword = '*New Password and Confirm Password does not match!'
        isErrorPresent = true
    }
    if (password.newPassword === '') {
        errors.newPassword = '*New Password Required!'
        isErrorPresent = true
    }else if(password.newPassword === password.oldPassword){
        errors.newPassword = '*New Password should be different from old password!'
        isErrorPresent = true
    }else if (!isPassword(password.newPassword)) {
        errors.newPassword = '*New password must have an uppercase, lowercase, digit, and special character!';
        isErrorPresent = true;
    } else if (password.newPassword.length < 6) {
        errors.newPassword = '*New password must be at least 6 characters long!';
        isErrorPresent = true;
    }
    if (password.confirmNewPassword === '') {
        errors.confirmNewPassword = '*Confirm Password Required!'
        isErrorPresent = true
    }
    return {
        isErrorPresent: isErrorPresent,
        errors: errors
    }
}

