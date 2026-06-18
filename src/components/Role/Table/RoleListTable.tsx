import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
  TableColumn,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IRole, IRoleListFilter, IRoleListResponse } from 'src/components/Role/RoleListUtil';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';

export interface IRoleListTableProps {
  roleListData: IRoleListResponse;
  page: number;
  filter: IRoleListFilter;
  handleSort: (sortField: string) => void;
  handlePageChange: (page: number) => void;
  handleEditPress: (id: number) => () => void;
  handleToggleStatus: (id: number, currentStatus: boolean) => () => void;
  canEdit: boolean;
  error?: string;
}

const RoleListTable = ({
  roleListData,
  page,
  filter,
  handleSort,
  handlePageChange,
  handleEditPress,
  handleToggleStatus,
  canEdit,
  error = '',
}: IRoleListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();

  const numberOfPages = Math.ceil(roleListData.total / DEFAULT_TABLE_SIZE);

  function renderRoleId(item: IRole) {
    return (
      <View>
        <Text>{item.id}</Text>
      </View>
    );
  }

  function renderRoleName(item: IRole) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 150 }}>
          {item.name}
        </Text>
      </View>
    );
  }

  function renderAction(item: IRole) {
    if (!canEdit) {
      return null;
    }

    return (
      <View
        style={[layout.flexDirectionRow, layout.alignItemCenter]}
      >
        <Pressable onPress={handleToggleStatus(item.id, item.activeStatus)}>
          <Icon 
            name={item.activeStatus ? 'switchOn' : 'switchOff'} 
            size={35} 
            color={item.activeStatus ? theme.colors.themeIcon : theme.colors.iconDisabled} 
          />
        </Pressable>
        
        <Pressable onPress={handleEditPress(item.id)}>
          <Icon name="edit" size={20} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IRole>[] = [
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.ID'),
      render: (item: IRole) => renderRoleId(item),
    },
    {
      key: 'name',
      title: TranslateMessage('Admin.Delivery.App.Role.Name'),
      sortable: true,
      render: (item: IRole) => renderRoleName(item),
    },
    ...(canEdit ? [{
      key: 'actions' as const,
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: IRole) => renderAction(item),
    }] : []),
  ];

  function renderRowDetails(id?: string | number) {
    return () => {
      if (!canEdit || !id) return;
      router.push(`${Routes.ROLES}/${id}`);
    };
  }

  return (
    <CustomDataTable
      data={roleListData.data}
      columns={columns}
      sortField={filter?.sortField}
      sortOrder={filter?.sortOrder}
      onSort={handleSort}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={roleListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default RoleListTable;
