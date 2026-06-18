import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchRateTierListAction } from 'src/common/service/rateTier/action';
import { setRateTierPage } from 'src/common/service/rateTier/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import RateTierListTable from 'src/components/RateTier/Cities/rateTierList/Table/RateTierListTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';


const RateTierList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { loading, error, data, page } = useSelector((state: RootState) => state.rateTier);
  const { canEdit } = usePermission(MenuType.SERVICEABLE_AREA);

  const { id } = useLocalSearchParams<{id: string;}>();
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const focus = useIsFocused();
  const { theme } = useAppTheme();

  useEffect(() => {
    dispatch(setRateTierPage(0));
  }, [focus]);
  
  useEffect(() => {
    dispatch(fetchRateTierListAction(id,page, DEFAULT_TABLE_SIZE));
  }, [page,focus]);
  
  const handlePageChange = (newPage: number) => {
    dispatch(setRateTierPage(newPage));
  };
  

  const handleDismiss = () => {
    setSnackbarVisible(false);
  };


  const handleEditPress = (id: number) => () => {
    router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}`);
  };

  const handleAddNewPress = () => {
    router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}${Routes.ADD}`);
  };
  const reset = () => {
    dispatch(fetchRateTierListAction(id,page, DEFAULT_TABLE_SIZE));
  };

  const handleViewDetailsPress = (id: string) => () => {

   router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}`);
    
  }

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        <View style={[styles.searchFilterContainer, layout.justifyEnd]}>

          {canEdit && (
            <Pressable onPress={handleAddNewPress}>
              <Text style={[
                button.btn,
                button.btnOutlineDefault,
               ]}>
                <Icon name='addLargeLine' color={theme.colors.iconBase} size={10} spacing={5} />
                {TranslateMessage('Admin.Delivery.App.AddRateTier')}
              </Text>
            </Pressable>
          )}

          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault
            ]}
            onPress={reset} >
            <Icon name='refresh' size={20} color={theme.colors.iconBase} />
          </Pressable>
        </View>
      </View>
    );
  }



  function renderHeading() {
    return (
      <><View
        style={[
          layout.container,
          styles.headerContainer,
          layout.paddingTop26,
        ]}
      >
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Rate.Tiers.Management')}</Typography>
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumb}>{TranslateMessage(
            'Admin.Delivery.App.Home'
          )}</Text>
          <Text style={styles.breadcrumb}>/</Text>
          <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
            {TranslateMessage(
              'Admin.Delivery.App.Rate.Tiers.Details'
            )}
          </Text>
        </View>
      </View>
      <Divider style={[layout.DividerSperator, layout.marBottom30]} /></>
    )
  }
  return (
    <>
      <Loader loading={loading} />
      <ScrollView>
        <View style={[layout.containerPadding, isDashboard && { paddingHorizontal: 0 }]}>
          {!isDashboard ? renderHeading() : null}
            {!isDashboard ? renderFilters() : null}
          <View style={[layout.cardBox, layout.tableContainer, isDashboard && { marginBottom: 0, paddingVertical: 0 }]}>
            {
              loading?
              <Loader loading={loading}/>
              :null
            }
            <View style={[tablestyle.container]}>
              <View style={layout.flexCol}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={layout.flexCol}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      <RateTierListTable
                        id={id}
                        rateTierListData={data}
                        page={page}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        error={error??''}
                        isDashboard={isDashboard}
                        handleEditPress={handleEditPress}
                        canEdit={canEdit}
                      />
                    ) : (
                      <Text style={[formStyle.labelTitle, formStyle.noRetroLabel]}>
                        {TranslateMessage('Admin.Delivery.App.Driver.No.Data.Found')}
                      </Text>
                    )
                  ) : null}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={snackbarVisible}
        message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
        onDismiss={handleDismiss}
        type={SnackbarType.SUCCESS}
      />
    </>
  );
};

export default RateTierList;
