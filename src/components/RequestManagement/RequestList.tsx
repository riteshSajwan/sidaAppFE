import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Searchbar
} from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Loader } from 'src/common/components/Loader/Loader';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { Routes } from 'src/routing/paths';

import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useFormStyle } from 'src/common/assets/styles/form';
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import { requestStatus } from 'src/common/components/CustomDropdown/CustomDropdownUtil';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { useAppTheme } from 'src/common/context/AppTheme';
import { getRequestList, } from 'src/common/service/request/api';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import {
  generateInitialFilterData,
  generateInitialTempFilterData,
  generateRequestListData,
  IRequestListFilter,
  IRequestListResponse,
  IRequestListTempFilter,
  RequestApprovalList,
} from 'src/components/RequestManagement/RequestListUtil';
import RequestListTable from 'src/components/RequestManagement/Table/RequestListTable';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import { DEBOUNCE_TIME } from 'src/constants';
import { Icon } from 'src/submodules/iconlibrary/src';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { fetchDriverRequestListAction } from 'src/common/service/driver/action';
import { resetDriverRequests } from 'src/common/service/driver/slice';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DriverRequestApprovalList } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';

const RequestList = ({ isDashboard }: IDashboardProps) => {
  const layout = useLayoutStyle();
  const DashboardStyle = useDashboardStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const {theme} = useAppTheme();

  const { t: TranslateMessage } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IRequestListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IRequestListTempFilter>({
    ...generateInitialTempFilterData(),
  });

  const [visible, setVisible] = useState<boolean>(false);
  const isInitialMount = useRef(true);
  const showModal = () => {setVisible(true),setTempFilter({...tempFilter,approvalRequestStatus:filter.approvalRequestStatus,createdAt:filter.createdAt})};
  const hideModal = () => setVisible(false);
  const {data:requestListData,loading,error} = useSelector((state: RootState) => state.driver.requestList);

  const dispatch = useDispatch<AppDispatch>();
  const focus = useIsFocused();

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
      
      fetchDriverRequestList(false);
    }, [page]);
    
  
    useFocusEffect(
      useCallback(() => {
        if (!focus) {
          reset();
          return;
        }
        fetchDriverRequestList(true);
        return () => {
          dispatch(resetDriverRequests());
        };
      }, [focus, filter])
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
      approvalRequestStatus: '',
      createdAt: null
    });
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
    return Boolean(filter.approvalRequestStatus || filter.createdAt);
  }, [filter.approvalRequestStatus, filter.createdAt]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, approvalRequestStatus: item.value });
  };

  const onFilterChange = (value: string, fieldName: string) => () => {
    setFilter({ ...filter, [fieldName]: value });
  };

  const onChangeExpireDate = (createdAt: DateType) => {
    setTempFilter({ ...tempFilter, createdAt });
  };

  const fetchDriverRequestList = (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
  
    dispatch(
      fetchDriverRequestListAction(
        filter,
        newPage,
        DEFAULT_TABLE_SIZE
      )
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

  const handleViewDetailsPress = (id: string, title: string) => () => {
    let route = '';

    switch (title) {
      case DriverRequestApprovalList.DRIVER_ONBOARRDING:
        route = `${Routes.REQUESTS}/${id}${Routes.DRIVER_ONBOARRDING}`;
        break;
      case DriverRequestApprovalList.DRIVER_BANK:
        route = `${Routes.REQUESTS}/${id}${Routes.DRIVER_BANK}`;
        break;
      case DriverRequestApprovalList.DRIVER_INSURANCE:
        route = `${Routes.REQUESTS}/${id}${Routes.DRIVER_INSURANCE}`;
        break;
      case DriverRequestApprovalList.DRIVER_LICENSE:
        route = `${Routes.REQUESTS}/${id}${Routes.DRIVER_LICENSE}`;
        break;
      case DriverRequestApprovalList.DRIVER_VEHICLE:
        route = `${Routes.REQUESTS}/${id}${Routes.DRIVER_VEHICLE}`;
        break;
    }

    router.push(route);
  };

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  function renderStatusDate() {
    return (
      <View style={layout.paddinghor17}>
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            <View>
              <Text style={formStyle.labelTitle}>
                {TranslateMessage(
                  'Admin.Delivery.App.RequestManagementList.Filter.RequestStatus'
                )}
              </Text>
            </View>
            <Customdropdown
              data={requestStatus()}
              selectedValue={{ label: '', value: tempFilter.approvalRequestStatus }}
              onChange={onChangeDropdown}
              style={{ height: 47 }}
            />
          </View>
          <View style={layout.flexCol}>
            <View>
              <Text style={[formStyle.labelTitle, { marginBottom: 20 }]}>
                {TranslateMessage(
                  'Admin.Delivery.App.RequestManagementList.Filter.RequestCreationDate'
                )}
              </Text>
            </View>
            {/* required in future */}

            {/* <CustomDatePicker
                  value={tempFilter.createdAt as DateType}
                  onChange={onChangeExpireDate}
                  label='Date'
                  mode='outlined'
                  presentationStyle='overFullScreen'
                  inputMode='start'
                  activeOutlineColor={theme.colors.borderErrorInverse}
                  outlineColor={theme.colors.borderMedium}
                  validRange={{ endDate: getTodayDate() }}
                />  */}

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


  function renderFilters() {
    return (
      <View style={styles.filterContainer}>
        {/* <Text style={[layout.accordionTitle, layout.fs20]}> {TranslateMessage(
          'Admin.Delivery.App.RequestManagementList.RequestList'
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
            }/>
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
            {renderStatusDate()}
          </View>
        </View>
      </FilterModal>
    );
  }

  return (
    <>
      <Loader loading={loading} />
      {!isDashboard ? renderFilters() : null}
      <View
        style={[
          layout.cardBox,
          { borderTopWidth: 1, paddingHorizontal: 30, borderTopColor: '#e5e5e5', paddingBottom: 0 },
          isDashboard && { marginBottom: 0, paddingVertical: 0 }
        ]}>

        {/* Data Table */}
        <View style={[tablestyle.container]}>
          <View style={{ flex: 1 }}>
            <ScrollView horizontal={true} style={layout.flexCol} contentContainerStyle={{ flex: 1 }}>
              {!loading ? (
                requestListData && requestListData.data.length > 0 ? (
                  <RequestListTable
                    requestListData={requestListData}
                    page={page}
                    handleSort={handleSort}
                    filter={filter}
                    handlePageChange={handlePageChange}
                    handleViewDetailsPress={handleViewDetailsPress}
                    error={error??''}
                    isDashboard={isDashboard}
                  />
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
      {renderFilterModal()}
    </>
  );
};

export default RequestList;
