import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import DriverOnboardingRequest from 'src/components/RequestManagement/RequestDetails/DriverRequests/Onboarding/DriverOnboardingRequest';

const DriverOnboardingRequestContainer = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <DriverOnboardingRequest />
    </PermissionGuard>
  );
};

export default DriverOnboardingRequestContainer;