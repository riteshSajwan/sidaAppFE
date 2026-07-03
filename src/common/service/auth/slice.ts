import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ILoginData {
  success: boolean;
  error: any;
  isLoggedIn:boolean;
  code:string;
  message:string;
}
const initialState: ILoginData = {
  success: false,
  error: null,
  isLoggedIn: false,
  code:'',
  message:''
};

export interface ILogoutRequest {
  refreshToken:string;
  deviceToken:string;
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.success = action.payload;
    },
  loginFailed(state, action: PayloadAction<any>) {
      state.error = action.payload;
    },
     registerSuccess(state, action: PayloadAction<any>) {
      state.success = action.payload;
    },
    registerFailed(state, action: PayloadAction<any>) {
        state.error = action.payload;
      },
    clearErrors(state) {
      state.error = null;
    },
    setLoginStatus(state,action) {
      state.isLoggedIn = action.payload;
    }
  },
});

export const loginReducer = loginSlice.reducer;
export const { loginSuccess, loginFailed, registerFailed , registerSuccess , clearErrors, setLoginStatus } = loginSlice.actions;
