import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterArchitectRequestDto, RegisterArchitectResponseDto, SignInRequestDto, SignInResponseDto } from 'src/common/model/auth/login';
import { assignArchitect, fetchLogin, handleUserLogout, ISilentResponse, silentSignIn } from 'src/common/service/auth/apiCall';
import { clearErrors, ILogoutRequest, loginFailed, loginSuccess, registerFailed, setLoginStatus } from 'src/common/service/auth/slice';
import { profileData } from 'src/common/service/profile/slice';
import { setUserCredentials } from 'src/common/utils/credentialsUtil';
import { setUserRole } from 'src/common/utils/roleStorageUtils';
import { setUserRefreshToken } from 'src/common/utils/setRefreshTokenUtil';
import { getTenantId } from 'src/common/utils/tenantUtils';
import { setUserToken } from 'src/common/utils/tokenUtils';
import { IApiErrorResponse } from 'src/components/Profile/ChangePassword/ChangePasswordUtil';
import { AppThunk } from 'src/store/index';

export const loginRequest =
  (data: SignInRequestDto, tenantId?: string | null): AppThunk =>
    async (dispatch) => {
      try {
        const apiResponse = fetchLogin(data, tenantId);

        apiResponse
          .then((res: SignInResponseDto) => {
            dispatch(profileData(res.userDetails));
            dispatch(
              saveToken({
                token: res.token,
                refreshToken: res.refreshToken,
              } as ISilentResponse),
            );
            setUserCredentials(JSON.stringify(res.supperAdminProperties));

            // Store role from response
            if (res.userDetails?.role?.name) {
              setUserRole(res.userDetails.role.name).catch(() => {
                console.error('Failed to store user role');
              });
            }

            dispatch(setLoginStatus(true));
          })
          .catch((error) => {
            const typedError = error as IApiErrorResponse;
            dispatch(loginFailed(typedError));
          });
      } catch (error) {
        const typedError = error as IApiErrorResponse;
        dispatch(loginFailed(typedError));
      }
    };

const saveToken =
  ({ token, refreshToken }: ISilentResponse): AppThunk =>
    async (dispatch) => {
      setUserToken(token);
      setUserRefreshToken(refreshToken);
      dispatch(loginSuccess(true));
    };

export const clearLoginErrors = (): AppThunk => async (dispatch) => {
  try {
    dispatch(clearErrors());
  } catch (error) { }
};

export const refreshUserToken =
  (data: ILogoutRequest): AppThunk<Promise<ISilentResponse>> =>
    (dispatch) => {
      return silentSignIn(data)
        .then((response: ISilentResponse) => {
          if (response.token && response.userDetails) {
            dispatch(profileData(response.userDetails));
            dispatch(saveData(response));

            // Store role from response
            if (response.userDetails?.role?.name) {
              setUserRole(response.userDetails.role.name).catch(() => { });
            }
          }
          return response;
        })
        .catch((error) => {
          if (typeof error === 'object' && error !== null && 'status' in error && error.status === 400) {
            dispatch(logout());
          }
          throw error;
        });
    };

const saveData =
  ({ token, refreshToken }: ISilentResponse): AppThunk =>
    async () => {
      setUserToken(token);
      setUserRefreshToken(refreshToken);
    };

export const logout =
  (data?: ILogoutRequest): AppThunk =>
    (dispatch) => {
      const doReset = () => {
        dispatch(setLoginStatus(false));
        dispatch({ type: 'RESET' });
        AsyncStorage.clear();
      };

      if (!data) {
        doReset();
        return;
      }

      // Read tenantId BEFORE clearing AsyncStorage, pass it to handleUserLogout
      // Wait for logout API to finish before clearing storage
      getTenantId()
        .then((tenantId) => handleUserLogout({ ...data, tenantId }))
        .catch(() => { })
        .then(() => doReset());
    };


export const signUpRequest =
  (data: RegisterArchitectRequestDto): AppThunk =>
    async (dispatch) => {
      try {
        const apiResponse = assignArchitect(data);

        apiResponse
          .then((res: RegisterArchitectResponseDto) => {


            // setUserCredentials(JSON.stringify(res.supperAdminProperties));




          })
          .catch((error) => {
            const typedError = error as IApiErrorResponse;
            dispatch(registerFailed(typedError));
          });
      } catch (error) {
        const typedError = error as IApiErrorResponse;
        dispatch(registerFailed(typedError));
      }
    };