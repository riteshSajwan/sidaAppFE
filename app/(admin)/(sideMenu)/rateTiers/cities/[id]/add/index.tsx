import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddRateTier from 'src/components/RateTier/Cities/rateTierList/add/AddRateTier';

const AddRateTierPage = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA} requireEdit>
      <AddRateTier />
    </PermissionGuard>
  );
};

export default AddRateTierPage;
