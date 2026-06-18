import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { getRateTierCityList } from 'src/common/service/rateTier/api';
import { generateRateTierCityListData, IRateTierCityListResponse } from 'src/components/RateTier/Cities/RateTierCityListUtil';
import RateTierCityListTable from 'src/components/RateTier/Cities/Table/RateTierCityListTable';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';

const RateTierCityList = () => {
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const tablestyle = useTableStyle();
  const {theme} = useAppTheme();
  const styles = useRestroStyle();

  const { t: TranslateMessage } = useTranslation();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    name: '',
    searchKey: '',
    active: 'true',
    sortField: 'countryName',
    sortOrder: 'asc',
  });
  const [rateTierCityData, setRateTierCityData] = useState<IRateTierCityListResponse>({
    ...generateRateTierCityListData()
  });

  const focus = useIsFocused();

  useEffect(() => {
    if (focus)
      fetchRateTierList(true);
  }, [filter, focus]);

  useEffect(() => {
    if (focus) {
      fetchRateTierList(false);
    }
    else {
      reset()
    }
  }, [page, focus]);

  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
      setFilter((prev) => ({ ...prev, searchKey }));
    }, DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const [searchText, setSearchText] = useState('');

  const handleSearch = (searchKey: string) => {
    setSearchText(searchKey);
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

  const fetchRateTierList = async (isFilterChanged: boolean) => {
    try {
      setLoading(true);
      setError('');
      const result = await getRateTierCityList(
        filter,
        isFilterChanged ? 0 : page,
        rateTierCityData.size
      );
      setRateTierCityData(result);
      if (isFilterChanged) {
        setPage(0);
      }
    } catch (e) {
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}`);
  };

  const reset = () => {
    setError('');
    setSearchText('');
    setFilter({
      name: '',
      searchKey: '',
      active: 'true',
      sortField: 'countryName',
      sortOrder: 'asc',
    })
    setRateTierCityData({ ...generateRateTierCityListData() })
    setPage(0)
    setLoading(false);
  };
  return (
    <>
      <ScrollView>
        <Loader loading={loading} />
        {/* Header Section */}
        <View style={layout.paddinghor17}>
          <View style={[layout.container, styles.headerContainer, layout.paddingTop26, layout.flexWrap]}>
            <View style={styles.filterrow}>
              <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
                {TranslateMessage('Admin.Delivery.App.Configure.Service')}
              </Text>
            </View>
            {/* Breadcrumbs */}
            <View style={styles.breadcrumbContainer}>
              <Text style={styles.breadcrumb}>
                {TranslateMessage('Admin.Delivery.App.Add.RateTier')}
              </Text>
              <Text style={styles.breadcrumb}>/</Text>
              <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
                {TranslateMessage('Admin.Delivery.App.City.List')}
              </Text>
            </View>
          </View>
          <Divider style={[layout.DividerSperator, { marginBottom: 30 }]} />
          {/* Main Section */}
          {/* Main Section */}
          <View style={styles.filterContainer}>
            <Text style={layout.accordionTitle}></Text>
            <View style={styles.searchFilterContainer}>
              <Searchbar
                placeholder={TranslateMessage(
                  'Admin.Delivery.App.SearchLabel',
                )}
                placeholderTextColor={theme.colors.textNeutral}
                iconColor={theme.colors.iconBase}
                mode='bar'
                value={searchText}
                onChangeText={handleSearch}
                inputStyle={styles.searchbarInput}
                style={styles.searchbar}
                rippleColor={'transparent'}
              />
            </View>
          </View>
          <View style={[layout.cardBox, layout.tableContainer]}>
            
            {/* Data Table */}
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView horizontal={true} style={layout.flexCol} contentContainerStyle={{ flex: 1 }}>
                  {!loading ? (
                    rateTierCityData && rateTierCityData.data.length > 0 ? (
                      <RateTierCityListTable
                        rateTierCityListData={rateTierCityData}
                        page={page}
                        handleSort={handleSort}
                        filter={filter}
                        handlePageChange={handlePageChange}
                        handleViewDetailsPress={handleViewDetailsPress}
                        error={error}
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
    </>
  );
};

export default RateTierCityList;
