import React from 'react';
import PermissionGuard from 'src/common/components/PermissionGuard/PermissionGuard';
import { MenuType } from 'src/common/utils/permissionUtils';
import ReportsDetailsPage from 'src/components/ReportsPage/ReportsDetailsPage';

const ReportListPage = () => {
  return (
    // <PermissionGuard menuName={MenuType.REPORT}>
      <ReportsDetailsPage />
    // </PermissionGuard>
  );
};

export default ReportListPage;
