import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import SupportChat from 'src/components/Chat/Chat';

const Chat = () => {
  return (
    <PermissionGuard menuName={MenuType.CHAT} productAdminOnly={false}>
      <SupportChat />
     </PermissionGuard>
  );
};

export default Chat;
