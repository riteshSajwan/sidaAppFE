import restService from 'src/common/service/restService/restService';
import { ICreateUserRequest, ICreateUserResponse, IUserDetailsResponse } from 'src/components/User/add/AddUserUtil';
import { IUserListResponse } from 'src/components/User/UserListUtil';
import { AUTH_BASE_URL } from 'src/constants/index';

export const getUserDetails = async (userId: string): Promise<IUserDetailsResponse> => {
  return restService.generateHeaders().then((headers) =>
    restService.fetch(`${AUTH_BASE_URL}/api/auth/admin/users/${userId}`, {
      headers,
    }),
  );
};

export const createUser = (data: ICreateUserRequest): Promise<ICreateUserResponse> => {
  return restService
    .generateHeaders({
      'Content-type': 'application/json; charset=UTF-8',
    })
    .then((headers) =>
      restService.fetch(`${AUTH_BASE_URL}/api/auth/create-user-with-role`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }),
    );
};

export const getUsersList = (page: number, size: number, roleId?: number): Promise<IUserListResponse> => {
  return restService.generateHeaders().then((headers) => {
    const queryParams = [`page=${page}`, `size=${size}`, roleId ? `roleId=${roleId}` : ''].filter(Boolean).join('&');

    return restService.fetch(`${AUTH_BASE_URL}/api/auth/users-with-custom-role?${queryParams}`, {
      headers,
    });
  });
};
