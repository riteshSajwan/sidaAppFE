import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import UserProfile from 'src/components/Profile/UserProfile/UserProfile';

export default function UserProfilePage() {
  return (
    <PermissionGuard menuName={MenuType.PROFILE} superAdminOnly productAdminOnly>
      <UserProfile />
    </PermissionGuard>
  );
}
