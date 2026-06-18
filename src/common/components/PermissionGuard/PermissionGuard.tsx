import { Href, router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { usePermissionGuardStyle } from 'src/common/components/PermissionGuard/PermissionGuardStyle';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';

interface IPermissionGuardProps {
  menuName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: Href;
  requireEdit?: boolean;
  superAdminOnly?: boolean;
  productAdminOnly?: boolean;
}

/**
 * Permission Guard Component
 * Protects routes based on user's menu permissions
 *
 * @param menuName - The menu name to check permission for (e.g., 'DRIVER', 'CUSTOMER')
 * @param children - Content to render if user has access
 * @param fallback - Optional custom fallback component when access is denied
 * @param redirectTo - Optional route to redirect to when access is denied
 * @param requireEdit - If true, requires FULL permission; if false/undefined, allows VIEW or FULL
 * @param superAdminOnly - If true, only super admins can access (ignores menuName)
 */
const PermissionGuard: React.FC<IPermissionGuardProps> = ({
  menuName,
  children,
  fallback,
  redirectTo,
  requireEdit = false,
  superAdminOnly = false,
  productAdminOnly = false,
}) => {
  const { hasAccess, canEdit, isSuperAdmin, isProductAdmin } = usePermission(menuName);
  const { theme } = useAppTheme();
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const styles = usePermissionGuardStyle();

  // Handle super admin only pages
  if (superAdminOnly && !productAdminOnly) {
    if (isSuperAdmin) {
      return <>{children}</>;
    }
    // Non-super admins cannot access
    if (redirectTo) {
      router.replace(redirectTo);
      return null;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    return renderAccessDenied();
  }

  // Handle product admin only pages
  if (productAdminOnly && !superAdminOnly) {
    if (isProductAdmin) {
      return <>{children}</>;
    }
    // Non-product admins cannot access
    if (redirectTo) {
      router.replace(redirectTo);
      return null;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    return renderAccessDenied();
  }

   if (productAdminOnly && superAdminOnly) {
    if (isProductAdmin ||  isSuperAdmin) {
      return <>{children}</>;
    }
    // Non-product admins cannot access
    if (redirectTo) {
      router.replace(redirectTo);
      return null;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    return renderAccessDenied();
  }
    // Super admins have full access to all non-superAdminOnly pages
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Determine if user has required permission level
  // Product admins automatically get view-only access (handled in permissionUtils)
  const hasRequiredPermission = requireEdit ? canEdit : hasAccess;

  // If user has required permission, render children
  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  // If redirect is specified, redirect to that route
  if (redirectTo) {
    router.replace(redirectTo);
    return null;
  }

  // If custom fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback - Access Denied
  return renderAccessDenied();

  function renderAccessDenied() {
    return (
      <View style={[layout.container, styles.container]}>
        <View style={styles.contentWrapper}>
          <Typography variant='heading' color={theme.colors.textErrorDark} spacing={{bottom:theme.spacing.md}} style={styles.errorCode}>403</Typography>
          <Typography variant='subHeading' spacing={{bottom:theme.spacing.sm}} align='center'>
            {TranslateMessage('Admin.Delivery.App.Access.Denied')}
          </Typography>
          <Typography variant='body' align='center'>
            {TranslateMessage('Admin.Delivery.App.No.Permission.Message')}
          </Typography>
        </View>
      </View>
    );
  }
};

export default PermissionGuard;
