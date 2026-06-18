import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import CustomerDetailPage from 'src/components/CustomerDetailPage/Add/CustomerDetailsPage';

const CustomerDetail = () => {
  return (
		 <PermissionGuard menuName={MenuType.CUSTOMER}>
			<CustomerDetailPage />
		 </PermissionGuard>
	) 
};

export default CustomerDetail ;