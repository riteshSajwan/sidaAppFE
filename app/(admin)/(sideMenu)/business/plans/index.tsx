import { View } from "react-native";
import PermissionGuard from "src/common/components/PermissionGuard/PermissionGuard";
import { MenuType } from "src/common/utils/permissionUtils";
import { Plans } from "src/components/Business/Plans/Plans";

const AddPlans = () => {
  
  return (
    <PermissionGuard menuName={MenuType.BUSINESS} productAdminOnly>
    <View style={{ flex: 1 }}>
      <Plans />
    </View>
    </PermissionGuard>
  );
};

export default AddPlans;
