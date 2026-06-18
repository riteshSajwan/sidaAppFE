import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import InvoicingList from 'src/components/Invoicing/InvoicingList';

const InvoicingListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.INVOICING}>
      <InvoicingList/>
     </PermissionGuard>
  );
};

export default InvoicingListPage;