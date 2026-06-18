import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import ManageActiveCountries from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageActiveCountires';

const ActiveCountryList = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA}>
      <ManageActiveCountries />
    </PermissionGuard>
  );
};

export default ActiveCountryList;
