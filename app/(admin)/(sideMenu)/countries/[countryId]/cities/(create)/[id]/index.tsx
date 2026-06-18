import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddCity from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/add/AddCity';

const AddCityPage = () => {
  return (
    <PermissionGuard menuName={MenuType.SERVICEABLE_AREA} requireEdit>
      <AddCity />
    </PermissionGuard>
  );
};

export default AddCityPage;
