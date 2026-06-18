import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import VehicleDetails from 'src/components/RequestManagement/RequestDetails/DriverRequests/VehicleDetails/VehicleDetails';

const DriverLicenseInfo = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <VehicleDetails />
    </PermissionGuard>
  );
};

export default DriverLicenseInfo;