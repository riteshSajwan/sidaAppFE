import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchCustomerListingAction } from 'src/common/service/customer/action';
import { resetCustomerListing } from 'src/common/service/customer/slice';
import { generateInitialFilterData, generateInitialTempFilterData, IUserListFilter, IUserListTempFilter } from 'src/components/CustomerDetailPage/CustomerListUtil';
import CustomerListTable from 'src/components/CustomerDetailPage/Table/CustomerListTable';
import { customerStatus } from 'src/components/CustomerDetailPage/Table/CustomerListTableUtil';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const CustomerList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const {theme} = useAppTheme();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IUserListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IUserListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const {data,loading,error} = useSelector((state: RootState) => state.customer.customerListing);
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () => {setVisible(true),setTempFilter({...tempFilter,blockValue:filter.blockValue,createdAt:filter.createdAt})};
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const isInitialMount = useRef(true);
  const dispatch = useDispatch<AppDispatch>();
  const debouncedSearch = useCallback(
    debounce((searchKey:string) => {
      setFilter((prev) => ({
        ...prev,
        searchKey,
      }));
    }, DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    fetchRequestList(false);
  }, [page]);
  

  useFocusEffect(
    useCallback(() => {
      if (!focus) {
        reset();
        return;
      }
      fetchRequestList(true);
      return () => {
        dispatch(resetCustomerListing());
      };
    }, [focus, filter])
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = (searchKey: string) => {
    setTempFilter({
      ...tempFilter,
      searchKey,
      blockValue: '',
      createdAt: null
    });
    debouncedSearch(searchKey);
  };
  const handleSort = (sortField: string) => {
    const sortOrder =
      sortField === filter.sortField
        ? filter.sortOrder === 'desc'
          ? 'asc'
          : 'desc'
        : 'desc';
    setFilter({ ...filter, sortField, sortOrder });
  };

  const isFilterSet = useMemo(() => {
    return Boolean(filter.blockValue || filter.createdAt);
  }, [filter.blockValue, filter.createdAt]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, blockValue: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
    dispatch(fetchCustomerListingAction(filter,newPage,DEFAULT_TABLE_SIZE)
    );
  
    if (isFilterChanged) {
      setPage(0);
    }
  };

  const onFilterSave = () => {
    setFilter({ ...filter, ...tempFilter });
    hideModal();
  };

  const onFilterCancel = () => {
    setFilter({ ...filter, ...generateInitialTempFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    hideModal();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.CUSTOMER}${Routes.CUSTOMERDETAILS}/${id}`);
  }

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        {/* <Text style={[layout.accordionTitle, layout.fs20]}> {TranslateMessage(
          'Admin.Delivery.App.Customer.List'
        )}</Text> */}
        <View style={styles.searchFilterContainer}>
          <Searchbar
            placeholder={TranslateMessage(
              'Admin.Delivery.App.SearchLabel'
            )}
            placeholderTextColor={theme.colors.textNeutral}
            iconColor={theme.colors.iconBase}
            mode='bar'
            value={tempFilter.searchKey}
            onChangeText={handleSearch}
            inputStyle={styles.searchbarInput}
            style={styles.searchbar}
            rippleColor={'transparent'}
          />
          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault
            ]}
            onPress={showModal}
          >
            <Icon name='filter' size={22} color={
              isFilterSet
                ? theme.colors.iconBase
                : theme.colors.iconDisabled
            } />
          </Pressable>
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
      <View
        style={[
          layout.container,
          styles.headerContainer,
          layout.paddingTop26,
        ]}
      >
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Customer.Management')}</Typography>
      </View>
    )
  }

  function renderStatusCustomer() {
    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            <View>
              <Text style={formStyle.labelTitle}>
                {TranslateMessage(
                  'Admin.Delivery.App.RequestManagementList.Table.Status'
                )}
              </Text>
            </View>
            <Customdropdown
              data={customerStatus()}
              selectedValue={{ label: '', value: tempFilter.blockValue }}
              onChange={onChangeDropdown}
              style={{ height: 48 }}
            />
          </View>
          <View style={layout.flexCol}>
            <View>
              <Text style={[formStyle.labelTitle, { marginBottom: 20 }]}>
                {TranslateMessage(
                  'Admin.Delivery.App.UserManagementList.Filter.Registration.Date'
                )}
              </Text>
            </View>

            <CustomInputDatePicker
              date={
                tempFilter.createdAt
                  ? new Date(tempFilter.createdAt).toISOString().split('T')[0]
                  : null
              }
              onDateSelect={(dateStr) => onChangeExpireDate(new Date(dateStr))}
              maxDate={new Date().toISOString().split('T')[0]}
              placeholder={'Date (YYYY-MM-DD)'}
            />
          </View>
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
          <View style={layout.flexCol}>
            {renderStatusCustomer()}
          </View>
        </View>
      </FilterModal>
    );
  }


  return (
    <>
      <Loader loading={loading} />
      <ScrollView>
        <View style={[layout.containerPadding, isDashboard && { paddingHorizontal: 0 }]}>
          {!isDashboard ? renderHeading() : null}

          {!isDashboard ? <Divider style={[layout.DividerSperator, layout.marBottom30]} /> : null}
          {!isDashboard ? renderFilters() : null}

          <View style={[layout.cardBox, layout.tableContainer, isDashboard && { marginBottom: 0, paddingVertical: 0 }]}>
            

            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView horizontal style={layout.flexCol} contentContainerStyle={layout.flexCol}>
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      isDashboard ? (
                        <CustomerListTable
                          userListData={data}
                          page={page}
                          handleSort={handleSort}
                          filter={filter}
                          handlePageChange={handlePageChange}
                          handleViewDetailsPress={handleViewDetailsPress}
                          error={error ??''}
                          isDashboard={isDashboard}
                        />
                      ) : (
                          <View style={tablestyle.tableScrollWidth}>
                            <CustomerListTable
                              userListData={data}
                              page={page}
                              handleSort={handleSort}
                              filter={filter}
                              handlePageChange={handlePageChange}
                              handleViewDetailsPress={handleViewDetailsPress}
                              error={error??''}
                              isDashboard={isDashboard}
                            />
                          </View>
                      )
                      
                    ) : isDashboard ? (
                      <Image
                        source={require('src/common/assets/images/requestmanage.png')}
                        resizeMode='contain'
                        style={[DashboardStyle.imageGraph as ImageStyle]}
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
        {renderFilterModal()}
      </ScrollView>

    </>
  );
};

export default CustomerList;
