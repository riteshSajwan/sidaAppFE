import React from "react";
import PermissionGuard from "src/common/components/PermissionGuard/PermissionGuard";
import { MenuType } from "src/common/utils/permissionUtils";
import CabsDetailsContainer from "src/components/Cabs/Cabs";

const CabsPage = () => {
  return (
    <PermissionGuard menuName={MenuType.CAB}>
      <CabsDetailsContainer />
    </PermissionGuard>
  );
};

export default CabsPage;
