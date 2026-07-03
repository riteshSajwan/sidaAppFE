import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ILoginData {
  success: boolean;
  error: any;
  isLoggedIn: boolean;
  code: string;
  message: string;
}
const initialState: ILoginData = {
  success: false,
  error: null,
  isLoggedIn: false,
  code: '',
  message: ''
};
export interface authState {
  login: ILoginData,
  register: any
}
export const authInitailState: authState = {
  login: initialState,
  register: {
    loading: false,
    error: null,
    data: {  },
  },
}
export interface ILogoutRequest {
  refreshToken: string;
  deviceToken: string;
}

const authSlice = createSlice({
  name: 'auth',
   initialState: authInitailState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.login.success = action.payload;
    },
    loginFailed(state, action: PayloadAction<any>) {
      state.login.error = action.payload;
    },
    registerSuccess(state, action: PayloadAction<any>) {
      state.register.success = action.payload;
    },
    registerFailed(state, action: PayloadAction<any>) {
      state.register.error = action.payload;
    },
    clearErrors(state) {
      state.login.error = null;
    },
    setLoginStatus(state, action) {
      state.login.isLoggedIn = action.payload;
    }
  },
});

export const authReducer = authSlice.reducer;
export const { loginSuccess, loginFailed, registerFailed, registerSuccess, clearErrors, setLoginStatus } = authSlice.actions;
