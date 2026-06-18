import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import InformationData from 'src/components/DriverOnboarding/InformationData';

const DriverOnboardingPage = () => {
  return (
    <PermissionGuard menuName={MenuType.DRIVER} requireEdit>
      <InformationData />
    </PermissionGuard>
  );
};

export default DriverOnboardingPage;
