import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import TicketDetailsPage from 'src/components/TicketPage/TicketDetailsPage';

const TicketDetails = () => {
  return (
    <PermissionGuard menuName={MenuType.TICKET} requireEdit>
      <TicketDetailsPage/>
    </PermissionGuard>
  )
}

export default TicketDetails;