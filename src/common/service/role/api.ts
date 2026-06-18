import restService from 'src/common/service/restService/restService';
import { ICreateRoleRequest, ICreateRoleResponse, IMenu, IRoleDetailsResponse } from 'src/components/Role/add/AddRoleUtil';
import { IRole } from 'src/components/Role/RoleListUtil';
import { AUTH_BASE_URL } from 'src/constants/index';

export const getAllAdminMenus = async (): Promise<IMenu[]> => {
  return restService.generateHeaders().then((headers) =>
    restService.fetch(`${AUTH_BASE_URL}/api/auth/get-all-admin-menu`, {
      headers,
    }),
  );
};

export const getRoleDetails = async (roleId: string): Promise<IRoleDetailsResponse> => {
  return restService.generateHeaders().then((headers) =>
    restService.fetch(`${AUTH_BASE_URL}/api/auth/assign-menu-Permission-to-role/${roleId}`, {
      headers,
    }),
  );
};

export const createRole = async (data: ICreateRoleRequest): Promise<ICreateRoleResponse> => {
  return restService
    .generateHeaders({
      'Content-type': 'application/json; charset=UTF-8',
    })
    .then((headers) =>
      restService.fetch(`${AUTH_BASE_URL}/api/auth/assign-admin-menu-to-role`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }),
    );
};

export const getRolesList = async (): Promise<IRole[]> => {
  return restService.generateHeaders().then((headers) =>
    restService.fetch(`${AUTH_BASE_URL}/api/auth/roles/custom-roles`, {
      headers,
    }),
  );
};

export const getRolesListPaginated = async (page: number, size: number): Promise<{ data: IRole[]; total: number; page: number; size: number }> => {
  return restService.generateHeaders().then((headers) =>
    restService.fetch(`${AUTH_BASE_URL}/api/auth/roles/custom-roles/paginated?page=${page}&size=${size}`, {
      headers,
    }),
  );
};

export const toggleRoleStatus = async (roleId: number, activeStatus: boolean): Promise<{ message: string }> => {
  return restService
    .generateHeaders({
      'Content-type': 'application/json; charset=UTF-8',
    })
    .then((headers) =>
      restService.fetch(`${AUTH_BASE_URL}/api/auth/roles/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ id: roleId, activeStatus }),
      }),
    );
};
