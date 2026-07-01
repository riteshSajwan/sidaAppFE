import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';

const EditRateTierPage = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA} requireEdit>
      {/* <AddRateTier /> */}
      Test
    </PermissionGuard>
  );
};

export default EditRateTierPage;
