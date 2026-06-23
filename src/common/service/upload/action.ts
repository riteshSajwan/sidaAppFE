import { createUser, getUserDetails, getUsersList } from 'src/common/service/user/api';

import { IApiErrorDetailResponse } from 'src/common/utils/errors';
import { uploadFormRequest, uploadFormResponse } from 'src/components/Upload/Upload/UploadContainerUtils';
import { ICreateUserRequest, ICreateUserResponse, IUserDetailsResponse } from 'src/components/User/add/AddUserUtil';
import { IUserListResponse } from 'src/components/User/UserListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';
import { fetchMapWithDetails, fetchMapWithDetailsFailure, fetchMapWithDetailsSuccess } from './slice';
import { uploadMapWithDetails } from './api';

export const uploadMapWithDetailsAction =
  (data: uploadFormRequest): AppThunk =>
  (dispatch) => {
    dispatch(fetchMapWithDetails());

    return uploadMapWithDetails(data)
      .then((response: uploadFormResponse) => {
        dispatch(fetchMapWithDetailsSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(fetchMapWithDetailsFailure(errorMessage));
        throw error;
      });
  };



