import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import DriverWalletList from 'src/components/DriverDetailPage/DriverWallet/DriverWalletList';

const DriverDetailPage = () => {
  return (
    <PermissionGuard menuName={MenuType.DRIVER}>
      <DriverWalletList />;
    </PermissionGuard>
  );
};

export default DriverDetailPage;
