import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import NewBookingList from 'src/components/NewBooking/NewBookingList';

const NewBookingListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.NEWBOOKING}>
      <NewBookingList />
    </PermissionGuard>
  );
};

export default NewBookingListPage;