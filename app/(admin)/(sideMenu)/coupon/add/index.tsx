import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import AddCoupon from 'src/components/CouponPage/add/AddCoupon';

const AddCouponConatiner = () => {
  return (
    <PermissionGuard menuName={MenuType.COUPON} requireEdit>
      <AddCoupon />
    </PermissionGuard>
  );
};

export default AddCouponConatiner;
