import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import BookingHistoryContainer from 'src/components/BookingHistory/BookingHistory';

const BookingHistory = () => {
  return (
    <PermissionGuard menuName={MenuType.DRIVER}>
      <BookingHistoryContainer />
    </PermissionGuard>
  );
};

export default BookingHistory;