import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddRole from 'src/components/Role/add/AddRole';

const AddRolePage = () => {
  return (
    <PermissionGuard menuName={MenuType.ROLE} requireEdit>
      <AddRole />
    </PermissionGuard>
  );
};

export default AddRolePage;
