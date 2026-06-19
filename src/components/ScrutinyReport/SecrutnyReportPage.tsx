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
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchRolesListAction, toggleRoleStatusAction } from 'src/common/service/role/action';
import { resetRoleList, resetRoleToggleStatus } from 'src/common/service/role/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import {
  generateInitialFilterData,
  generateInitialTempFilterData,
  IRoleListFilter,
  IRoleListTempFilter,
} from 'src/components/Role/RoleListUtil';
import RoleListTable from 'src/components/Role/Table/RoleListTable';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import ReportListingPage from './table/ReportListingPage';
import { IPreviewDriverRow } from './table/ReportListingUtils';

const SecrutnyReportPage = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { canEdit } = usePermission(MenuType.ROLE);

  const [page, setPage] = useState<number>(0);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ id: number; activeStatus: boolean } | null>(null);
  const [filter, setFilter] = useState<IRoleListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IRoleListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const { theme } = useAppTheme();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.role.roleList
  );
  const { loading: toggleLoading, success: toggleSuccess, error: toggleError } = useSelector(
    (state: RootState) => state.role.roleToggleStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setFilter({ ...filter, searchKey });
    }, DEBOUNCE_TIME),
    []
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchRolesListAction(page, DEFAULT_TABLE_SIZE));

      return () => {
        dispatch(resetRoleList());
      };
    }, [dispatch, page])
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
    setTempFilter({
      ...tempFilter,
      searchKey,
      createdAt: null,
    });
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

  const handleAddNewPress = () => {
    router.push(`${Routes.ROLES}${Routes.ADD}`);
  };

  const handleEditPress = (id: number) => () => {
    router.push(`${Routes.ROLES}/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
    dispatch(fetchRolesListAction(0, DEFAULT_TABLE_SIZE));
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => () => {
    setSelectedRole({ id, activeStatus: !currentStatus });
    // Show confirmation only when deactivating
    if (currentStatus) {
      setConfirmModalVisible(true);
    } else {
      // Activate directly without confirmation
      dispatch(toggleRoleStatusAction(id, true));
    }
  };

  const handleConfirmToggle = () => {
    if (selectedRole) {
      dispatch(toggleRoleStatusAction(selectedRole.id, selectedRole.activeStatus));
    }
    setConfirmModalVisible(false);
  };

  const handleCancelToggle = () => {
    setConfirmModalVisible(false);
    setSelectedRole(null);
    dispatch(resetRoleToggleStatus()); // Reset error when closing modal
  };

  useEffect(() => {
    if (toggleSuccess) {
      dispatch(fetchRolesListAction(page, DEFAULT_TABLE_SIZE));
      dispatch(resetRoleToggleStatus());
      setSelectedRole(null);
      setConfirmModalVisible(false); // Close modal on success
    }
  }, [toggleSuccess, dispatch, page]);

  // Filter roles based on search key (client-side filtering for now)
  const filteredData = useMemo(() => {
    if (!data) return null;

    let filteredRoles = [...data.data];

    if (filter.searchKey) {
      const searchLower = filter.searchKey.toLowerCase();
      filteredRoles = filteredRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchLower) ||
          role.description?.toLowerCase().includes(searchLower) ||
          role.createdByUser?.username.toLowerCase().includes(searchLower)
      );
    }

   
    return {
      ...data,
      data: filteredRoles,
      total: filteredRoles.length,
    };
  }, [data, filter.searchKey, filter.sortField, filter.sortOrder]);

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        <View style={[styles.searchFilterContainer, layout.justifyEnd]}>
          {canEdit && (
            <Pressable onPress={handleAddNewPress}>
              <Text
                style={[
                  button.btn,
                  button.btnOutlineDefault,
                ]}
              >
                <Icon
                  name='addLargeLine'
                  color={theme.colors.iconBase}
                  size={10}
                  spacing={theme.spacing.xs}
                />
                {TranslateMessage('Admin.Delivery.App.Restaurants.AddNewTitle')}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
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
          <Typography variant='subHeading'>
            {TranslateMessage('Admin.Sida.App.Reports')}
          </Typography>
          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumb}>
              {TranslateMessage('Admin.Delivery.App.Home')}
            </Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Sida.App.Reports')}
            </Text>
          </View>
        </View>
        <Divider
          style={[
            layout.DividerSperator, layout.marBottom30
          ]}
        />
      </>
    );
  }



  return (
    <>
      <Loader loading={loading || toggleLoading} />
      <CustomModal
        visible={confirmModalVisible}
        dismissOutside={false}
        title={TranslateMessage('Admin.Delivery.App.Confirmation.Required')}
        bodyContent={[]}
        onCancel={handleCancelToggle}
        onSave={handleConfirmToggle}
        error={toggleError || undefined}
        confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Yes')}
        cancelBtnTitle={TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
        isCloseRequired={false}
      >
        <View> 
         <Typography variant='body' spacing={{top:theme.spacing.sm, bottom:theme.spacing.xs}}>
          {TranslateMessage('Admin.Delivery.App.Role.Deactivate.Title')}
        </Typography>
        <Typography variant='body' spacing={{top:theme.spacing.xs, bottom:theme.spacing.sm}}>
          {TranslateMessage('Admin.Delivery.App.Role.Deactivate.Message')}
        </Typography>
        </View>
      </CustomModal>
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
                    true ?(
                         <ReportListingPage
                        data={[] as unknown as IPreviewDriverRow[]}
                        page={page}
                        total={30}
                        onPageChange={handlePageChange}
                      />
                    )
                    // filteredData && filteredData.data.length > 0 ? (
                    //   <RoleListTable
                    //     roleListData={filteredData}
                    //     page={page}
                    //     handleSort={handleSort}
                    //     filter={filter}
                    //     handlePageChange={handlePageChange}
                    //     error={error ?? ''}
                    //     handleEditPress={handleEditPress}
                    //     handleToggleStatus={handleToggleStatus}
                    //     canEdit={canEdit}
                    //   />
                    // )
                     : (
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
    </>
  );
};

export default SecrutnyReportPage;
