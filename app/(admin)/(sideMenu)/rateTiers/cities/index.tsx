import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import RateTierCityList from 'src/components/RateTier/Cities/RateTierCityList';

const RatesCityList = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA}>
      <RateTierCityList />
    </PermissionGuard>
  );
};

export default RatesCityList;
