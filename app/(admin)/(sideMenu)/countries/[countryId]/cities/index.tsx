import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import ManageCities from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCities';

const ActiveCityList = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA}>
      <ManageCities />
    </PermissionGuard>
  );
};

export default ActiveCityList;
