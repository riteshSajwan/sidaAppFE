import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomModal from 'src/common/components/CustomModal/CustomModal';
import CustomSnackbar, { SnackbarType } from 'src/common/components/CustomSnackbar/CustomSnackbar';
import ErrorMessageContainer from 'src/common/components/ErrorMessage/ErrorMessage';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { assignBookingToRiderAction, cancelBookingByAdminAction, fetchNewBookingListingAction, fetchRiderMonthlyScheduleAction, unassignBookingFromRiderAction } from 'src/common/service/booking/action';
import { resetNewBookingListing, resetRiderMonthlySchedule, setBookingAssignmentSnackbar, setBookingCancellationSnackbar } from 'src/common/service/booking/slice';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { IDashboardProps } from 'src/components/DashboardPage/DashboardUtil';
import AssignRideModal from 'src/components/NewBooking/AssignRideModal';
import CancelBookingModal from 'src/components/NewBooking/CancelBookingModal';
import {
    cancellationReasons,
    generateInitialFilterData,
    generateScheduleMarkedDatesDto,
    getScheduledDate,
    IBooking,
    IBookingListFilter,
    rideStatusOptions,
} from 'src/components/NewBooking/NewBookingListUtil';
import NewBookingListTable from 'src/components/NewBooking/Table/NewBookingListTable';
import { IBookingType } from 'src/components/NewBooking/Table/NewBookingListTableUtil';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DEBOUNCE_TIME } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { AppDispatch, RootState } from 'src/store';

