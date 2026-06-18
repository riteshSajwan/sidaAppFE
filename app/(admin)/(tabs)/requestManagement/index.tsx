import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import RequestListContainer from 'src/components/RequestManagement/RequestListContainer';

const RequestListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.REQUEST}>
      <RequestListContainer />
    </PermissionGuard>
  );
};

export default RequestListPage;