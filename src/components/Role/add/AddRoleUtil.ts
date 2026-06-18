interface IPermissionList {
  data: IPermission[];
}

enum permissionType {
  FULL = 'FULL',
  VIEW = 'VIEW',
}

interface IPermission {
  name: string;
  permission: string;
}

interface IMenu {
  id: number;
  code: string;
  displayName: string;
}

interface IMenuPermission {
  menuId: number;
  permission: permissionType;
}

interface IMenuPermissionResponse {
  id: number;
  roleId: number;
  menuId: number;
  permission: permissionType;
}

interface ICreateRoleRequest {
  roleId?: number;
  roleName: string;
  roleDescription: string;
  menuPermission: IMenuPermission[];
  customRole: boolean;
}

interface ICreateRoleResponse {
  id: number;
  name: string;
  description?: string;
  menuPermission: IMenuPermission[];
  createdAt: string;
  updatedAt: string;
}

interface IRoleDetailsResponse {
  roleName: string;
  roleDescription: string;
  menuPermission: IMenuPermissionResponse[];
}

export {
  ICreateRoleRequest,
  ICreateRoleResponse,
  IMenu,
  IMenuPermission,
  IMenuPermissionResponse,
  IPermission,
  IPermissionList,
  IRoleDetailsResponse,
  permissionType
};

