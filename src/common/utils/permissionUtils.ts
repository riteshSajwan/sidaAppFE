import { UserProfilesDetailsDto } from 'src/common/model/auth/login';

export enum PermissionType {
  VIEW = 'VIEW',
  FULL = 'FULL',
}

export enum MenuType {
  DRIVER = 'DRIVER',
  BOOKING = 'BOOKING',
  CUSTOMER = 'CUSTOMER',
  ROLE = 'ROLE',
  REQUEST = 'REQUEST',
  CHAT = 'CHAT',
  DASHBOARD = 'DASHBOARD',
  SERVICEABLE_AREA = 'SERVICEABLE_AREA',
  TICKET = 'TICKET',
  REPORT = 'REPORT',
  CAB = 'CAB',
  COUPON = 'COUPON',
  PROFILE = 'PROFILE',
  BUSINESS = 'BUSINESS',
  INVOICING = 'INVOICING',
  NEWBOOKING = 'NEWBOOKING',
}

export enum ROLES {
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  PRIVATE_ARCHITECT = 'PRIVATE_ARCHITECT',
  SUPERADMIN = 'SUPERADMIN',
}

export interface IMenuPermission {
  permission: string;
  menuName: string;
}

/**
 * Check if user has access to a specific menu
 * @param userProfile - User profile data from Redux
 * @param menuName - Name of the menu to check (e.g., 'DRIVER', 'CUSTOMER', 'BOOKING')
 * @returns boolean - true if user has access, false otherwise
 */
export const hasMenuAccess = (userProfile: UserProfilesDetailsDto | null, menuName: string): boolean => {
  if (!userProfile) return false;

  // Super admin and product admin have access to everything
  if (userProfile.isSuperAdmin || userProfile.superAdmin || userProfile?.role?.name === ROLES.SUPERADMIN || userProfile?.role?.name === ROLES.BUSINESS_ADMIN) return true;

  // Check if menu exists in user's permissions
  const menuPermission = userProfile.permissionList?.find((menu) => menu.menuName.toUpperCase() === menuName.toUpperCase());

  return !!menuPermission;
};

/**
 * Check if user has edit/full permission for a specific menu
 * @param userProfile - User profile data from Redux
 * @param menuName - Name of the menu to check
 * @returns boolean - true if user has FULL permission, false if VIEW only or no access
 */
export const hasEditPermission = (userProfile: UserProfilesDetailsDto | null, menuName: string): boolean => {
  if (!userProfile) return false;

  // Super admin has full access to everything
  if (userProfile.isSuperAdmin || userProfile.superAdmin || userProfile?.role?.name === ROLES.SUPERADMIN) return true;

  // Product admin has view-only access (no edit permission)
  if (userProfile?.role?.name === ROLES.BUSINESS_ADMIN) return false;

  // Check if menu exists and has FULL permission
  const menuPermission = userProfile.permissionList?.find((menu) => menu.menuName.toUpperCase() === menuName.toUpperCase());

  return menuPermission?.permission === PermissionType.FULL;
};

/**
 * Check if user has view-only permission for a specific menu
 * @param userProfile - User profile data from Redux
 * @param menuName - Name of the menu to check
 * @returns boolean - true if user has VIEW permission only
 */
export const hasViewOnlyPermission = (userProfile: UserProfilesDetailsDto | null, menuName: string): boolean => {
  if (!userProfile) return false;

  // Super admin has full access, not view-only
  if (userProfile.isSuperAdmin || userProfile.superAdmin || userProfile?.role?.name === ROLES.SUPERADMIN) return false;

  // Product admin has view-only access to all menus
  if (userProfile?.role?.name === ROLES.BUSINESS_ADMIN) return true;

  // Check if menu exists and has VIEW permission
  const menuPermission = userProfile.permissionList?.find((menu) => menu.menuName.toUpperCase() === menuName.toUpperCase());

  return menuPermission?.permission === PermissionType.VIEW;
};

/**
 * Get permission type for a specific menu
 * @param userProfile - User profile data from Redux
 * @param menuName - Name of the menu to check
 * @returns PermissionType | null - Permission type or null if no access
 */
export const getMenuPermission = (userProfile: UserProfilesDetailsDto | null, menuName: string): PermissionType | null => {
  if (!userProfile) return null;

  // Super admin has full access
  if (userProfile.isSuperAdmin || userProfile.superAdmin || userProfile?.role?.name === ROLES.SUPERADMIN) return PermissionType.FULL;

  // Product admin has view-only access to all menus
  if (userProfile?.role?.name === ROLES.BUSINESS_ADMIN) return PermissionType.VIEW;

  // Check menu permission
  const menuPermission = userProfile.permissionList?.find((menu) => menu.menuName.toUpperCase() === menuName.toUpperCase());

  if (!menuPermission) return null;

  return menuPermission.permission === PermissionType.FULL ? PermissionType.FULL : PermissionType.VIEW;
};
