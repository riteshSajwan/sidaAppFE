import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import RoleList from 'src/components/Role/RoleList';

const RoleListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.ROLE}>
      <RoleList />
    </PermissionGuard>
  );
};

export default RoleListPage;
