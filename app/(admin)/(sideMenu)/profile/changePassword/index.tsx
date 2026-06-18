import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import ChangePassword from 'src/components/Profile/ChangePassword/ChangePassword';

const ChangePasswordPage = () => {
  return (
    <PermissionGuard menuName={MenuType.PROFILE} superAdminOnly productAdminOnly>
      <ChangePassword />
    </PermissionGuard>
  );
};

export default ChangePasswordPage;
