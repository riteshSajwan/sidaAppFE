import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
// import RateTierList from 'src/components/RateTier/Cities/rateTierList/RateTierListing';

const RateTierListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA}>
      {/* <RateTierList/> */}
      Test
    </PermissionGuard>
  );
};

export default RateTierListPage;
