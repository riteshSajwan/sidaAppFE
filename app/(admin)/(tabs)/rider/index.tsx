import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import DriverList from 'src/components/DriverDetailPage/DriverList';

const DriverDetailPage = () => {
  return (
    <PermissionGuard menuName={MenuType.DRIVER}>
      <DriverList />
    </PermissionGuard>
  );
};

export default DriverDetailPage;