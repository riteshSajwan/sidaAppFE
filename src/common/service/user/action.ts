import { createUser, getUserDetails, getUsersList } from 'src/common/service/user/api';
import {
  createUserFailure,
  createUserRequest,
  createUserSuccess,
  fetchUserDetailsFailure,
  fetchUserDetailsRequest,
  fetchUserDetailsSuccess,
  fetchUserListFailure,
  fetchUserListRequest,
  fetchUserListSuccess,
} from 'src/common/service/user/slice';
import { IApiErrorDetailResponse } from 'src/common/utils/errors';
import { ICreateUserRequest, ICreateUserResponse, IUserDetailsResponse } from 'src/components/User/add/AddUserUtil';
import { IUserListResponse } from 'src/components/User/UserListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const createUserAction =
  (data: ICreateUserRequest): AppThunk =>
  (dispatch) => {
    dispatch(createUserRequest());

    return createUser(data)
      .then((response: ICreateUserResponse) => {
        dispatch(createUserSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(createUserFailure(errorMessage));
        throw error;
      });
  };

export const fetchUserDetailsAction =
  (userId: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchUserDetailsRequest());

    return getUserDetails(userId)
      .then((response: IUserDetailsResponse) => {
        dispatch(fetchUserDetailsSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(fetchUserDetailsFailure(errorMessage));
        throw error;
      });
  };

export const fetchUsersListAction =
  (page: number = 0, size: number = 10, roleId?: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchUserListRequest());

    return getUsersList(page, size, roleId)
      .then((response: IUserListResponse) => {
        dispatch(fetchUserListSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(fetchUserListFailure(errorMessage));
        throw error;
      });
  };