const NewBookingList = ({ isDashboard }: IDashboardProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const formStyle = useFormStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();
  const { theme } = useAppTheme();
  const { rideStatus: rideStatusParam, page: pageParam } = useLocalSearchParams<{ rideStatus?: string | string[]; page?: string | string[] }>();
  const selectedRideStatusParam = typeof rideStatusParam === 'string' ? rideStatusParam : '';
  const selectedPageParam =
    typeof pageParam === 'string' && !Number.isNaN(Number(pageParam))
      ? Number(pageParam)
      : 0;

  const [page, setPage] = useState<number>(selectedPageParam);
  const [filter, setFilter] = useState<IBookingListFilter>({
    ...generateInitialFilterData(),
    rideStatus: selectedRideStatusParam,
  });
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [scheduleDriverId, setScheduleDriverId] = useState<number | null>(null);
  const [scheduleOpenSignal, setScheduleOpenSignal] = useState<number>(0);
  const [shouldOpenScheduleCalendar, setShouldOpenScheduleCalendar] = useState<boolean>(false);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [cancelRemark, setCancelRemark] = useState<string>('');
  const [bookingToCancel, setBookingToCancel] = useState<IBooking | null>(null);
  const [isCancellationRequested, setIsCancellationRequested] = useState<boolean>(false);
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);
  const [isAssignmentRequested, setIsAssignmentRequested] = useState<boolean>(false);
  const [bookingToUnassign, setBookingToUnassign] = useState<IBooking | null>(null);
  const [unassignConfirmationVisible, setUnassignConfirmationVisible] = useState<boolean>(false);
  const [stableStatusCounts, setStableStatusCounts] = useState<Partial<Record<IBookingType, number>>>({});
  const [stableTotalCount, setStableTotalCount] = useState<number>(0);
  const { data, loading, error } = useSelector((state: RootState) => state.booking.newBookingListing);
  const { loading: assignLoading, snackbarVisible: assignmentSnackbarVisible, error: assignmentError, successMessage: assignmentSuccessMessage, isSuccess: isAssignmentSuccess } = useSelector((state: RootState) => state.booking.bookingAssignment);
  const { loading: cancelLoading, snackbarVisible: cancellationSnackbarVisible, error: cancellationError, isSuccess: isCancellationSuccess } = useSelector((state: RootState) => state.booking.bookingCancellation);
  const {data: riderMonthlySchedule,loading: riderMonthlyScheduleLoading,error: riderMonthlyScheduleError,} = useSelector((state: RootState) => state.booking.riderMonthlySchedule);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);
  const resetScheduleState = () => {
    setScheduleDriverId(null);
    setScheduleOpenSignal(0);
    setShouldOpenScheduleCalendar(false);
    dispatch(resetRiderMonthlySchedule());
  };
  const resetDriverSelection = () => {
    setSelectedDriverId(null);
    setSelectedDriver(null);
    resetScheduleState();
  };
  const buildSelectedDriver = (booking: IBooking): any => ({
    id: booking.riderId ?? 0,
    firstName: booking.riderName || TranslateMessage('Admin.Delivery.App.UnknownDriver'),
    email: '',
    phoneNumber: booking.riderPhoneNumber || '',
    profileUrl: booking.riderImage || undefined,
    activeStatus: '',
    isBlocked: false,
  });
  const debouncedSearch = useCallback(
    debounce((searchKey: string) => {
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

  useEffect(() => {
    if (filter.rideStatus === selectedRideStatusParam) {
      return;
    }

    setFilter((prevState) => ({
      ...prevState,
      rideStatus: selectedRideStatusParam,
    }));
    resetDriverSelection();
    setSelectedBookingId(null);
    setPage(0);
  }, [filter.rideStatus, resetDriverSelection, selectedRideStatusParam]);

  useEffect(() => {
    if (page === selectedPageParam) {
      return;
    }

    setSelectedBookingId(null);
    setPage(selectedPageParam);
  }, [page, selectedPageParam]);


  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNewBookingListingAction(filter, page, DEFAULT_TABLE_SIZE));
      return () => {
        dispatch(resetNewBookingListing());
      };
    }, [dispatch, filter, page])
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (typeof data?.total === 'number') {
      setStableTotalCount(data.total);
    }

    if (data?.statusCounts) {
      setStableStatusCounts(data.statusCounts);
    }
  }, [data?.statusCounts, data?.total]);

  const handleSearch = (searchKey: string) => {
    debouncedSearch(searchKey);
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

  const fetchRequestList = async (isFilterChanged: boolean) => {
    const newPage = isFilterChanged ? 0 : page;

    dispatch(
      fetchNewBookingListingAction(
        filter,
        newPage,
        DEFAULT_TABLE_SIZE
      )
    );

    if (isFilterChanged) {
      setPage(0);
    }
  };

  const handleTabPress = (rideStatus: string) => {
    if (filter.rideStatus === rideStatus) {
      return;
    }

    router.setParams({ rideStatus, page: '0' });
    setFilter((prevState) => ({
      ...prevState,
      rideStatus,
    }));
    setSelectedBookingId(null);
    resetDriverSelection();
    setPage(0);
  };

  const getStatusCount = (rideStatus: string) => {
    if (!data?.data?.length || !rideStatus) {
      return data?.total ?? 0;
    }

    return data.data.filter((booking) => booking.orderStatus === rideStatus).length;
  };

  const handlePageChange = (newPage: number) => {
     router.setParams({ page: String(newPage) });
    setSelectedBookingId(null);
    setPage(newPage);
  };

  const handleViewDetailsPress = (id: string) => () => {
    router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}`);
  };

  const handleBookingSelection = (bookingId: number) => {
    const booking = data?.data?.find((item) => item.id === bookingId);

    if (
      booking?.orderStatus !== IBookingType.REQUESTED &&
      booking?.orderStatus !== IBookingType.RIDER_ASSIGNED
    ) {
      return;
    }

    setSelectedBookingId((currentBookingId) => {
      const isSameBooking = currentBookingId === bookingId;

      if (isSameBooking) {
        resetDriverSelection();
        return null;
      }

      if (
        booking.orderStatus === IBookingType.RIDER_ASSIGNED &&
        booking.riderId
      ) {
        setSelectedDriverId(booking.riderId);
        setSelectedDriver(buildSelectedDriver(booking));
        resetScheduleState();
      } else {
        resetDriverSelection();
      }

      return bookingId;
    });
  };

  const handleDriverSelectionChange = (driver: any) => {
    resetScheduleState();
    setSelectedDriver(driver);
    setSelectedDriverId((currentDriverId) =>
      currentDriverId === driver.id ? null : driver.id
    );
  };

  const handleAssignRide = () => {
    if (!selectedBookingId || !selectedDriverId) {
      return;
    }

    setAssignModalVisible(true);
  };

  const handleAssignModalClose = () => {
    setAssignModalVisible(false);
    resetScheduleState();
  };

  const handleScheduleCalendarOpen = (driver: any) => {
    if (!driver?.id || !selectedBooking?.scheduledTime) {
      return;
    }

    setScheduleDriverId(driver.id);
    setShouldOpenScheduleCalendar(true);
    dispatch(fetchRiderMonthlyScheduleAction(driver.id, selectedBooking.scheduledTime));
  };

  const handleScheduleDateSelect = (driver: any, date: string) => {
    if (!driver?.id || !date) {
      return;
    }

    router.push({
      pathname: `${Routes.DRIVER}${Routes.BOOKINGHISTORY}/[id]`,
      params: {
        id: String(driver.id),
        key: 'RIDER',
        rideType: 'INTERCITY',
        startDate: date,
        endDate: date,
      },
    });
  };

  useEffect(() => {
    if (!shouldOpenScheduleCalendar || riderMonthlyScheduleLoading) {
      return;
    }

    if (riderMonthlySchedule) {
      setScheduleOpenSignal((currentValue) => currentValue + 1);
    }

    setShouldOpenScheduleCalendar(false);
  }, [riderMonthlySchedule, riderMonthlyScheduleLoading, shouldOpenScheduleCalendar]);

  const handleAssignModalProceed = () => {
    if (!selectedBookingId || !selectedDriverId || riderMonthlyScheduleLoading) {
      return;
    }

    setIsAssignmentRequested(true);
    dispatch(assignBookingToRiderAction(selectedDriverId, selectedBookingId));
  };

  const handleAssignmentSnackbarDismiss = () => {
    dispatch(setBookingAssignmentSnackbar(false));
  };

  const handleOpenUnassignConfirmation = (booking: IBooking) => {
    if (booking.orderStatus !== IBookingType.RIDER_ASSIGNED || !booking.riderId) {
      return;
    }

    setBookingToUnassign(booking);
    setUnassignConfirmationVisible(true);
  };

  const handleCloseUnassignConfirmation = () => {
    setBookingToUnassign(null);
    setUnassignConfirmationVisible(false);
  };

  const handleUnassignProceed = () => {
    if (!bookingToUnassign?.id || !bookingToUnassign.riderId) {
      return;
    }

    setIsAssignmentRequested(true);
    setUnassignConfirmationVisible(false);
    dispatch(
      unassignBookingFromRiderAction(
        bookingToUnassign.riderId,
        bookingToUnassign.id,
        [bookingToUnassign.riderId]
      )
    );
  };

  const handleCancelBooking = (booking: IBooking) => {
    setBookingToCancel(booking);
    setCancelRemark('');
    setCancelModalVisible(true);
  };

  const handleCancelModalClose = () => {
    setCancelModalVisible(false);
    setCancelRemark('');
    setBookingToCancel(null);
  };

  const handleCancelProceed = () => {
    if (!bookingToCancel?.id || !cancelRemark.trim()) {
      return;
    }

    setIsCancellationRequested(true);
    dispatch(cancelBookingByAdminAction(bookingToCancel.id, cancelRemark.trim()));
  };

  const handleCancellationSnackbarDismiss = () => {
    dispatch(setBookingCancellationSnackbar(false));
  };

  const selectedBooking = useMemo(
    () => data?.data?.find((booking) => booking.id === selectedBookingId),
    [data?.data, selectedBookingId]
  );

  useEffect(() => {
    if (selectedBookingId &&(
        !selectedBooking ||
        (selectedBooking.orderStatus !== IBookingType.REQUESTED &&
          selectedBooking.orderStatus !== IBookingType.RIDER_ASSIGNED)
      )
    ) {
      setSelectedBookingId(null);
    }
  }, [selectedBooking, selectedBookingId]);

  useEffect(() => {
    const bookingDate = selectedBooking?.scheduledTime;

    if (!assignModalVisible || !selectedDriverId || !bookingDate) {
      dispatch(resetRiderMonthlySchedule());
      return;
    }

    dispatch(fetchRiderMonthlyScheduleAction(selectedDriverId, bookingDate));
  }, [assignModalVisible, dispatch, selectedBooking, selectedDriverId]);

  const isSameAssignedRiderSelected =
    selectedBooking?.orderStatus === IBookingType.RIDER_ASSIGNED &&
    Boolean(selectedBooking?.riderId) &&
    selectedBooking.riderId === selectedDriverId;

  useEffect(() => {
    if (!isAssignmentRequested || assignLoading) {
      return;
    }
    setAssignModalVisible(false);
    if (isAssignmentSuccess) {
      setSelectedBookingId(null);
      resetDriverSelection();
      dispatch(fetchNewBookingListingAction( filter,page,DEFAULT_TABLE_SIZE));}
    setIsAssignmentRequested(false);
    setBookingToUnassign(null);
  }, [assignLoading,dispatch,filter,isAssignmentRequested,isAssignmentSuccess,page,]);

  useEffect(() => {
    if (!isCancellationRequested || cancelLoading || !bookingToCancel) {
      return;
    }

    if (isCancellationSuccess) {
      handleCancelModalClose();

      if (selectedBookingId === bookingToCancel.id) {
        setSelectedBookingId(null);
        resetDriverSelection();
      }

      dispatch(fetchNewBookingListingAction(filter, page, DEFAULT_TABLE_SIZE));
    }

    setIsCancellationRequested(false);
  }, [bookingToCancel, cancelLoading, dispatch, filter, isCancellationRequested, isCancellationSuccess, page, selectedBookingId]);



  function renderRideStatusTabs() {
    const statusOptions = [
      {
        label: TranslateMessage('Admin.Delivery.App.Dashboard.All.New.Booking'),
        value: '',
      },
      ...rideStatusOptions(),
    ];

    return (
      <View style={[layout.mb10]}>
        <View style={[DashboardStyle.tabFlexRow, layout.flexWrap, { gap: 8 }]}>
          {statusOptions.map((status) => {
            const statusCount = status.value
              ? stableStatusCounts[status.value as IBookingType] ?? 0
              : stableTotalCount;
            const statusLabel = status.value
              ? `${status.label} (${statusCount})`
              : status.label;

            return (
              <Pressable key={status.value} onPress={() => handleTabPress(status.value)}>
                <Text
                  style={[
                    DashboardStyle.segmentedButton,
                    filter.rideStatus === status.value && DashboardStyle.activeTab,
                  ]}
                >
                  {statusLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
  function renderAssignRideModal() {
    const isReassignFlow = selectedBooking?.orderStatus === IBookingType.RIDER_ASSIGNED;
    const selectedBookingDate = getScheduledDate(selectedBooking?.scheduledTime);
    const hasScheduleConflict = Boolean(
      selectedBookingDate &&
      riderMonthlySchedule?.upcomingScheduledTimes?.some(
        (scheduledTime) => getScheduledDate(scheduledTime) === selectedBookingDate
      )
    );

    return (
      <AssignRideModal
        visible={assignModalVisible}
        onCancel={handleAssignModalClose}
        onProceed={handleAssignModalProceed}
        isReassignFlow={isReassignFlow}
        bookingId={selectedBooking?.id}
        riderId={selectedDriver?.id}
        riderName={selectedDriver?.firstName}
        riderImage={selectedDriver?.profileUrl ?? null}
        scheduledTime={selectedBooking?.scheduledTime}
        hasScheduleConflict={hasScheduleConflict}
        scheduleLoading={riderMonthlyScheduleLoading}
        assignLoading={assignLoading}
        scheduleError={riderMonthlyScheduleError}
      />
    );
  }

  function renderUnassignRideModal() {
    return (
      <CustomModal
        visible={unassignConfirmationVisible}
        dismissOutside={true}
        title={TranslateMessage('Admin.Delivery.App.Confirmation.Required')}
        bodyContent={[]}
        onCancel={handleCloseUnassignConfirmation}
        onSave={handleUnassignProceed}
        confirmBtnTitle={TranslateMessage('Admin.Delivery.App.Yes')}
        cancelBtnTitle={TranslateMessage('Admin.Delivery.App.CancelBtnTitle')}
        dialogStyle={{ maxWidth: 500, width: '100%' }}
      >
        <View style={formStyle.formRow}>
          <View style={formStyle.formCol}>
            <Typography variant='body'>
              {TranslateMessage('Admin.Delivery.App.Unassign.Rider.Confirmation')}
            </Typography>
          </View>
        </View>
      </CustomModal>
    );
  }

  const scheduleCalendarDate = useMemo(() => {
    return getScheduledDate(selectedBooking?.scheduledTime);
  }, [selectedBooking?.scheduledTime]);

  const scheduleMarkedDates = useMemo(() => {
    return generateScheduleMarkedDatesDto(
      riderMonthlySchedule?.upcomingScheduledTimes,
      theme.colors.textErrorDark
    );
  }, [riderMonthlySchedule?.upcomingScheduledTimes, theme.colors.textErrorDark]);
  function renderHeading() {
    return (
      <><View style={[layout.container,styles.headerContainer,layout.paddingTop26,]}>
        <Typography variant='subHeading'>{TranslateMessage('Admin.Delivery.App.New.Booking.Heading.Title')}</Typography>
      </View>
        <Divider style={[layout.DividerSperator, { marginBottom: theme.spacing.xxl }]} /></>
    )
  }
  return (
    <>
      <Loader loading={loading || cancelLoading} />
      <View style={layout.newBookingContainer}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[layout.containerPadding, isDashboard && { paddingHorizontal: 0 }]}>
            {!isDashboard ? renderHeading() : null}
            {!isDashboard ? renderRideStatusTabs() : null}
            <View style={[layout.cardBox,layout.tableContainer,]}>
              <View style={[tablestyle.container]}>
                <View style={layout.flexCol}>
                  <ScrollView horizontal style={layout.flexCol} contentContainerStyle={layout.flexCol}>
                    {!loading ? (
                      data && data.data.length > 0 ? (
                        <View style={tablestyle.tableScrollWidth}>
                          <NewBookingListTable
                            BookingListData={data}
                            page={page}
                            handleSort={handleSort}
                            filter={filter}
                            handlePageChange={handlePageChange}
                            handleViewDetailsPress={handleViewDetailsPress}
                            onCancelBooking={handleCancelBooking}
                            onUnassignRider={handleOpenUnassignConfirmation}
                            selectedBookingId={selectedBookingId}
                            onSelectBooking={handleBookingSelection}
                            error={error ?? ''}
                            isDashboard={isDashboard}
                          />
                        </View>
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
          <CancelBookingModal
            visible={cancelModalVisible}
            cancelRemark={cancelRemark}
            cancellationReasons={cancellationReasons}
            loading={cancelLoading}
            onCancelRemarkChange={setCancelRemark}
            onSelectReason={setCancelRemark}
            onClose={handleCancelModalClose}
            onProceed={handleCancelProceed}
          />
          {renderAssignRideModal()}
          {renderUnassignRideModal()}
        </ScrollView>
        {selectedBookingId ? (
          <View style={layout.driverListContainer}>
            <View style={[layout.cardBox, layout.tableContainer, layout.driverInnerConatiner]}>
              {/* <DriverListWithSearch
                onDriverSelect={handleDriverSelectionChange}
                selectedDriverId={selectedDriverId}
                pinnedDriver={selectedDriver}
                showHeader={true}
                pageSize={10}
                showCheckboxes={true}
                selectedCheckboxDriverId={selectedDriverId}
                onCheckboxChange={handleDriverSelectionChange}
                onAssignPress={handleAssignRide}
                isAssignDisabled={!selectedBookingId || !selectedDriverId || isSameAssignedRiderSelected}
                assignButtonTitle={TranslateMessage(
                  selectedBooking?.orderStatus === IBookingType.RIDER_ASSIGNED
                    ? 'Admin.Delivery.App.Reassign.Driver'
                    : 'Admin.Delivery.App.Assign.Ride'
                )}
                onSchedulePress={handleScheduleCalendarOpen}
                scheduleCalendarDate={scheduleCalendarDate}
                scheduleMarkedDates={scheduleMarkedDates}
                scheduleLoading={riderMonthlyScheduleLoading}
                scheduleError={riderMonthlyScheduleError}
                scheduleDriverId={scheduleDriverId}
                scheduleOpenSignal={scheduleOpenSignal}
                selectedRideDate={scheduleCalendarDate}
                onScheduleDateSelect={handleScheduleDateSelect}
              /> */}
              {riderMonthlyScheduleError ? (
                <ErrorMessageContainer message={riderMonthlyScheduleError} />
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
      <CustomSnackbar
        visible={assignmentSnackbarVisible}
        message={assignmentError || assignmentSuccessMessage || TranslateMessage('Admin.Delivery.App.Booking.Assign.Rider.Success')}
        onDismiss={handleAssignmentSnackbarDismiss}
        type={assignmentError ? SnackbarType.WARNING : SnackbarType.SUCCESS}
      />
      <CustomSnackbar
        visible={cancellationSnackbarVisible}
        message={cancellationError || TranslateMessage('Admin.Delivery.App.Booking.Cancel.Success')}
        onDismiss={handleCancellationSnackbarDismiss}
        type={cancellationError ? SnackbarType.WARNING : SnackbarType.SUCCESS}
      />
      <Portal>
        <Loader loading={assignLoading && !assignModalVisible} styles={layout.loader}/>
      </Portal>
      <Portal>
        <Loader loading={cancelLoading && cancelModalVisible} styles={layout.loader}/>
      </Portal>
      <Portal>
        <Loader loading={riderMonthlyScheduleLoading && !assignModalVisible} styles={layout.loader}/>
      </Portal>
    </>
  );
};

export default NewBookingList;
