import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { useTimingStyle } from 'src/common/assets/styles/timing';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomSnackbar, {
    SnackbarType,
} from 'src/common/components/CustomSnackbar/CustomSnackbar';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import {
    fetchRegisteredCountryListAction,
    setActiveCountryStatusAction,
} from 'src/common/service/country/action';
import {
    resetRegisteredCountryList,
    resetUpdateCountryStatus,
} from 'src/common/service/country/slice';
import { MenuType } from 'src/common/utils/permissionUtils';
import {
    generateInitialTempFilterData,
    ICountryListTempFilter,
} from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageActiveCountriesUtil';
import ActiveCountryListTable from 'src/components/ManageServiceAreas/ManageActiveCountries/table/ManageActiveCountiresTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const ManageActiveCountries = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const timing = useTimingStyle();
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { canEdit } = usePermission(MenuType.SERVICEABLE_AREA);

  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState<string>('');
  const [hasRegisteredCountry, setHasRegisteredCountry] = useState(false);
  const {
    data: activeCountries,
    loading,
    error,
    snackbarVisible,
  } = useSelector((state: RootState) => state.country.registeredCountryList);
  const [tempFilter, setTempFilter] = useState<ICountryListTempFilter>({
    ...generateInitialTempFilterData(),
  });

  const focus = useIsFocused();

  useEffect(() => {
    if (activeCountries.total > 0 || activeCountries.data.length > 0) {
      setHasRegisteredCountry(true);
      return;
    }

    if (!searchText) {
      setHasRegisteredCountry(false);
    }
  }, [activeCountries, searchText]);

  useEffect(() => {
    fetchActiveCountires(true);
  }, [searchText]);

  useEffect(() => {
    if (focus) {
      fetchActiveCountires(false);
    } else {
      setPage(0);
    }
    setTempFilter({ ...generateInitialTempFilterData() });
    // setActiveCountries({ ...generateInitalCountryListData() });
    dispatch(resetRegisteredCountryList());
    setSearchText('');
  }, [page, focus]);

  const handleSearch = (searchKey: string) => {
    setTempFilter({ ...tempFilter, searchKey });
    debouncedSearch(searchKey);
  };

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setSearchText(searchKey);
    }, DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onActionPress = (id: number) => async (newValue: boolean) => {
    dispatch(setActiveCountryStatusAction(id, newValue));
  };

  const fetchActiveCountires = async (isFilterChanged: boolean) => {
    dispatch(
      fetchRegisteredCountryListAction(
        searchText,
        isFilterChanged ? 0 : page,
        DEFAULT_TABLE_SIZE
      )
    );
    if (isFilterChanged) {
      setPage(0);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddNewPress = () => {
    router.push(`${Routes.COUNTRIES}${Routes.ADD}`);
  };

  const handleCountryPress = (id: string) => () => {
    router.push(`${Routes.COUNTRIES}/${id}${Routes.CITIES}`);
  };
  const handleEditPress = (id: number) => () => {
    router.push(`${Routes.COUNTRIES}/${id}`);
  };
  const handleDismiss = () => {
    dispatch(resetUpdateCountryStatus());
  };

  return (
    <>
      <Loader loading={loading} />
      <ScrollView>
        {/* Header Section */}
        <View style={layout.containerPadding}>
          <View
            style={[
              layout.container,
              styles.headerContainer,
              layout.paddingTop26,
            ]}
          >
            <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Country.CountryManager')}</Typography>
            {/* Breadcrumbs */}
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.lg }]} />
          {/* Main Section */}
          <View style={styles.filterContainer}>
            <Text style={layout.accordionTitle}></Text>
            <View style={styles.searchFilterContainer}>
              <Searchbar
                value={tempFilter.searchKey}
                onChangeText={handleSearch}
                placeholder={TranslateMessage('Admin.Delivery.App.SearchLabel')}
                placeholderTextColor={theme.colors.textNeutral}
                iconColor={theme.colors.iconBase}
                mode="bar"
                inputStyle={styles.searchbarInput}
                style={styles.searchbar}
                rippleColor={'transparent'}
              />
              {canEdit && !hasRegisteredCountry && (
                <Pressable onPress={handleAddNewPress}
                  style={[
                    button.btn,
                    button.btnOutlineDefault,
                    layout.flexDirectionRow,
                    { gap: theme.spacing.xs }]}
                >
                  <Icon name='addLargeLine' size={12} color={theme.colors.iconBase} />
                  <Typography variant='body'> {TranslateMessage('Admin.Delivery.App.Country.AddNewCountry')}</Typography>
                </Pressable>
              )}
            </View>
          </View>
          <View style={[layout.cardBox, layout.tableContainer]}>
            {/* Data Table */}
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1 }}
                >
                  {activeCountries && activeCountries.data.length > 0 ? (
                    <ActiveCountryListTable
                      activeCountries={activeCountries}
                      page={page}
                      handleCountryPress={handleCountryPress}
                      handlePageChange={handlePageChange}
                      handleTogglePress={onActionPress}
                      handleEditPress={handleEditPress}
                      canEdit={canEdit}
                      error={error ?? ''}
                    />
                  ) : (
                    <Text
                      style={[formStyle.labelTitle, formStyle.noRetroLabel]}
                    >
                      {TranslateMessage(
                        'Admin.Delivery.App.Driver.No.Data.Found'
                      )}
                    </Text>
                  )}
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

export default ManageActiveCountries;
