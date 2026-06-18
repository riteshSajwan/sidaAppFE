import { View } from "react-native";
import PermissionGuard from "src/common/components/PermissionGuard/PermissionGuard";
import { MenuType } from "src/common/utils/permissionUtils";
import BusinessList from "src/components/Business/BusinessList";

const Business = () => {

  return (
    <PermissionGuard menuName={MenuType.BUSINESS} productAdminOnly>
      <View style={{ flex: 1 }}>
        <BusinessList />
      </View>
    </PermissionGuard>
  );
};

export default Business;
