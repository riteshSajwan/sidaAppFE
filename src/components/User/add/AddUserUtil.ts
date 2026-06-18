export interface ICreateUserRequest {
  id?: number;
  username: string;
  password?: string;
  roleId: number;
  email: string;
}

export interface ICreateUserResponse {
  id: number;
  username: string;
  roleId: number;
  message?: string;
}

export interface IUserDetailsResponse {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  email: string;
}

export interface IAddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedRole: number | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export interface IAddUserFormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  apiError: string;
}

function generateInitialAddUserFormData(): IAddUserFormData {
  return {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedRole: null,
    showPassword: false,
    showConfirmPassword: false,
  };
}

function generateInitialAddUserFormErrors(): IAddUserFormErrors {
  return {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    apiError: '',
  };
}

export {
    generateInitialAddUserFormData,
    generateInitialAddUserFormErrors
};

