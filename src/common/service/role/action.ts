import { createRole, getAllAdminMenus, getRoleDetails, getRolesList, getRolesListPaginated, toggleRoleStatus } from 'src/common/service/role/api';
import {
  createRoleFailure,
  createRoleRequest,
  createRoleSuccess,
  fetchMenusFailure,
  fetchMenusRequest,
  fetchMenusSuccess,
  fetchRoleDetailsFailure,
  fetchRoleDetailsRequest,
  fetchRoleDetailsSuccess,
  fetchRoleDropdownFailure,
  fetchRoleDropdownRequest,
  fetchRoleDropdownSuccess,
  fetchRoleListFailure,
  fetchRoleListRequest,
  fetchRoleListSuccess,
  toggleRoleStatusFailure,
  toggleRoleStatusRequest,
  toggleRoleStatusSuccess,
} from 'src/common/service/role/slice';
import { IApiErrorDetailResponse } from 'src/common/utils/errors';
import { ICreateRoleRequest, ICreateRoleResponse, IMenu, IRoleDetailsResponse } from 'src/components/Role/add/AddRoleUtil';
import { IRole, IRoleListResponse } from 'src/components/Role/RoleListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

// Reactive action for fetching all admin menus
export const fetchAllAdminMenusAction = (): AppThunk => (dispatch) => {
  dispatch(fetchMenusRequest());

  return getAllAdminMenus()
    .then((response: IMenu[]) => {
      dispatch(fetchMenusSuccess(response));
    })
    .catch((error: IApiErrorDetailResponse) => {
      const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

      dispatch(fetchMenusFailure(errorMessage));
      throw error;
    });
};

// Reactive action for creating a role
export const createRoleAction =
  (data: ICreateRoleRequest): AppThunk =>
  (dispatch) => {
    dispatch(createRoleRequest());

    return createRole(data)
      .then((response: ICreateRoleResponse) => {
        dispatch(createRoleSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(createRoleFailure(errorMessage));
        throw error;
      });
  };

// Reactive action for fetching role details
export const fetchRoleDetailsAction =
  (roleId: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchRoleDetailsRequest());

    return getRoleDetails(roleId)
      .then((response: IRoleDetailsResponse) => {
        dispatch(fetchRoleDetailsSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(fetchRoleDetailsFailure(errorMessage));
        throw error;
      });
  };

export const fetchRolesListAction =
  (page: number, size: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchRoleListRequest());

    return getRolesListPaginated(page, size)
      .then((response: IRoleListResponse) => {
        dispatch(fetchRoleListSuccess(response));
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(fetchRoleListFailure(errorMessage));
        throw error;
      });
  };

export const fetchRolesDropdownAction = (): AppThunk => (dispatch) => {
  dispatch(fetchRoleDropdownRequest());

  return getRolesList()
    .then((response: IRole[]) => {
      dispatch(fetchRoleDropdownSuccess(response));
    })
    .catch((error: IApiErrorDetailResponse) => {
      const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

      dispatch(fetchRoleDropdownFailure(errorMessage));
      throw error;
    });
};

export const toggleRoleStatusAction =
  (roleId: number, activeStatus: boolean): AppThunk =>
  (dispatch) => {
    dispatch(toggleRoleStatusRequest());

    return toggleRoleStatus(roleId, activeStatus)
      .then(() => {
        dispatch(toggleRoleStatusSuccess());
      })
      .catch((error: IApiErrorDetailResponse) => {
        const errorMessage = error?.errors?.[0] || error?.message || translateMessage('Admin.Delivery.App.SomethingWentWrong');

        dispatch(toggleRoleStatusFailure(errorMessage));
        throw error;
      });
  };
