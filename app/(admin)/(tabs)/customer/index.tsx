import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import CustomerList from 'src/components/CustomerDetailPage/CustomerList';

const CustomerDetailPage = () => {
  return (
    <PermissionGuard menuName={MenuType.CUSTOMER}>
      <CustomerList />
    </PermissionGuard>
  );
};

export default CustomerDetailPage;
