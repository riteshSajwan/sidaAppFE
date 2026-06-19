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
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchRolesDropdownAction } from 'src/common/service/role/action';
import { resetRoleDropdown } from 'src/common/service/role/slice';
import { fetchUsersListAction } from 'src/common/service/user/action';
import { resetUserList } from 'src/common/service/user/slice';
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

import { AppDispatch, RootState } from 'src/store';

import { IMinuteOption } from 'src/components/Business/BusinessListUtils';
import UploadContainer from './Upload/UploadContainer';

const Upload = () => {
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





  const onChangeRoleDropdown = (item: IMinuteOption) => {
    const roleId = item.value ? Number(item.value) : null;
    setTempFilter({ ...tempFilter, roleId });
  };



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
            {TranslateMessage('Admin.Sida.App.Layout.Upload')}
          </Typography>
          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumb}>
              {TranslateMessage('Admin.Delivery.App.Home')}
            </Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Sida.App.Layout.Upload')}
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
      <Loader loading={loading || rolesLoading} />
      <ScrollView>
        <View style={[layout.containerPadding]}>
          {renderHeading()}
          <View style={[layout.cardBox, layout.tableContainer]}>
            <View style={[tablestyle.container]}>
              <View style={layout.flexCol}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={layout.flexCol}
                >
                  <UploadContainer />
                </ScrollView>
              </View>
              <Pressable onPress={()=>{}}>
                {false ? (
                  <View style={[button.btnBase, button.btnPrimary]}>
                    <Loader
                      loading={true}
                      color={theme.colors.textInverse}
                    />
                  </View>
                ) : (
                  <Text style={[button.btnBase, button.btnPrimary]}>
                    {TranslateMessage('Admin.Sida.App.Upload.btn')}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

    </>
  );
};

export default Upload;
