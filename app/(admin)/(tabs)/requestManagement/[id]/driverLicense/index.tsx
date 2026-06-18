import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import LicenseDetailsRequest from 'src/components/RequestManagement/RequestDetails/DriverRequests/LicenseDetails/LicenseDetailsRequest';

const DriverLicenseInfo = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <LicenseDetailsRequest />
    </PermissionGuard>
  );
};

export default DriverLicenseInfo;