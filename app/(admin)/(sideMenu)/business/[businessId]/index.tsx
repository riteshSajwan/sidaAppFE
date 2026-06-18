import { View } from "react-native";
import PermissionGuard from "src/common/components/PermissionGuard/PermissionGuard";
import { MenuType } from "src/common/utils/permissionUtils";
import AddBusinessPage from "src/components/Business/add/AddBusiness";

const AddBusiness = () => {

  return (
    <PermissionGuard menuName={MenuType.BUSINESS} productAdminOnly>
      <View style={{ flex: 1 }}>
        <AddBusinessPage />
      </View>
    </PermissionGuard>
  );
};

export default AddBusiness;
