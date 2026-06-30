import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchRolesDropdownAction } from 'src/common/service/role/action';
import { resetRoleDropdown } from 'src/common/service/role/slice';
import { fetchUsersListAction } from 'src/common/service/user/action';
import { resetUserList } from 'src/common/service/user/slice';
import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import UserListTable from 'src/components/User/Table/UserListTable';
import {
    generateInitialFilterData,
    generateInitialTempFilterData,
    IUserListFilter,
    IUserListTempFilter,
} from 'src/components/User/UserListUtil';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const UserList = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IUserListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IUserListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => {
    setVisible(true);
    setTempFilter({ ...tempFilter, roleId: filter.roleId ?? null });
  };
  const hideModal = () => setVisible(false);
  
  const { theme } = useAppTheme();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.user.userList
  );
  const { data: roles, loading: rolesLoading } = useSelector(
    (state: RootState) => state.role.roleDropdown
  );
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setFilter({ ...filter, searchKey });
    }, DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    if (filter || page >= 0) {
      fetchRequestList(page === 0);
    }
  }, [filter, page]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchRolesDropdownAction());
      fetchRequestList(true);

      return () => {
        dispatch(resetUserList());
        dispatch(resetRoleDropdown());
      };
    }, [dispatch])
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
    dispatch(
      fetchUsersListAction(
        newPage,
        DEFAULT_TABLE_SIZE,
        filter.roleId ?? undefined
      )
    );

    if (isFilterChanged) {
      setPage(0);
    }
  };

  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
  };

  const handleSort = (sortField: string) => {
    const sortOrder =
      sortField === filter.sortField
        ? filter.sortOrder === 'asc'
          ? 'desc'
          : 'asc'
        : 'asc';
    setFilter({ ...filter, sortField, sortOrder });
  };

  const isFilterSet = useMemo(() => {
    return Boolean(filter.roleId);
  }, [filter.roleId]);

  const onChangeRoleDropdown = (item: IMinuteOption) => {
    const roleId = item.value ? Number(item.value) : null;
    setTempFilter({ ...tempFilter, roleId });
  };

  const onFilterSave = () => {
    setFilter({ ...filter, roleId: tempFilter.roleId });
    setPage(0);
    hideModal();
  };

  const onFilterCancel = () => {
    setFilter({ ...filter, ...generateInitialTempFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    hideModal();
  };

  const handleAddNewPress = () => {
    router.push(`${Routes.USERS}${Routes.ADD}`);
  };

  const handleEditPress = (id: number) => () => {
    router.push(`${Routes.USERS}/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetailsPress = (id: number) => () => {
    router.push(`${Routes.USERS}/${id}`);
  };

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        <View style={[styles.searchFilterContainer, layout.justifyEnd]}>
          <Pressable
            style={[button.btnfilter, button.btnOutlineDefault]}
            onPress={showModal}
          >
            <Icon
              name="filter"
              size={22}
              color={
                isFilterSet ? theme.colors.iconBase : theme.colors.iconDisabled
              }
            />
          </Pressable>
          
          <Pressable onPress={handleAddNewPress}>
            <Text
              style={[
                button.btn,
                button.btnOutlineDefault,
              ]}
            >
              <Icon
                name="addLargeLine"
                color={theme.colors.iconBase}
                size={10}
                spacing={theme.spacing.xs}
              />
              {TranslateMessage('Admin.Delivery.App.Dashboard.AddNewUser')}
            </Text>
          </Pressable>

          <Pressable
            style={[button.btnfilter, button.btnOutlineDefault]}
            onPress={reset}
          >
            <Icon name="refresh" size={20} color={theme.colors.iconBase} />
          </Pressable>
        </View>
      </View>
    );
  }

  function renderRoleFilter() {
    const roleOptions = [
      { label: TranslateMessage('Admin.Delivery.App.RequestManagementList.Filter.All'), value: '' },
      ...(roles?.map((role) => ({
        label: role.name,
        value: role.id.toString(),
      })) || []),
    ];

    const selectedRoleOption = roleOptions.find(
      (opt) => opt.value === (tempFilter.roleId?.toString() || ''),
    );

    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexCol}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle,layout.mb0]}>
              {TranslateMessage('Admin.Delivery.App.Role')}
            </Text>
          </View>
          <Customdropdown
            data={roleOptions}
            selectedValue={
              selectedRoleOption || {
                label: TranslateMessage('Admin.Delivery.App.All'),
                value: '',
              }
            }
            onChange={onChangeRoleDropdown}
          />
        </View>
      </View>
    );
  }

  function renderFilterModal() {
    return (
      <FilterModal
        visible={visible}
        hideModal={hideModal}
        title={TranslateMessage('Admin.Delivery.App.Filter')}
        onClear={onFilterCancel}
        onSave={onFilterSave}
      >
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>{renderRoleFilter()}</View>
        </View>
      </FilterModal>
    );
  }

  function renderHeading() {
    return (
      <>
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
          ]}
        >
          <Typography variant="subHeading">
            {TranslateMessage('Admin.Delivery.App.Dashboard.UserManagement')}
          </Typography>
        </View>
        <Divider
          style={[
            layout.DividerSperator,layout.marBottom30
          ]}
        />
      </>
    );
  }

  return (
    <>
      <Loader loading={loading || rolesLoading} />
      <ScrollView>
        <View style={[layout.containerPadding]}>
          {renderHeading()}
          {renderFilters()}
          <View style={[layout.cardBox, layout.tableContainer]}>
            <View style={[tablestyle.container]}>
              <View style={layout.flexCol}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={layout.flexCol}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      <UserListTable
                        userListData={data}
                        page={page}
                        handleSort={handleSort}
                        filter={filter}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        error={error ?? ''}
                        handleEditPress={handleEditPress}
                      />
                    ) : (
                      <Text
                        style={[
                          formStyle.labelTitle,
                          formStyle.noRetroLabel,
                        ]}
                      >
                        {TranslateMessage(
                          'Admin.Delivery.App.Driver.No.Data.Found'
                        )}
                      </Text>
                    )
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderFilterModal()}
    </>
  );
};

export default UserList;
