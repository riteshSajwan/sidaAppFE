import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageStyle, Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import Customdropdown from 'src/common/components/CustomDropdown/CustomDropdown';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
// import { DEFAULT_PAGE } from 'src/components/Restaurant/utils/RestaurantListingUtil';
// import { IAddressSelected, IMinuteOption } from 'src/components/Restaurant/utils/RestaurantUtil';
import Typography from 'src/common/components/Typography/Typography';
import { fetchBookingListingAction } from 'src/common/service/booking/action';
import { resetBookingListing } from 'src/common/service/booking/slice';
import { generateInitialFilterData, generateInitialTempFilterData, IBookingListFilter, IBookingListTempFilter, rideStatusOptions } from 'src/components/Booking/BookingListUtil';
import BookingListTable from 'src/components/Booking/Table/BookingListTable';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IMinuteOption } from '../Business/BusinessListUtils';

const BookingList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const {theme} = useAppTheme();

  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IBookingListFilter>({
    ...generateInitialFilterData(),
  });
  const [tempFilter, setTempFilter] = useState<IBookingListTempFilter>({
    ...generateInitialTempFilterData(),
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () =>{ setVisible(true),setTempFilter({...tempFilter,rideStatus:filter.rideStatus})};
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const {data,loading,error} = useSelector((state: RootState) => state.booking.bookingListing);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);
  const debouncedSearch = useCallback(
    debounce((searchKey:string) => {
      setFilter({ ...filter, searchKey });
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
        dispatch(resetBookingListing());
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
      rideStatus:''
    });
  };

  const handleSort = (sortField: string) => {
    // const sortOrder =
    //   sortField === filter.sortField
    //     ? filter.sortOrder === 'asc'
    //       ? 'desc'
    //       : 'asc'
    //     : 'asc';
    // setFilter({ ...filter, sortField, sortOrder });
  };

  const isFilterSet = useMemo(() => {
    return Boolean(filter.rideStatus);
  }, [filter.rideStatus]);

  const onChangeDropdown = (item: IMinuteOption) => {
    setTempFilter({ ...tempFilter, rideStatus: item.value });
  };

  // const onFilterChange = (value: string, fieldName: string) => () => {
  //   setFilter({ ...filter, [fieldName]: value });
  // };

  // const onChangeExpireDate = (createdAt: DateType) => {
  //   setTempFilter({ ...tempFilter, createdAt });
  // };;

  // useEffect(() => {
  //   if (focus) {
  //     dispatch(fetchAllActiveCountriesAction());
  //   }
  // }, [focus]);
  


  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;
  
    dispatch(
      fetchBookingListingAction(
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
    setFilter((prevState) => ({
      ...prevState,
      rideStatus: tempFilter.rideStatus
      // country: selectedValue.country.value,
      // paymentMethod: tempFilter.paymentMethod
    }));
    setPage(0);
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

  const reset = () => {
    setFilter({ ...generateInitialFilterData() });
    setTempFilter({ ...generateInitialTempFilterData() });
    setPage(0);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}`);
  }

  function renderFilters() {
    return (
      <View style={[styles.filterContainer, layout.containerPadding]}>
        {/* <Text style={[layout.accordionTitle, layout.fs20]}> {TranslateMessage(
          'Admin.Delivery.App.Driver.List'
        )}</Text> */}
        <View style={[styles.searchFilterContainer,{justifyContent:'flex-end'}]}>
          {/* <Searchbar
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
          /> */}
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
            {/* <Icon name='refresh' size={20} color={theme.colors.iconBase} /> */}
          </Pressable>
        </View>
      </View>
    );
  }

  function renderCountries() {
    return (
      <View style={layout.containerPadding}>
        <View style={layout.flexCol}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}> {TranslateMessage('Admin.Delivery.App.Booking.Ride.Status')}</Text>
          </View>
          <Customdropdown
            data={rideStatusOptions()}
            selectedValue={{ label: '', value: tempFilter.rideStatus}}
            onChange={(item) => onChangeDropdown(item)}
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
        onSave={onFilterSave}>
        <View style={layout.flexmarginBottom}>
          <View style={layout.flexCol}>
            {/* {renderStatusDriver()} */}
            {renderCountries()}
            {/* {renderPaymentMethod()} */}
          </View>
        </View>
      </FilterModal>
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
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.Booking.Heading.Title')}</Typography>
        <View style={styles.breadcrumbContainer}>
          <Text style={styles.breadcrumb}>{TranslateMessage(
            'Admin.Delivery.App.Home'
          )}</Text>
          <Text style={styles.breadcrumb}>/</Text>
          <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
            {TranslateMessage(
              'Admin.Delivery.App.Booking.Heading.Title'
            )}
          </Text>
        </View>
      </View>
      <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} /></>
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
            
            <View style={[tablestyle.container]}>
              <View style={{ flex: 1 }}>
                <ScrollView
                  horizontal
                  style={layout.flexCol}
                  contentContainerStyle={{ flex: 1}}
                >
                  {!loading ? (
                    data && data.data.length > 0 ? (
                      isDashboard ? (
                        <BookingListTable
                          BookingListData={data}
                          page={page}
                          handleSort={handleSort}
                          filter={filter}
                          handlePageChange={handlePageChange}
                          handleViewDetailsPress={handleViewDetailsPress}
                          error={error??""}
                          isDashboard={isDashboard}
                        />
                      ):(
                        <View style={tablestyle.tableScrollWidth}>
                          <BookingListTable
                            BookingListData={data}
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

export default BookingList;
