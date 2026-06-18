import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import BookingList from 'src/components/Booking/BookingList';

const BookingListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.BOOKING}>
      <BookingList />
    </PermissionGuard>
  );
};

export default BookingListPage;