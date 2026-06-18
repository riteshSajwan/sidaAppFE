import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import TicketList from 'src/components/TicketPage/TicketList';

const TicketListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.TICKET}>
      <TicketList/>
    </PermissionGuard>
  );
};

export default TicketListPage;