import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import BankDetails from 'src/components/RequestManagement/RequestDetails/DriverRequests/BankDetails/BankDetails';

const DriverBankInfo = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <BankDetails />
    </PermissionGuard>
  );
};

export default DriverBankInfo;