import { useIsFocused } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  Divider,
  Searchbar
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomSnackbar, {
  SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { fetchCityListAction, setActiveCityStatusAction } from 'src/common/service/city/action';
import { resetCityList, resetUpdateCityStatus } from 'src/common/service/city/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import {
  generateInitialTempFilterData,
  ICityListTempFilter
} from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCitiesUtil';
import ActiveCItyListTable from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/table/ManageCitiesTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const ManageCities = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const {theme} = useAppTheme();
  const { canEdit } = usePermission(MenuType.SERVICEABLE_AREA);

  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const { countryId } = useLocalSearchParams<{ countryId: string }>();
  const focus = useIsFocused();

  const [tempFilter, setTempFilter] = useState<ICityListTempFilter>({
    ...generateInitialTempFilterData(),
  });

    const {
    data: activeCities,
    loading,
    error,
    snackbarVisible,
  } = useSelector((state: RootState) => state.city.cityList);
  useEffect(() => {
    if (countryId && focus) {
      fetchActiveCities(countryId);
    } else {
      setPage(0);
    }
    return()=>{
          dispatch(resetCityList());
      
    }
  }, [page, countryId, focus, searchText]);

  const fetchActiveCities = async (id: string) => {
       dispatch(
            fetchCityListAction(id,
              searchText,
              page,
              DEFAULT_TABLE_SIZE
            )
          );
  };

  const debouncedSearch = useCallback(
    debounce((searchKey:string) => {
      setSearchText(searchKey);
    }, DEBOUNCE_TIME),
    []
  );
  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
  };


  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);


  const onActionPress = (id: number) => async (newValue: boolean) => {
     dispatch(setActiveCityStatusAction(id, newValue));
  };

  const handleEditPress = (id: number) => () => {

    router.push(`${Routes.COUNTRIES}/${countryId}${Routes.CITIES}/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleBackPress = () => {
    router.push(`${Routes.COUNTRIES}`);
  };

  const numberOfPages = Math.ceil(activeCities.total / activeCities.size);

  const handleDismiss = () => {
       dispatch(resetUpdateCityStatus());
  };

  const handleAddNewPress = () => {
    router.push(
      `${Routes.COUNTRIES}/${countryId}${Routes.CITIES}${Routes.NEW}`
    );
  };

  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }

  return (
    <>
      {/* Header Section */}
      <Loader loading={loading} />
      <ScrollView>
        <View style={layout.containerPadding}>
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26, layout.flexWrap
            ]}
          >
            <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.City.Master')}</Typography>
            {/* Breadcrumbs */}
            <View style={styles.breadcrumbContainer}>
              <Text style={styles.breadcrumb}>
                {TranslateMessage('Admin.Delivery.App.Country.ServiceArea&FeeConfiguration')},
              </Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={styles.breadcrumb}>{TranslateMessage('Admin.Delivery.App.Country.Heading')}</Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
                {TranslateMessage('Admin.Delivery.App.City.Master')}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.lg }]} />
          {/* Main Section */}
          <View style={styles.filterContainer}>
              <Text style={layout.accordionTitle}></Text>
              <View style={styles.searchFilterContainer}>
                {/* Will need in future */}
                <Searchbar
                  value={tempFilter.searchKey}
                  onChangeText={handleSearch}
                  placeholder='Search'
                  placeholderTextColor={theme.colors.textNeutral}
                  iconColor={theme.colors.iconBase}
                  mode='bar'
                  inputStyle={styles.searchbarInput}
                  style={styles.searchbar}

                />
              {canEdit && (
                <Pressable onPress={handleAddNewPress}
                  style={[
                    button.btn,
                    button.btnOutlineDefault,
                    layout.flexDirectionRow,
                    ]}
                >
                  <Icon name='addLargeLine' size={12} color={theme.colors.iconBase} />
                  <Typography variant='body'> {TranslateMessage('Admin.Delivery.Add.City')}</Typography>
                </Pressable>
              )}
              </View>
            </View>
          <View style={layout.cardBox}>
            
            {/* Data Table */}
            <View style={tablestyle.container}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1 }}
                >
                  {!loading ? (
                    activeCities && activeCities.data.length > 0 ? (
                      <ActiveCItyListTable
                        activeCities={activeCities}
                        page={page}
                        handlePageChange={handlePageChange}
                        handleTogglePress={onActionPress}
                        handleEditPress={handleEditPress}
                        canEdit={canEdit}
                        error={error ?? ''} />) :
                      (<Text style={[formStyle.labelTitle, formStyle.noRetroLabel]}>
                        {TranslateMessage('Admin.Delivery.App.Driver.No.Data.Found')}
                      </Text>)) : null}
                </ScrollView>
              </View>
            </View>
          </View>
          <CustomSnackbar
            visible={snackbarVisible}
            message={TranslateMessage('Admin.Delivery.App.Snackbar.DataSaved')}
            onDismiss={handleDismiss}
            type={SnackbarType.SUCCESS}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ManageCities;
