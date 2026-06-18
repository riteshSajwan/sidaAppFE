import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import DriverDetailPage from 'src/components/DriverDetailPage/Add/DriverDetailsPage';

const DriverPage = () => {
  return (
    <PermissionGuard menuName={MenuType.DRIVER}>
      <DriverDetailPage />
    </PermissionGuard>
  );
};

export default DriverPage;