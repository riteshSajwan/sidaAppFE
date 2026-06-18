import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddCountry from 'src/components/ManageServiceAreas/ManageActiveCountries/add/AddCountry';

const AddCountires = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA} requireEdit>
      <AddCountry />
    </PermissionGuard>
  );
};

export default AddCountires;
