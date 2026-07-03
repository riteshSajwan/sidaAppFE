import React from 'react';
import TicketList from 'src/components/TicketPage/TicketList';

const TicketListPage = () => {
  return (
    // <PermissionGuard menuName={MenuType.TICKET}>
      <TicketList/>
    // </PermissionGuard>
  );
};

export default TicketListPage;