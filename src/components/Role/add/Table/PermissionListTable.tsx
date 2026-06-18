import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  IPermissionListWithActions,
  PermissionListTableProps,
} from 'src/components/Role/add/Table/PermissionListTableUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Icon } from 'src/submodules/iconlibrary/src';

const PermissionListTable = ({
  permissionListData,
  selectedPermissions,
  onPermissionChange,
  error = '',
}: PermissionListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const tablestyle = useTableStyle();
  const { theme } = useAppTheme();

  const isPermissionSelected = (menuId: number, type: 'view' | 'edit'): boolean => {
    const permission = selectedPermissions.find((p) => p.menuId === menuId);
    if (!permission) return false;
    return permission[type];
  };

  const isViewDisabled = (menuId: number): boolean => {
    const permission = selectedPermissions.find((p) => p.menuId === menuId);
    // VIEW is disabled if EDIT is selected
    return permission?.edit || false;
  };

  const renderCheckbox = (menuId: number, type: 'view' | 'edit') => {
    const isSelected = isPermissionSelected(menuId, type);
    const isDisabled = type === 'view' && isViewDisabled(menuId);

    return (
      <Pressable
        style={[tablestyle.actionContainer, isDisabled && { opacity: 0.5 }]}
        onPress={() => !isDisabled && onPermissionChange(menuId, type)}
        disabled={isDisabled}
      >
        <Icon
          name={isSelected ? 'checkboxChecked' : 'checkboxBlank'}
          color={isSelected ? theme.colors.themeIcon : theme.colors.iconBase}
          size={24}
        />
      </Pressable>
    );
  };

  const columns = [
    {
      key: 'displayName',
      title: TranslateMessage('Admin.Delivery.App.Module'),
    },
    {
      key: 'view',
      title: TranslateMessage('Admin.Delivery.App.View'),
      render: (item: IPermissionListWithActions) => renderCheckbox(item.id, 'view'),
    },
    {
      key: 'edit',
      title: TranslateMessage('Admin.Delivery.App.Edit'),
      render: (item: IPermissionListWithActions) => renderCheckbox(item.id, 'edit'),
    },
  ];

  return (
    <CustomDataTable
      data={permissionListData}
      columns={columns as TableColumn<IPermissionListWithActions>[]}
      page={0}
      numberOfPages={1}
      rowsPerPage={permissionListData.length}
      totalItems={permissionListData.length}
      onPageChange={() => {}}
      hidePagination={true}
      error={error}
    />
  );
};

export default PermissionListTable;
