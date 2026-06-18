import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
  TableColumn,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import {
  IUser,
  IUserListFilter,
  IUserListResponse,
} from 'src/components/User/UserListUtil';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';

export interface IUserListTableProps {
  userListData: IUserListResponse;
  page: number;
  filter: IUserListFilter;
  handleSort: (sortField: string) => void;
  handlePageChange: (page: number) => void;
  handleViewDetailsPress: (id: number) => () => void;
  handleEditPress: (id: number) => () => void;
  error?: string;
  isDashboard?: boolean;
}

const UserListTable = ({
  userListData,
  page,
  filter,
  handleSort,
  handlePageChange,
  handleViewDetailsPress,
  handleEditPress,
  error = '',
  isDashboard = false,
}: IUserListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const numberOfPages = Math.ceil(userListData.total / DEFAULT_TABLE_SIZE);

  function renderUserId(item: IUser) {
    return (
      <View>
        <Text>{item.id}</Text>
      </View>
    );
  }

  function renderUsername(item: IUser) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 150 }}>
          {item.username}
        </Text>
      </View>
    );
  }

  function renderRole(item: IUser) {
    return (
      <View>
        <Text>
          {item.roleName}
        </Text>
      </View>
    );
  }

  function renderAction(item: IUser) {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: theme.spacing.sm,
          alignItems: 'center',
        }}
      >
        <Pressable onPress={handleEditPress(item.id)}>
          <Icon name="edit" size={20} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IUser>[] = [
    {
      key: 'id',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.ID'
      ),
      render: (item: IUser) => renderUserId(item),
    },
    {
      key: 'username',
      title: TranslateMessage('Admin.Delivery.App.Profile.Username'),
      sortable: true,
      render: (item: IUser) => renderUsername(item),
    },
    {
      key: 'roleName',
      title: 'Role',
      render: (item: IUser) => renderRole(item),
    },
    {
      key: 'actions',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Actions'
      ),
      render: (item: IUser) => renderAction(item),
    },
  ];

  function renderRowDetails(id?: string | number) {
    return () => {
      if (!id) return;
      router.push(`${Routes.USERS}/${id}`);
    };
  }

  return (
    <CustomDataTable
      data={userListData.data}
      columns={columns}
      sortField={filter?.sortField}
      sortOrder={filter?.sortOrder}
      onSort={handleSort}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={userListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default UserListTable;
