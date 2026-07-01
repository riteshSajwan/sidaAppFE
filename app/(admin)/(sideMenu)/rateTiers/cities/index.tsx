import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';

const RatesCityList = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA}>
      {/* <RateTierCityList /> */}
      Test
    </PermissionGuard>
  );
};

export default RatesCityList;
