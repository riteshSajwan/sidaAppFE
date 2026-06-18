import { ChangePasswordError } from 'src/common/components/ErrorMessage/errorMsg';
import { UserProfilesDetailsDto } from 'src/common/model/auth/login';
import { NewPassword } from 'src/common/model/changePassword/changePassword';
import { setLoginStatus } from 'src/common/service/auth/slice';
import { ChangePasswordApi } from 'src/common/service/changePassword/api';
import { getProfile, uploadProfileImg } from 'src/common/service/profile/api';
import { changePasswordFailure, changePasswordRequest, changePasswordSuccess, profileData } from 'src/common/service/profile/slice';
import { IApiErrorResponse } from 'src/components/Profile/ChangePassword/ChangePasswordUtil';
import { AppThunk } from 'src/store/index';

export const getProfileDetail = (token: string): AppThunk => (dispatch) =>
    getProfile(token)
        .then(async (profile) => {
            dispatch(profileData(profile));
            await dispatch(setLoginStatus(true));

        })
        .catch(() => { });

export const updateProfileImage = (data: FormData, userDetails:UserProfilesDetailsDto): AppThunk => (dispatch) =>
    uploadProfileImg(data)
                .then((profile) => {
                  const updatedProfile=  {
                        ...userDetails,
                        profileUrl:profile.fileUrl,
                      }

                    dispatch(profileData(updatedProfile))
                })
                .catch(() => { });

 export const changePasswordAction =
  (data:NewPassword): AppThunk<Promise<NewPassword | undefined>> =>
  (dispatch) => {
    dispatch(changePasswordRequest());

    return ChangePasswordApi(data)
      .then(() => {
        dispatch(changePasswordSuccess(true));
        return data;
      })
      .catch((error) => {
           const typedError = error as IApiErrorResponse;
           const apiError = typedError?.errors?.[0] ?? ChangePasswordError.SOMETHING_WRONG;
        dispatch(
          changePasswordFailure(apiError)
        );
        return undefined;
      });
  };



