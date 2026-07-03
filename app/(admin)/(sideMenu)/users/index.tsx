import React from 'react';
import UserList from 'src/components/User/UserList';

const UserListPage = () => {
  return (
    // <PermissionGuard menuName={MenuType.ROLE}>
      <UserList />
    // </PermissionGuard>
  );
};

export default UserListPage;
