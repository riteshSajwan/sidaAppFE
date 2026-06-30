import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import UploadPage from 'src/components/Upload/UploadPage';
import UserList from 'src/components/User/UserList';

const UserListPage = () => {
  return (
    // <PermissionGuard menuName={MenuType.ROLE}>
      <UploadPage />
    // </PermissionGuard>
  );
};

export default UserListPage;
