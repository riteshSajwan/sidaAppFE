import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICreateUserResponse, IUserDetailsResponse } from 'src/components/User/add/AddUserUtil';
import { IUserListResponse } from 'src/components/User/UserListUtil';

export interface IUserDetailsState {
  data: IUserDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

export interface IUserCreateState {
  data: ICreateUserResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface IUserListState {
  data: IUserListResponse | null;
  loading: boolean;
  error: string | null;
}

export interface IUserState {
  userDetails: IUserDetailsState;
  userCreate: IUserCreateState;
  userList: IUserListState;
}

const initialUserDetailsState: IUserDetailsState = {
  data: null,
  loading: false,
  error: null,
};

const initialUserCreateState: IUserCreateState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const initialUserListState: IUserListState = {
  data: null,
  loading: false,
  error: null,
};

const initialState: IUserState = {
  userDetails: initialUserDetailsState,
  userCreate: initialUserCreateState,
  userList: initialUserListState,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserDetailsRequest(state) {
      state.userDetails.loading = true;
      state.userDetails.error = null;
    },
    fetchUserDetailsSuccess(state, action: PayloadAction<IUserDetailsResponse>) {
      state.userDetails.loading = false;
      state.userDetails.data = action.payload;
      state.userDetails.error = null;
    },
    fetchUserDetailsFailure(state, action: PayloadAction<string>) {
      state.userDetails.loading = false;
      state.userDetails.error = action.payload;
    },
    resetUserDetails(state) {
      state.userDetails = initialUserDetailsState;
    },
    // Create User Actions
    createUserRequest(state) {
      state.userCreate.loading = true;
      state.userCreate.error = null;
      state.userCreate.success = false;
    },
    createUserSuccess(state, action: PayloadAction<ICreateUserResponse>) {
      state.userCreate.loading = false;
      state.userCreate.data = action.payload;
      state.userCreate.error = null;
      state.userCreate.success = true;
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.userCreate.loading = false;
      state.userCreate.error = action.payload;
      state.userCreate.success = false;
    },
    resetUserCreate(state) {
      state.userCreate = initialUserCreateState;
    },
    resetUserSuccess(state) {
      state.userCreate.success = false;
    },
    fetchUserListRequest(state) {
      state.userList.loading = true;
      state.userList.error = null;
    },
    fetchUserListSuccess(state, action: PayloadAction<IUserListResponse>) {
      state.userList.loading = false;
      state.userList.data = action.payload;
      state.userList.error = null;
    },
    fetchUserListFailure(state, action: PayloadAction<string>) {
      state.userList.loading = false;
      state.userList.error = action.payload;
    },
    resetUserList(state) {
      state.userList = initialUserListState;
    },
  },
});

export const UserReducer = userSlice.reducer;
export const {
  fetchUserDetailsRequest,
  fetchUserDetailsSuccess,
  fetchUserDetailsFailure,
  resetUserDetails,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  resetUserCreate,
  resetUserSuccess,
  fetchUserListRequest,
  fetchUserListSuccess,
  fetchUserListFailure,
  resetUserList,
} = userSlice.actions;
