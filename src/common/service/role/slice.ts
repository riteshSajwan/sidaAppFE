import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICreateRoleResponse, IMenu, IRoleDetailsResponse } from 'src/components/Role/add/AddRoleUtil';
import { IRole, IRoleListResponse } from 'src/components/Role/RoleListUtil';

export interface IMenusState {
  data: IMenu[];
  loading: boolean;
  error: string | null;
}

export interface IRoleDetailsState {
  data: IRoleDetailsResponse | null;
  loading: boolean;
  error: string | null;
}

export interface IRoleCreateState {
  data: ICreateRoleResponse | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface IRoleListState {
  data: IRoleListResponse | null;
  loading: boolean;
  error: string | null;
}

export interface IRoleDropdownState {
  data: IRole[];
  loading: boolean;
  error: string | null;
}

export interface IRoleToggleStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface IRoleState {
  menus: IMenusState;
  roleDetails: IRoleDetailsState;
  roleCreate: IRoleCreateState;
  roleList: IRoleListState;
  roleDropdown: IRoleDropdownState;
  roleToggleStatus: IRoleToggleStatusState;
}

const initialMenusState: IMenusState = {
  data: [],
  loading: false,
  error: null,
};

const initialRoleDetailsState: IRoleDetailsState = {
  data: null,
  loading: false,
  error: null,
};

const initialRoleCreateState: IRoleCreateState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

const initialRoleListState: IRoleListState = {
  data: null,
  loading: false,
  error: null,
};

const initialRoleDropdownState: IRoleDropdownState = {
  data: [],
  loading: false,
  error: null,
};

const initialRoleToggleStatusState: IRoleToggleStatusState = {
  loading: false,
  error: null,
  success: false,
};

const initialState: IRoleState = {
  menus: initialMenusState,
  roleDetails: initialRoleDetailsState,
  roleCreate: initialRoleCreateState,
  roleList: initialRoleListState,
  roleDropdown: initialRoleDropdownState,
  roleToggleStatus: initialRoleToggleStatusState,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    fetchMenusRequest(state) {
      state.menus.loading = true;
      state.menus.error = null;
    },
    fetchMenusSuccess(state, action: PayloadAction<IMenu[]>) {
      state.menus.loading = false;
      state.menus.data = action.payload;
      state.menus.error = null;
    },
    fetchMenusFailure(state, action: PayloadAction<string>) {
      state.menus.loading = false;
      state.menus.error = action.payload;
    },
    resetMenus(state) {
      state.menus = initialMenusState;
    },
    fetchRoleDetailsRequest(state) {
      state.roleDetails.loading = true;
      state.roleDetails.error = null;
    },
    fetchRoleDetailsSuccess(state, action: PayloadAction<IRoleDetailsResponse>) {
      state.roleDetails.loading = false;
      state.roleDetails.data = action.payload;
      state.roleDetails.error = null;
    },
    fetchRoleDetailsFailure(state, action: PayloadAction<string>) {
      state.roleDetails.loading = false;
      state.roleDetails.error = action.payload;
    },
    resetRoleDetails(state) {
      state.roleDetails = initialRoleDetailsState;
    },
    createRoleRequest(state) {
      state.roleCreate.loading = true;
      state.roleCreate.error = null;
      state.roleCreate.success = false;
    },
    createRoleSuccess(state, action: PayloadAction<ICreateRoleResponse>) {
      state.roleCreate.loading = false;
      state.roleCreate.data = action.payload;
      state.roleCreate.error = null;
      state.roleCreate.success = true;
    },
    createRoleFailure(state, action: PayloadAction<string>) {
      state.roleCreate.loading = false;
      state.roleCreate.error = action.payload;
      state.roleCreate.success = false;
    },
    resetRoleCreate(state) {
      state.roleCreate = initialRoleCreateState;
    },
    resetRoleSuccess(state) {
      state.roleCreate.success = false;
    },
    fetchRoleListRequest(state) {
      state.roleList.loading = true;
      state.roleList.error = null;
    },
    fetchRoleListSuccess(state, action: PayloadAction<IRoleListResponse>) {
      state.roleList.loading = false;
      state.roleList.data = action.payload;
      state.roleList.error = null;
    },
    fetchRoleListFailure(state, action: PayloadAction<string>) {
      state.roleList.loading = false;
      state.roleList.error = action.payload;
    },
    resetRoleList(state) {
      state.roleList = initialRoleListState;
    },
    fetchRoleDropdownRequest(state) {
      state.roleDropdown.loading = true;
      state.roleDropdown.error = null;
    },
    fetchRoleDropdownSuccess(state, action: PayloadAction<IRole[]>) {
      state.roleDropdown.loading = false;
      state.roleDropdown.data = action.payload;
      state.roleDropdown.error = null;
    },
    fetchRoleDropdownFailure(state, action: PayloadAction<string>) {
      state.roleDropdown.loading = false;
      state.roleDropdown.error = action.payload;
    },
    resetRoleDropdown(state) {
      state.roleDropdown = initialRoleDropdownState;
    },
    toggleRoleStatusRequest(state) {
      state.roleToggleStatus.loading = true;
      state.roleToggleStatus.error = null;
      state.roleToggleStatus.success = false;
    },
    toggleRoleStatusSuccess(state) {
      state.roleToggleStatus.loading = false;
      state.roleToggleStatus.error = null;
      state.roleToggleStatus.success = true;
    },
    toggleRoleStatusFailure(state, action: PayloadAction<string>) {
      state.roleToggleStatus.loading = false;
      state.roleToggleStatus.error = action.payload;
      state.roleToggleStatus.success = false;
    },
    resetRoleToggleStatus(state) {
      state.roleToggleStatus = initialRoleToggleStatusState;
    },
  },
});

export const RoleReducer = roleSlice.reducer;
export const {
  fetchMenusRequest,
  fetchMenusSuccess,
  fetchMenusFailure,
  resetMenus,
  fetchRoleDetailsRequest,
  fetchRoleDetailsSuccess,
  fetchRoleDetailsFailure,
  resetRoleDetails,
  createRoleRequest,
  createRoleSuccess,
  createRoleFailure,
  resetRoleCreate,
  resetRoleSuccess,
  fetchRoleListRequest,
  fetchRoleListSuccess,
  fetchRoleListFailure,
  resetRoleList,
  fetchRoleDropdownRequest,
  fetchRoleDropdownSuccess,
  fetchRoleDropdownFailure,
  resetRoleDropdown,
  toggleRoleStatusRequest,
  toggleRoleStatusSuccess,
  toggleRoleStatusFailure,
  resetRoleToggleStatus,
} = roleSlice.actions;
