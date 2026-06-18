import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import InsuranceDetails from 'src/components/RequestManagement/RequestDetails/DriverRequests/InsuranceDetails/InsuranceDetails';

const DriverBankInfo = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <InsuranceDetails />
    </PermissionGuard>
  );
};

export default DriverBankInfo;