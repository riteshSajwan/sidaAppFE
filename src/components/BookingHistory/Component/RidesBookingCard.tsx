import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import CustomInputDatePicker from 'src/common/components/CustomDateNewPicker/CustomDateNewPicker';
import FilterModal from 'src/common/components/FilterModal/FilterModal';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { fetchUIserBookingListingAction } from 'src/common/service/booking/action';
import { resetBookingListing } from 'src/common/service/booking/slice';
import { generateInitialFilterData, generateInitialTempFilterData, IBookingListFilter, IBookingListTempFilter } from 'src/components/Booking/BookingListUtil';
import BookingListTable from 'src/components/Booking/Table/BookingListTable';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME, IS_INTERCITY } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';

const RidesBookingPage = ({ isDashboard }: IDashboardProps) => {
  type RideHistoryTab = 'ALL' | 'LOCAL' | 'INTERCITY';
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const {theme} = useAppTheme();
  const { id, key:role, rideType: rideTypeParam, startDate: startDateParam, endDate: endDateParam } = useLocalSearchParams();
  const resolvedRideType = Array.isArray(rideTypeParam) ? rideTypeParam[0] : rideTypeParam;
  const resolvedStartDate = Array.isArray(startDateParam) ? startDateParam[0] : startDateParam;
  const resolvedEndDate = Array.isArray(endDateParam) ? endDateParam[0] : endDateParam;
  const initialRideTypeTab = (resolvedRideType === 'LOCAL' || resolvedRideType === 'INTERCITY'
    ? resolvedRideType
    : 'ALL') as RideHistoryTab;
  const initialStartDate = resolvedStartDate ? new Date(resolvedStartDate) : null;
  const initialEndDate = resolvedEndDate ? new Date(resolvedEndDate) : null;
  const [activeRideTypeTab, setActiveRideTypeTab] = useState<RideHistoryTab>(initialRideTypeTab);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<IBookingListFilter>({
	...generateInitialFilterData(),
    rideType: initialRideTypeTab === 'ALL' ? '' : initialRideTypeTab,
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [tempFilter, setTempFilter] = useState<IBookingListTempFilter>({
	...generateInitialTempFilterData(),
    rideType: initialRideTypeTab === 'ALL' ? '' : initialRideTypeTab,
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [visible, setVisible] = useState<boolean>(false);
  const showModal = () =>{
    setVisible(true);
    setTempFilter({
      ...tempFilter,
      rideStatus: filter.rideStatus,
      rideType: filter.rideType,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
  };
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
  const userRole = Array.isArray(role) ? role[0] : role;
  const selectedRideType = filter.rideType || undefined;

  useEffect(() => {
    const nextRideTypeTab = (resolvedRideType === 'LOCAL' || resolvedRideType === 'INTERCITY'
      ? resolvedRideType
      : 'ALL') as RideHistoryTab;
    const nextStartDate = resolvedStartDate ? new Date(resolvedStartDate) : null;
    const nextEndDate = resolvedEndDate ? new Date(resolvedEndDate) : null;

    setActiveRideTypeTab(nextRideTypeTab);
    setFilter((prevState) => ({
      ...prevState,
      rideType: nextRideTypeTab === 'ALL' ? '' : nextRideTypeTab,
      startDate: nextStartDate,
      endDate: nextEndDate,
    }));
    setTempFilter((prevState) => ({
      ...prevState,
      rideType: nextRideTypeTab === 'ALL' ? '' : nextRideTypeTab,
      startDate: nextStartDate,
      endDate: nextEndDate,
    }));
    setPage(0);
  }, [resolvedEndDate, resolvedRideType, resolvedStartDate]);

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
	}, [focus, filter, selectedRideType])
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
	return Boolean(
      filter.rideStatus ||
      filter.rideType ||
      filter.startDate ||
      filter.endDate
    );
  }, [filter.endDate, filter.rideStatus, filter.rideType, filter.startDate]);

  const isDateRangeInvalid = useMemo(() => {
    if (!tempFilter.startDate || !tempFilter.endDate) {
      return true;
    }

    return tempFilter.startDate > tempFilter.endDate;
  }, [tempFilter.endDate, tempFilter.startDate]);

  const onChangeDate = (fieldName: 'startDate' | 'endDate', date: Date) => {
    setTempFilter((prevState) => ({
      ...prevState,
      [fieldName]: date,
    }));
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
		fetchUIserBookingListingAction(
		filter,
		newPage,
		DEFAULT_TABLE_SIZE,
		Number(id),
		userRole,
		selectedRideType
	  )
	);
  
	if (isFilterChanged) {
	  setPage(0);
	}
  };

  const onFilterSave = () => {
    if (isDateRangeInvalid) {
      return;
    }

    const nextRideTypeTab = (tempFilter.rideType || 'ALL') as RideHistoryTab;

	setFilter((prevState) => ({
	  ...prevState,
	  rideStatus: tempFilter.rideStatus,
      rideType: tempFilter.rideType,
      startDate: tempFilter.startDate,
      endDate: tempFilter.endDate,
	}));
    setActiveRideTypeTab(nextRideTypeTab);
	setPage(0);
	hideModal();
  };

  const onFilterCancel = () => {
	setFilter({ ...filter, ...generateInitialTempFilterData() });
	setTempFilter({ ...generateInitialTempFilterData() });
    setActiveRideTypeTab('ALL');
	hideModal();
  };

  const handlePageChange = (newPage: number) => {
	setPage(newPage);
  };

  const reset = () => {
	setFilter({ ...generateInitialFilterData() });
	setTempFilter({ ...generateInitialTempFilterData() });
    setActiveRideTypeTab('ALL');
	setPage(0);
  };

  const handleViewDetailsPress = (id: string) => () => {
	router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}`);
  }

  const handleRideTypeTabPress = (rideType: RideHistoryTab) => {
    setActiveRideTypeTab(rideType);
    setFilter((prevState) => ({
      ...prevState,
      rideType: rideType === 'ALL' ? '' : rideType,
    }));
    setTempFilter((prevState) => ({
      ...prevState,
      rideType: rideType === 'ALL' ? '' : rideType,
    }));
    setPage(0);
  };

  function renderFilters() {
	return (
	  <View style={styles.filterContainer}>
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
		  {/* <Pressable
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
		  </Pressable> */}

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
	  <View style={layout.paddinghor17}>
        {/* Ride type filter intentionally not shown here. */}
        {/* Ride status filter intentionally hidden for now. */}
        <View style={[layout.flexCol, layout.mt10]}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}>
              {TranslateMessage('Admin.Delivery.App.BookingHistory.StartDate')}
            </Text>
          </View>
          <CustomInputDatePicker
            date={
              tempFilter.startDate
                ? new Date(tempFilter.startDate).toISOString().split('T')[0]
                : null
            }
            onDateSelect={(dateStr) => onChangeDate('startDate', new Date(dateStr))}
            maxDate={
              tempFilter.endDate
                ? new Date(tempFilter.endDate).toISOString().split('T')[0]
                : undefined
            }
            placeholder={'Date (YYYY-MM-DD)'}
          />
        </View>
        <View style={[layout.flexCol, layout.mt10]}>
          <View style={layout.flexmarginBottom}>
            <Text style={[formStyle.labelTitle, { marginBottom: 0 }]}>
              {TranslateMessage('Admin.Delivery.App.BookingHistory.EndDate')}
            </Text>
          </View>
          <CustomInputDatePicker
            date={
              tempFilter.endDate
                ? new Date(tempFilter.endDate).toISOString().split('T')[0]
                : null
            }
            onDateSelect={(dateStr) => onChangeDate('endDate', new Date(dateStr))}
            minDate={
              tempFilter.startDate
                ? new Date(tempFilter.startDate).toISOString().split('T')[0]
                : undefined
            }
            placeholder={'Date (YYYY-MM-DD)'}
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
        disableSave={isDateRangeInvalid}
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
		<View style={styles.filterrow}>
		  <Text style={[layout.Adminh1Title, layout.serviceTopHeader]}>
			{/* {  } */}
			{TranslateMessage(userRole==='RIDER'?'Admin.Delivery.App.Driver.Booking.Heading.Title':'Admin.Delivery.App.Customer.Booking.Heading.Title')}
		  </Text>
		</View>
		<View style={styles.breadcrumbContainer}>
		  <Text style={styles.breadcrumb}>{TranslateMessage(
			'Admin.Delivery.App.Home'
		  )}</Text>
		  <Text style={styles.breadcrumb}>/</Text>
		  <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
		  	{TranslateMessage(userRole==='RIDER'?'Admin.Delivery.App.Driver.Booking.Heading.Title':'Admin.Delivery.App.Customer.Booking.Heading.Title')}
		  </Text>
		</View>
	  </View><Divider style={[layout.DividerSperator, { marginBottom: 30 }]} /></>
	)
  }

  function renderRideTypeTabs() {
    const rideTypeTabs = [
      {
        label: TranslateMessage('Admin.Delivery.App.BookingHistory.AllRides'),
        value: 'ALL' as RideHistoryTab,
      },
      {
        label: TranslateMessage('Admin.Delivery.App.BookingHistory.Local'),
        value: 'LOCAL' as RideHistoryTab,
      },
      {
        label: TranslateMessage('Admin.Delivery.App.BookingHistory.Intercity'),
        value: 'INTERCITY' as RideHistoryTab,
      },
    ];

	return (
      <View style={[layout.mb10]}>
        <View style={[layout.flexDirectionRow, layout.alignItemCenter, layout.justifyBetween, { gap: 12, flexWrap: 'wrap' }]}>
          <View style={[DashboardStyle.tabFlexRow, layout.flexWrap, { gap: 8, flex: 1 }]}>
            {rideTypeTabs.map((rideTypeTab) => (
              <Pressable
                key={rideTypeTab.value}
                onPress={() => handleRideTypeTabPress(rideTypeTab.value)}
              >
                <Text
                  style={[
                    DashboardStyle.segmentedButton,
                    activeRideTypeTab === rideTypeTab.value && DashboardStyle.activeTab,
                  ]}
                >
                  {rideTypeTab.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault,
            ]}
            onPress={showModal}
          >
            <Icon
              name='filter'
              size={22}
              color={isFilterSet ? theme.colors.iconBase : theme.colors.iconDisabled}
            />
          </Pressable>
          <Pressable
            style={[
              button.btnfilter,
              button.btnOutlineDefault,
            ]}
            onPress={reset}
          >
            <Icon name='refresh' size={20} color={theme.colors.iconBase} />
          </Pressable>
        </View>
      </View>
	);
  }
	
  return (
	<>
	  <Loader loading={loading} />
	  <ScrollView>
		<View style={[layout.paddinghor17, isDashboard && { paddingHorizontal: 0 }]}>
		  {!isDashboard ? renderHeading() : null}
		  {!isDashboard && IS_INTERCITY ? renderRideTypeTabs() : null}
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

export default RidesBookingPage;
