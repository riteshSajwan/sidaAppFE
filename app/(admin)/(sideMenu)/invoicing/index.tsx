import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';

const InvoicingListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.INVOICING}>
      {/* <InvoicingList/> */}
      Test
     </PermissionGuard>
  );
};

export default InvoicingListPage;