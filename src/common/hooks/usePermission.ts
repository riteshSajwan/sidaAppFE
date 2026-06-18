import { useSelector } from 'react-redux';
import { getMenuPermission, hasEditPermission, hasMenuAccess, hasViewOnlyPermission, PermissionType, ROLES } from 'src/common/utils/permissionUtils';
import { RootState } from 'src/store';

/**
 * Custom hook to check user permissions
 * @param menuName - Name of the menu to check permissions for (e.g., 'DRIVER', 'CUSTOMER')
 * @returns Object with permission checking functions
 */
export const usePermission = (menuName: string) => {
  const userProfile = useSelector((state: RootState) => state.profile.data);
  return {
    // Check if user has any access to the menu
    hasAccess: hasMenuAccess(userProfile, menuName),

    // Check if user has edit/full permission
    canEdit: hasEditPermission(userProfile, menuName),

    // Check if user has view-only permission
    isViewOnly: hasViewOnlyPermission(userProfile, menuName),

    // Get the permission type
    permission: getMenuPermission(userProfile, menuName),

    // Check if user is super admin
    isSuperAdmin: userProfile?.role?.name === ROLES.SUPERADMIN || userProfile?.superAdmin || false,

    // Check if user is product admin
    isProductAdmin: userProfile?.role?.name === ROLES.BUSINESS_ADMIN || false,
  };
};

/**
 * Hook to check multiple menu permissions at once
 * @param menuNames - Array of menu names to check
 * @returns Object with permission checking functions for each menu
 */
export const useMultiplePermissions = (menuNames: string[]) => {
  const userProfile = useSelector((state: RootState) => state.profile.data);

  const permissions: Record<
    string,
    {
      hasAccess: boolean;
      canEdit: boolean;
      isViewOnly: boolean;
      permission: PermissionType | null;
    }
  > = {};

  menuNames.forEach((menuName) => {
    permissions[menuName] = {
      hasAccess: hasMenuAccess(userProfile, menuName),
      canEdit: hasEditPermission(userProfile, menuName),
      isViewOnly: hasViewOnlyPermission(userProfile, menuName),
      permission: getMenuPermission(userProfile, menuName),
    };
  });

  return {
    permissions,
    isSuperAdmin: userProfile?.isSuperAdmin || userProfile?.superAdmin || false,
    isProductAdmin: userProfile?.isProductAdmin || false,
  };
};
