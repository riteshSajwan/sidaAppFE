import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import TripChat from 'src/components/Chat/TripChat';

const TripChatPage = () => {
  return (
    <PermissionGuard menuName={MenuType.BOOKING}>
      <TripChat />
    </PermissionGuard>
  );
};

export default TripChatPage;
