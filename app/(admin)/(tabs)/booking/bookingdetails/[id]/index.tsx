import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import BookingDetailPage from 'src/components/Booking/Add/BookingDetailsPage';

const BookingPage = () => {
  return (
    <PermissionGuard menuName={MenuType.BOOKING}>
      <BookingDetailPage />
    </PermissionGuard>
  );
};

export default BookingPage;