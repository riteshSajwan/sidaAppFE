import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserProfilesDetailsDto } from 'src/common/model/auth/login';

interface IProfile {
  profileDialog: boolean;
  data: UserProfilesDetailsDto | null;
  notificationCount: number;
  changePassword: {
    isPasswordChanged: boolean;
    loading: boolean;
    error: string | null;
  };
}

const initialState: IProfile = {
  profileDialog: false,
  notificationCount: 0,
  data: null,
  changePassword: {
    isPasswordChanged: false,
    loading: false,
    error: null,
  },
};

const userProfileSlice = createSlice({
  name: 'UserProfile',
  initialState,
  reducers: {
    profileDiaglogOpen(state) {
      state.profileDialog = true;
    },
    profileDiaglogClose(state) {
      state.profileDialog = false;
    },
    profileData(state, action: PayloadAction<any>) {
      state.data = action.payload;
      // state.data = {
      //   ...action.payload,
      //   permissionList:
      //     action.payload.permissionList && action.payload.permissionList.length > 0
      //       ? action.payload.permissionList
      //       : [
      //           {
      //             menuName: MenuType.DRIVER,
      //             permission: 'FULL',
      //           },
      //           {
      //             menuName: MenuType.BOOKING,
      //             permission: 'FULL',
      //           },
      //           {
      //             menuName: MenuType.CUSTOMER,
      //             permission: 'FULL',
      //           },
      //           // {
      //           //   menuName: MenuType.REQUEST,
      //           //   permission: 'FULL',
      //           // },
      //           {
      //             menuName: MenuType.CHAT,
      //             permission: 'FULL',
      //           },
      //           {
      //             menuName: MenuType.DASHBOARD,
      //             permission: 'FULL',
      //           },
      //           {
      //             menuName: MenuType.ROLE,
      //             permission: 'FULL',
      //           },
      //           {
      //             menuName: MenuType.SERVICEABLE_AREA,
      //             permission: 'FULL',
      //           },
      //         ],
      // };
    },
    clearProfileData(state) {
      state.data = null;
    },
    setNotificationCount(state, action: PayloadAction<number>) {
      state.notificationCount = action.payload;
    },
    decrementNotificationCount(state, action: PayloadAction<number>) {
      state.notificationCount = Math.max(state.notificationCount - action.payload, 0);
    },
    changePasswordRequest(state) {
      state.changePassword.loading = true;
      state.changePassword.error = null;
    },
    changePasswordSuccess(state, action: PayloadAction<boolean>) {
      state.changePassword.loading = false;
      state.changePassword.isPasswordChanged = action.payload;
    },
    changePasswordFailure(state, action: PayloadAction<string>) {
      state.changePassword.loading = false;
      state.changePassword.error = action.payload;
    },
    resetChangePassword(state) {
      state.changePassword = initialState.changePassword;
    },
  },
});

export const ProfileReducer = userProfileSlice.reducer;
export const {
  profileDiaglogOpen,
  profileDiaglogClose,
  profileData,
  clearProfileData,
  setNotificationCount,
  decrementNotificationCount,
  changePasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  resetChangePassword,
} = userProfileSlice.actions;
