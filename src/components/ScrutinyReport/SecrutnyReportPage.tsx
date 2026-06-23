import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { MenuType } from 'src/common/utils/permissionUtils';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import {
  generateInitialFilterData,
  generateInitialTempFilterData,
  IRoleListFilter,
  IRoleListTempFilter,
} from 'src/components/Role/RoleListUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
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



  const handleAddNewPress = () => {
    router.push(`${Routes.ROLES}${Routes.ADD}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
                  {!loading ? (
                    true ?(
                         <ReportListingPage
                        data={[] as unknown as IPreviewDriverRow[]}
                        page={page}
                        total={30}
                        onPageChange={handlePageChange}
                      />
                    )
                    
                     : (
                      <Text
                        style={[
                          formStyle.labelTitle,
                          formStyle.noRetroLabel,
                        ]}
                      >
                        {TranslateMessage(
                          'Admin.Sida.APP.No.Data.Found'
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
