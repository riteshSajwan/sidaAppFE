import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddUser from 'src/components/User/add/AddUser';

const EditUserPage = () => {
  return (
     <PermissionGuard menuName={MenuType.ROLE} requireEdit>
      <AddUser />
    </PermissionGuard>
  );
};

export default EditUserPage;
