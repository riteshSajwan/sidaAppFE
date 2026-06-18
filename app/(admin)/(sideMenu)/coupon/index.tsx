import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import CouponList from 'src/components/CouponPage/CouponList';

const CouponListPage = () => {
  return (
    <PermissionGuard menuName={MenuType.COUPON}>
      <CouponList/>
    </PermissionGuard>
  );
};

export default CouponListPage;