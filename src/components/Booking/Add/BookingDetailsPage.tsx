import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import { Divider, List, Portal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useButtonStyle } from "src/common/assets/styles/button";
import { useLayoutStyle } from "src/common/assets/styles/layout";
import { useTypographyStyle } from "src/common/assets/styles/typographyStyle";
import CustomModal from "src/common/components/CustomModal/CustomModal";
import CustomSnackbar, {
  SnackbarType,
} from "src/common/components/CustomSnackbar/CustomSnackbar";
import ErrorMessageContainer from "src/common/components/ErrorMessage/ErrorMessage";
import { RenderImage } from "src/common/components/Image/Image";
import { Loader } from "src/common/components/Loader/Loader";
import Typography from "src/common/components/Typography/Typography";
import { useAppTheme } from "src/common/context/AppTheme";
import { useCredentials } from "src/common/hook/useCredentials";
import useCurrencyFormatter from "src/common/hook/useCurrencyFormator";
import { useHeaderStyle } from "src/common/layouts/Header/HeaderStyle";
import {
  assignBookingToRiderAction,
  cancelBookingByAdminAction,
  completeRideByAdminAction,
  fetchRideDetailsAction,
  fetchRiderMonthlyScheduleAction,
  fetchRoundTripDetailsAction,
} from "src/common/service/booking/action";
import {
  resetRideDetails,
  resetRiderMonthlySchedule,
  resetRoundTripDetails,
  setBookingAssignmentSnackbar,
  setBookingCancellationSnackbar,
  setRideCompletionSnackbar,
} from "src/common/service/booking/slice";
import {
  convertUTCDateToLocalDate,
  formatToDayMonthTime,
} from "src/common/utils/dateUtil";
import {
  AssignmentTarget,
  buildAssignedDriver,
  buildRideLocationPoints,
  formatBookingDateTime,
  IPastRideListData,
  isRideAssignmentAllowed,
  isRideReassignAllowed,
  RideType,
} from "src/components/Booking/Add/BookingDetailUtil";
import {
  bookingStatusLabel,
  getBookingStatusAppearance,
  IBookingType,
} from "src/components/Booking/Table/BookingListTableUtil";
import { IDriverForCabs } from "src/components/Cabs/CabsUtil";
import DriverListWithSearch from "src/components/Cabs/DriverListWithSearch";
import AssignRideModal from "src/components/NewBooking/AssignRideModal";
import CancelBookingModal from "src/components/NewBooking/CancelBookingModal";
import {
  cancellationReasons,
  getTranslatedVehicleCategory,
} from "src/components/NewBooking/NewBookingListUtil";
import {
  getTicketLabelByKey,
  IUSERROLE,
  ticketTarget,
} from "src/components/TicketPage/TicketDetailUtil";
import { useTripStyle } from "src/components/TripDetails/TripStyle";
import { Routes } from "src/routing/paths";
import { AppDispatch, AppThunkDispatch, RootState } from "src/store";
import { Icon } from "src/submodules/iconlibrary/src";
// import MapComponentWeb from 'src/submodules/mapservicesfe/src/components/MapTrack/MapComponentWeb'

// const isRideAssignmentAllowed = (ride?: IPastRideListData | null) =>
//   ride?.orderStatus === IBookingType.REQUESTED || ride?.orderStatus === IBookingType.RIDER_ASSIGNED;

// const isRideReassignAllowed = (ride?: IPastRideListData | null) =>
//   ride?.orderStatus === IBookingType.RIDER_ASSIGNED;

// const buildAssignedDriver = (
//   ride: IPastRideListData | null | undefined,
//   translate: (key: string) => string
// ): IDriverForCabs | null => {
//   if (!isRideReassignAllowed(ride) || !ride?.riderId) {
//     return null;
//   }

//   return {
//     id: ride.riderId,
//     firstName: ride.riderName || translate('Admin.Delivery.App.UnknownDriver'),
//     email: '',
//     phoneNumber: ride.riderPhoneNumber || '',
//     profileUrl: ride.riderImage || undefined,
//     activeStatus: ride.activeStatus
//       ? translate('Admin.Delivery.App.UserManagementList.Filter.Active')
//       : translate('Admin.Delivery.App.UserManagementList.Filter.Inactive'),
//     isBlocked: false,
//     latitude: undefined,
//     longitude: undefined,
//   };
// };

const TripDetailsContainer = () => {
  const layout = useLayoutStyle();
  const { theme } = useAppTheme();
  const { t: TranslateMessage } = useTranslation();
  const styles = useHeaderStyle();
  const tripStyle = useTripStyle();
  const button = useButtonStyle();
  const typographyStyle = useTypographyStyle();
  const credentials = useCredentials();
  const googlePlaceApiKey = credentials?.googleApiKey ?? "";
  const { id } = useLocalSearchParams();
  const pickupIcon = "/markerIcon/pickUpIcon.png";
  const stopIcon = "/markerIcon/mapIcon.png";
  const destinationIcon = "/markerIcon/destinationIcon.png";
  const dispatch: AppThunkDispatch = useDispatch<AppDispatch>();
  const getScheduledDate = (dateTime?: string | null) =>
    dateTime?.split("T")[0] ?? null;
  const { data, loading, error } = useSelector(
    (state: RootState) => state.booking.rideDetails,
  );
  const {
    data: roundTripData,
    loading: roundTripLoading,
    error: roundTripError,
  } = useSelector((state: RootState) => state.booking.roundTripDetails);
  const {
    loading: assignLoading,
    snackbarVisible: assignmentSnackbarVisible,
    error: assignmentError,
    isSuccess: isAssignmentSuccess,
  } = useSelector((state: RootState) => state.booking.bookingAssignment);
  const {
    loading: cancelLoading,
    snackbarVisible: cancellationSnackbarVisible,
    error: cancellationError,
    isSuccess: isCancellationSuccess,
  } = useSelector((state: RootState) => state.booking.bookingCancellation);
  const {
    loading: completeLoading,
    snackbarVisible: completionSnackbarVisible,
    error: completionError,
    isSuccess: isCompletionSuccess,
  } = useSelector((state: RootState) => state.booking.rideCompletion);
  const {
    data: riderMonthlySchedule,
    loading: riderMonthlyScheduleLoading,
    error: riderMonthlyScheduleError,
  } = useSelector((state: RootState) => state.booking.riderMonthlySchedule);
  const currencyFormate = useCurrencyFormatter();

  const tickets = data?.tickets ?? [];
  const stopMarkers = (data?.stops ?? [])
    .filter((stop) => stop.stopType === "MIDDLE_POINT")
    .sort(
      (firstStop, secondStop) =>
        (firstStop.sequenceOrder ?? 0) - (secondStop.sequenceOrder ?? 0),
    )
    .map((stop) => ({
      latitude: stop.latitude,
      longitude: stop.longitude,
    }));
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<IDriverForCabs | null>(
    null,
  );
  const [scheduleDriverId, setScheduleDriverId] = useState<number | null>(null);
  const [scheduleOpenSignal, setScheduleOpenSignal] = useState<number>(0);
  const [shouldOpenScheduleCalendar, setShouldOpenScheduleCalendar] =
    useState<boolean>(false);
  const [assignModalVisible, setAssignModalVisible] = useState<boolean>(false);
  const [isAssignmentRequested, setIsAssignmentRequested] =
    useState<boolean>(false);
  const [isDriverSidebarVisible, setIsDriverSidebarVisible] =
    useState<boolean>(false);
  const [assignmentTarget, setAssignmentTarget] = useState<AssignmentTarget>(
    AssignmentTarget.MAIN,
  );
  const [showRoundTripOnMap, setShowRoundTripOnMap] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelRemark, setCancelRemark] = useState("");
  const [isCancellationRequested, setIsCancellationRequested] = useState(false);
  const [completeConfirmVisible, setCompleteConfirmVisible] = useState(false);
  const [isCompletionRequested, setIsCompletionRequested] = useState(false);
  const shouldShowRoundTripCard =
    data?.rideType === RideType.INTERCITY && Boolean(data?.isRoundTrip);
  const activeAssignmentRide =
    assignmentTarget === AssignmentTarget.ROUND_TRIP ? roundTripData : data;
  const isAssignmentAllowed = isRideAssignmentAllowed(activeAssignmentRide);
  const isReassignAllowed = isRideReassignAllowed(activeAssignmentRide);
  const bookingStatusAppearance = data?.orderStatus
    ? getBookingStatusAppearance(data.orderStatus as IBookingType, theme)
    : null;
  const resetAssignmentSelection = () => {
    setSelectedDriverId(null);
    setSelectedDriver(null);
    setScheduleDriverId(null);
    setScheduleOpenSignal(0);
    setShouldOpenScheduleCalendar(false);
    setAssignModalVisible(false);
    setIsDriverSidebarVisible(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchRideDetailsAction(Number(id)));
    }
    return () => {
      dispatch(resetRideDetails());
      dispatch(resetRoundTripDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!shouldShowRoundTripCard || !data?.id) {
      dispatch(resetRoundTripDetails());
      return;
    }

    dispatch(fetchRoundTripDetailsAction(data.id));
  }, [data?.id, dispatch, shouldShowRoundTripCard]);

  useEffect(() => {
    if (isAssignmentAllowed) {
      return;
    }

    resetAssignmentSelection();
  }, [isAssignmentAllowed]);

  useEffect(() => {
    if (!isAssignmentRequested || assignLoading) {
      return;
    }

    setAssignModalVisible(false);

    if (isAssignmentSuccess && id) {
      setIsDriverSidebarVisible(false);
      dispatch(fetchRideDetailsAction(Number(id)));

      if (shouldShowRoundTripCard) {
        dispatch(fetchRoundTripDetailsAction(Number(id)));
      }
    }

    setIsAssignmentRequested(false);
  }, [
    assignLoading,
    dispatch,
    id,
    isAssignmentRequested,
    isAssignmentSuccess,
    shouldShowRoundTripCard,
  ]);

  useEffect(() => {
    if (!isCancellationRequested || cancelLoading) return;
    if (isCancellationSuccess && id) {
      handleCancelModalClose();
      dispatch(fetchRideDetailsAction(Number(id)));
    }
    setIsCancellationRequested(false);
  }, [cancelLoading, isCancellationRequested, isCancellationSuccess]);

  useEffect(() => {
    if (!isCompletionRequested || completeLoading) return;
    if (isCompletionSuccess && id) {
      setCompleteConfirmVisible(false);
      dispatch(fetchRideDetailsAction(Number(id)));
    }
    setIsCompletionRequested(false);
  }, [completeLoading, isCompletionRequested, isCompletionSuccess]);

  const handleDriverSelectionChange = (driver: IDriverForCabs) => {
    const bookingDate = activeAssignmentRide?.scheduledTime;
    const nextSelectedDriverId =
      selectedDriverId === driver.id ? null : driver.id;

    dispatch(resetRiderMonthlySchedule());
    setScheduleDriverId(nextSelectedDriverId);
    setScheduleOpenSignal(0);
    setShouldOpenScheduleCalendar(false);
    setSelectedDriver(nextSelectedDriverId ? driver : null);
    setSelectedDriverId(nextSelectedDriverId);

    if (nextSelectedDriverId && bookingDate) {
      dispatch(
        fetchRiderMonthlyScheduleAction(nextSelectedDriverId, bookingDate),
      );
    }
  };

  const handleAssignRide = () => {
    if (!activeAssignmentRide?.id || !selectedDriverId) {
      return;
    }

    setAssignModalVisible(true);
  };

  const handleAssignModalClose = () => {
    setAssignModalVisible(false);
    setShouldOpenScheduleCalendar(false);
    dispatch(resetRiderMonthlySchedule());
  };

  const handleAssignModalProceed = () => {
    if (
      !activeAssignmentRide?.id ||
      !selectedDriverId ||
      riderMonthlyScheduleLoading
    ) {
      return;
    }

    setIsAssignmentRequested(true);
    dispatch(
      assignBookingToRiderAction(selectedDriverId, activeAssignmentRide.id),
    );
  };

  const handleAssignmentSnackbarDismiss = () => {
    dispatch(setBookingAssignmentSnackbar(false));
  };

  const handleCancelBooking = () => {
    setCancelRemark("");
    setCancelModalVisible(true);
  };

  const handleCancelModalClose = () => {
    setCancelModalVisible(false);
    setCancelRemark("");
  };

  const handleCancelProceed = () => {
    if (!data?.id || !cancelRemark.trim()) return;
    setIsCancellationRequested(true);
    dispatch(cancelBookingByAdminAction(data.id, cancelRemark.trim()));
  };

  const handleCancellationSnackbarDismiss = () => {
    dispatch(setBookingCancellationSnackbar(false));
  };

  const handleCompleteRide = () => {
    setCompleteConfirmVisible(true);
  };

  const handleCompleteModalClose = () => {
    setCompleteConfirmVisible(false);
  };

  const handleCompleteProceed = () => {
    if (!data?.id) return;
    setIsCompletionRequested(true);
    dispatch(completeRideByAdminAction(data.id));
  };

  const handleCompletionSnackbarDismiss = () => {
    dispatch(setRideCompletionSnackbar(false));
  };

  const handleViewChat = () => {
    const roomId = data?.chatRoomId;
    if (roomId)
      router.push({
        pathname:
          `${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}${Routes.TRIP_CHAT}` as any,
        params: {
          roomId,
          passengerName: data?.customerName ?? "",
          driverName: data?.riderName ?? "",
        },
      });
  };

  const handleOpenDriverSidebar = (target: AssignmentTarget) => {
    const targetRide =
      target === AssignmentTarget.ROUND_TRIP ? roundTripData : data;

    if (!isRideAssignmentAllowed(targetRide)) {
      return;
    }

    if (isDriverSidebarVisible && assignmentTarget === target) {
      resetAssignmentSelection();
      dispatch(resetRiderMonthlySchedule());
      return;
    }

    const targetAssignedDriver = buildAssignedDriver(
      targetRide,
      TranslateMessage,
    );

    setAssignmentTarget(target);
    setSelectedDriverId(targetAssignedDriver?.id ?? null);
    setSelectedDriver(targetAssignedDriver);
    setScheduleDriverId(targetAssignedDriver?.id ?? null);
    setScheduleOpenSignal(0);
    setShouldOpenScheduleCalendar(false);
    setAssignModalVisible(false);
    setIsDriverSidebarVisible(true);
    dispatch(resetRiderMonthlySchedule());
  };
  const handleScheduleCalendarOpen = (driver: IDriverForCabs) => {
    const bookingDate = activeAssignmentRide?.scheduledTime;

    if (!driver?.id || !bookingDate) {
      return;
    }

    setScheduleDriverId(driver.id);
    setShouldOpenScheduleCalendar(true);
    dispatch(fetchRiderMonthlyScheduleAction(driver.id, bookingDate));
  };

  const handleScheduleDateSelect = (driver: IDriverForCabs, date: string) => {
    if (!driver?.id || !date) {
      return;
    }

    router.push({
      pathname: `${Routes.DRIVER}${Routes.BOOKINGHISTORY}/[id]`,
      params: {
        id: String(driver.id),
        key: "RIDER",
        rideType: "INTERCITY",
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
  }, [
    riderMonthlySchedule,
    riderMonthlyScheduleLoading,
    shouldOpenScheduleCalendar,
  ]);
  const isSameAssignedRiderSelected =
    isReassignAllowed &&
    Boolean(activeAssignmentRide?.riderId) &&
    activeAssignmentRide?.riderId === selectedDriverId;

  useEffect(() => {
    const bookingDate = activeAssignmentRide?.scheduledTime;

    if (!assignModalVisible || !selectedDriverId || !bookingDate) {
      dispatch(resetRiderMonthlySchedule());
      return;
    }

    dispatch(fetchRiderMonthlyScheduleAction(selectedDriverId, bookingDate));
  }, [
    activeAssignmentRide?.scheduledTime,
    assignModalVisible,
    dispatch,
    selectedDriverId,
  ]);

  useEffect(() => {
    const bookingDate = data?.scheduledTime;

    if (!assignModalVisible || !selectedDriverId || !bookingDate) {
      dispatch(resetRiderMonthlySchedule());
      return;
    }

    dispatch(fetchRiderMonthlyScheduleAction(selectedDriverId, bookingDate));
  }, [assignModalVisible, data?.scheduledTime, dispatch, selectedDriverId]);

  useEffect(() => {
    const bookingDate = data?.scheduledTime;

    if (!assignModalVisible || !selectedDriverId || !bookingDate) {
      dispatch(resetRiderMonthlySchedule());
      return;
    }

    dispatch(fetchRiderMonthlyScheduleAction(selectedDriverId, bookingDate));
  }, [assignModalVisible, data?.scheduledTime, dispatch, selectedDriverId]);

  function renderMap() {
    if (!googlePlaceApiKey) {
      return null;
    }

    const isRoundTripView = showRoundTripOnMap && roundTripData;
    const sourceData = isRoundTripView ? roundTripData : data;

    const pickupLat = sourceData?.sourceLat ?? 20.5937;
    const pickupLng = sourceData?.sourceLong ?? 78.9629;
    const destLat = sourceData?.destinationLat ?? 0;
    const destLng = sourceData?.destinationLong ?? 0;

    const activeStopMarkers = isRoundTripView
      ? (roundTripData?.stops ?? [])
          .filter((stop) => stop.stopType === "MIDDLE_POINT")
          .sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0))
          .map((stop) => ({
            latitude: stop.latitude,
            longitude: stop.longitude,
          }))
      : stopMarkers;

    return (
      <View style={layout.mapContainer}>
        {/* <MapComponentWeb
          initialRegion={{ latitude: pickupLat, longitude: pickupLng }}
          zoom={11}
          googleApiKey={googlePlaceApiKey}
        >
          <Marker
            position={{ lat: pickupLat, lng: pickupLng }}
            icon={{ url: pickupIcon, scaledSize: { width: 24, height: 24 } as any }}
          />
          {activeStopMarkers.map((stop, idx) => (
            <Marker
              key={`stop-${idx}`}
              position={{ lat: stop.latitude, lng: stop.longitude }}
              icon={{ url: stopIcon, scaledSize: { width: 24, height: 24 } as any }}
            />
          ))}
          <Marker
            position={{ lat: destLat, lng: destLng }}
            icon={{ url: destinationIcon, scaledSize: { width: 24, height: 24 } as any }}
          />
          <Polyline
            path={generateCurvedPolyline(
              { latitude: pickupLat, longitude: pickupLng },
              { latitude: destLat, longitude: destLng },
              0.45, 80
            ).map(p => ({ lat: p.latitude, lng: p.longitude }))}
            options={{
              strokeColor: 'red',
              strokeOpacity: 0,
              strokeWeight: 3,
              geodesic: false,
              icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 }, offset: '0', repeat: '9px' }],
            }}
          />
        </MapComponentWeb> */}
      </View>
    );
  }

  function renderUserDetails() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        <View
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
            layout.flexWrap,
          ]}
        >
          {data?.orderStatus !== IBookingType.SCHEDULED &&
          data?.orderStatus !== IBookingType.OPEN &&
          data?.orderStatus !== IBookingType.REQUESTED &&
          data?.riderName ? (
            <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
              <RenderImage
                uri={data?.riderImage ?? ""}
                style={[tripStyle.userImg]}
              />
              <View>
                <Typography variant="subTitle" spacing={{ bottom: 5 }}>
                  {data?.riderName}
                </Typography>
                <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
                  <Typography variant="body">
                    {" "}
                    {TranslateMessage(
                      "Admin.Delivery.App.Booking.Ride.Status.Ride.DriverId",
                    )}{" "}
                    {data?.riderId}
                  </Typography>
                  <Typography
                    variant="textLabel"
                    align="center"
                    style={[
                      layout.statusMessage,
                      {
                        color: data?.activeStatus
                          ? theme.colors.textSuccessDark
                          : theme.colors.textErrorDark,
                        borderColor: data?.activeStatus
                          ? theme.colors.borderSuccessInverse
                          : theme.colors.borderErrorInverse,
                      },
                    ]}
                  >
                    {data?.activeStatus
                      ? TranslateMessage(
                          "Admin.Delivery.App.UserManagementList.Filter.Active",
                        )
                      : TranslateMessage(
                          "Admin.Delivery.App.UserManagementList.Filter.Inactive",
                        )}
                  </Typography>
                </View>
                {data?.riderRatings ? (
                  <View style={[layout.rowNoGap, layout.rowGap5]}>
                    {/* <CustomRating  rating={4.5} imageSize={15}/> */}
                    <Icon
                      name="star"
                      size={18}
                      color={theme.colors.iconWarningDark}
                    />
                    <Typography
                      variant="textLabel"
                      style={layout.textNeutral}
                      spacing={{ top: 2 }}
                    >
                      {data?.riderRatings}
                    </Typography>
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <View />
          )}
          <View style={layout.flexColItem}>
            <View style={[layout.rowNoGap, layout.rowGapWrapEnd]}>
              {data?.chatRoomId && (
                <Pressable
                  onPress={handleViewChat}
                  style={[
                    button.btnBase,
                    button.btnPrimary,
                    tripStyle.chatButton,
                  ]}
                >
                  <Icon
                    name="message"
                    size={14}
                    color={theme.colors.iconInverse}
                  />
                  <Typography
                    variant="btnText"
                    color={theme.colors.textInverse}
                    fontWeight="medium"
                    style={layout.noHorizontalPadding}
                  >
                    {TranslateMessage("Admin.Delivery.App.View.Chat")}
                  </Typography>
                </Pressable>
              )}
              {tickets.length > 0 &&
                data?.orderStatus !== IBookingType.CANCELLED &&
                data?.orderStatus !== IBookingType.RIDE_COMPLETED &&
                data?.orderStatus !== IBookingType.REJECTED &&
                data?.orderStatus !== IBookingType.NO_RIDER_FOUND && (
                  <Pressable
                    onPress={handleCancelBooking}
                    style={[button.btnBase, tripStyle.cancelButton]}
                  >
                    <Typography
                      variant="btnText"
                      color={theme.colors.textErrorDark}
                      fontWeight="medium"
                      style={layout.noHorizontalPadding}
                    >
                      {TranslateMessage("Admin.Delivery.App.Cancel.Booking")}
                    </Typography>
                  </Pressable>
                )}
              {/* {(tickets.length > 0 &&
                data?.orderStatus !== IBookingType.CANCELLED &&
                data?.orderStatus !== IBookingType.RIDE_COMPLETED &&
                data?.orderStatus !== IBookingType.REJECTED) && (
                <Pressable
                  onPress={handleCompleteRide}
                  style={[button.btnBase, { backgroundColor: theme.colors.surfaceSuccessInverse, borderColor: theme.colors.borderSuccessInverse, borderWidth: 1, borderRadius: theme.roundness.xxl, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.sm }]}
                >
                  <Typography variant='btnText' color={theme.colors.textInverse} fontWeight='medium' style={layout.noHorizontalPadding}>
                    {TranslateMessage('Admin.Delivery.App.Complete.Ride')}
                  </Typography>
                </Pressable>
              )} */}
              <Pressable
                style={[
                  button.btn,
                  tripStyle.statusButton,
                  {
                    backgroundColor:
                      bookingStatusAppearance?.backgroundColor ??
                      theme.colors.surfaceMedium,
                    borderColor:
                      bookingStatusAppearance?.borderColor ??
                      theme.colors.borderMedium,
                  },
                ]}
              >
                <Typography
                  variant="btnText"
                  color={
                    bookingStatusAppearance?.textColor ?? theme.colors.textBody
                  }
                  fontWeight="medium"
                  style={layout.noHorizontalPadding}
                >
                  {TranslateMessage(
                    bookingStatusLabel[
                      data?.orderStatus as IBookingType
                    ] as string,
                  )}
                </Typography>
              </Pressable>
            </View>
            <View style={[layout.rowNoGap, layout.rowGap10End]}>
              <Typography
                variant="subHeading"
                align="center"
                spacing={{ top: 5 }}
              >
                {currencyFormate(data?.totalAmount ?? 0, data?.currency ?? "")}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    );
  }
  function renderDestination() {
    const mainLocationPoints = buildRideLocationPoints(data, (date) =>
      convertUTCDateToLocalDate(date ?? undefined, "hh:mm A"),
    );
    const roundTripLocationPoints = buildRideLocationPoints(
      roundTripData,
      (date) => convertUTCDateToLocalDate(date ?? undefined, "hh:mm A"),
    );
    const locationPoints =
      showRoundTripOnMap && shouldShowRoundTripCard
        ? roundTripLocationPoints
        : mainLocationPoints;
    const showToggle = shouldShowRoundTripCard && googlePlaceApiKey;

    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        {locationPoints.map((point, index) => {
          const isLastItem = index === locationPoints.length - 1;
          const isStopPoint = point.type === "stop";
          const showDividerWithIcon =
            !isLastItem && point.type === "pickup" && showToggle;
          const showPlainDivider = !isLastItem && !showDividerWithIcon;

          return (
            <View key={point.key}>
              {/* Row */}
              <View
                style={[tripStyle.locationItem, layout.locationItemPadding]}
              >
                <View style={tripStyle.locationMarkerWrap}>
                  {point.type === "pickup" ? (
                    <Icon
                      name="pickup"
                      size={28}
                      color={theme.colors.iconSuccessDark}
                    />
                  ) : point.type === "drop" ? (
                    <Icon
                      name="mapsArrowDiagonal"
                      size={28}
                      color={theme.colors.iconErrorDark}
                    />
                  ) : (
                    <View style={tripStyle.locationMarkerBadge}>
                      <Typography color={theme.colors.textInverse}>
                        {point.stopNumber}
                      </Typography>
                    </View>
                  )}
                </View>
                <View style={layout.centeredFlexOne}>
                  {point.time ? (
                    <Typography variant="body">{point.time}</Typography>
                  ) : null}
                  <Typography
                    variant="body"
                    spacing={isStopPoint ? undefined : { top: 5 }}
                    style={layout.subtitleText}
                  >
                    {point.title}
                  </Typography>
                </View>
              </View>

              {/* Divider with centered toggle icon */}
              {showDividerWithIcon ? (
                <View style={layout.rowNoGap}>
                  <View style={layout.markerColumn}>
                    <View style={layout.shortMarkerConnector} />
                  </View>
                  <View style={layout.horizontalDivider} />
                  <Pressable
                    onPress={() => setShowRoundTripOnMap((prev) => !prev)}
                    style={layout.roundTripBtn}
                  >
                    <Icon
                      name="dataTransferVertical"
                      size={14}
                      color={theme.colors.iconInverse}
                    />
                    <Typography
                      variant="textLabel"
                      fontWeight="semiBold"
                      color={theme.colors.textInverse}
                    >
                      {showRoundTripOnMap
                        ? TranslateMessage("Admin.Delivery.App.Show.Main.Trip")
                        : TranslateMessage(
                            "Admin.Delivery.App.Show.Round.Trip",
                          )}
                    </Typography>
                  </Pressable>
                </View>
              ) : showPlainDivider ? (
                <View style={layout.rowOnly}>
                  <View style={layout.markerColumn}>
                    <View style={layout.longMarkerConnector} />
                  </View>
                  <View
                    style={[
                      layout.horizontalDivider,
                      layout.horizontalDividerOffset,
                    ]}
                  />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }

  function renderRideAssignmentAction(
    rideDetails: IPastRideListData | null | undefined,
    target: AssignmentTarget,
  ) {
    if (!isRideAssignmentAllowed(rideDetails)) {
      return null;
    }

    const isRideReassignFlow = isRideReassignAllowed(rideDetails);

    return (
      <Pressable
        onPress={() => handleOpenDriverSidebar(target)}
        style={[button.btnBase, button.btnPrimary, layout.reassignButton]}
      >
        <Icon
          name={isRideReassignFlow ? "refresh" : "steering"}
          size={14}
          color={theme.colors.iconInverse}
        />
        <Typography
          variant="textLabel"
          fontWeight="semiBold"
          color={theme.colors.textInverse}
        >
          {TranslateMessage(
            isRideReassignFlow
              ? "Admin.Delivery.App.Reassign.Driver"
              : "Admin.Delivery.App.Assign.Ride",
          )}
        </Typography>
      </Pressable>
    );
  }

  function renderIntercityRideInfoCard(
    rideDetails: IPastRideListData | null | undefined,
    title: string,
    target: AssignmentTarget,
  ) {
    if (rideDetails?.rideType !== RideType.INTERCITY) {
      return null;
    }

    const requestedCabType = getTranslatedVehicleCategory(
      rideDetails?.vehicleCategory || rideDetails?.vehicleName,
      TranslateMessage,
    );
    const requestedDate = rideDetails?.scheduledTime
      ? formatBookingDateTime(rideDetails.scheduledTime)
      : formatBookingDateTime(rideDetails?.orderTime);
    const customerName = rideDetails?.customerName || "-";
    const customerPhoneNumber = rideDetails?.phoneNumber || "-";
    const assignedDriverLabel = rideDetails?.riderName
      ? `${rideDetails.riderName}${rideDetails.riderId ? ` (#${rideDetails.riderId})` : ""}`
      : "-";
    const rideStatusAppearance = rideDetails?.orderStatus
      ? getBookingStatusAppearance(
          rideDetails.orderStatus as IBookingType,
          theme,
        )
      : null;

    return (
      <View
        style={[layout.cardBox, layout.cardRoundNess, layout.cardPadding20]}
      >
        <View
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
            layout.flexWrap,
          ]}
        >
          <Typography
            variant="subTitle"
            spacing={{ top: 5 }}
            style={layout.subtitleText}
          >
            {title}
          </Typography>
          {renderRideAssignmentAction(rideDetails, target)}
        </View>
        <View style={[layout.flexColItem, layout.marginTopMd]}>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Requested.Cab.Type")}
            </Typography>
            <Typography variant="body">{requestedCabType}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.Customer.Table.Customer.Name",
              )}
            </Typography>
            <Typography variant="body">{customerName}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.Customer.Table.Phone.Number",
              )}
            </Typography>
            <Typography variant="body">{customerPhoneNumber}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Requested.Ride.Date")}
            </Typography>
            <Typography
              variant="body"
              fontWeight="semiBold"
              color={theme.colors.textLinkDark}
              style={layout.linkBadge}
            >
              {requestedDate || "-"}
            </Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Driver")}
            </Typography>
            <Typography variant="body">{assignedDriverLabel}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.RequestManagementList.Table.Status",
              )}
            </Typography>
            <Typography
              variant="body"
              fontWeight="semiBold"
              color={rideStatusAppearance?.textColor ?? theme.colors.textBody}
              style={[
                layout.linkBadge,
                {
                  backgroundColor:
                    rideStatusAppearance?.backgroundColor ??
                    theme.colors.surfaceMedium,
                  borderColor:
                    rideStatusAppearance?.borderColor ??
                    theme.colors.borderMedium,
                },
              ]}
            >
              {TranslateMessage(
                bookingStatusLabel[
                  rideDetails?.orderStatus as IBookingType
                ] as string,
              )}
            </Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Total.Payable")}
            </Typography>
            <Typography variant="body" fontWeight="semiBold">
              {currencyFormate(
                rideDetails?.totalAmount ?? 0,
                rideDetails?.currency ?? "",
              )}
            </Typography>
          </View>
        </View>
      </View>
    );
  }

  function renderRoundTripDestination() {
    if (!roundTripData) return null;

    const locationPoints = buildRideLocationPoints(roundTripData, (date) =>
      convertUTCDateToLocalDate(date ?? undefined, "hh:mm A"),
    );

    return (
      <View style={tripStyle.locationStack}>
        {locationPoints.map((point, index) => {
          const isLastItem = index === locationPoints.length - 1;
          const isStopPoint = point.type === "stop";

          return (
            <View key={point.key} style={tripStyle.locationItem}>
              <View style={tripStyle.locationMarkerWrap}>
                {point.type === "pickup" ? (
                  <Icon
                    name="pickup"
                    size={28}
                    color={theme.colors.iconSuccessDark}
                  />
                ) : point.type === "drop" ? (
                  <Icon
                    name="mapsArrowDiagonal"
                    size={28}
                    color={theme.colors.iconErrorDark}
                  />
                ) : (
                  <View style={tripStyle.locationMarkerBadge}>
                    <Typography color={theme.colors.textInverse}>
                      {point.stopNumber}
                    </Typography>
                  </View>
                )}
                {!isLastItem ? (
                  <View style={tripStyle.locationMarkerConnector} />
                ) : null}
              </View>
              <View
                style={[
                  tripStyle.locationBody,
                  isLastItem && tripStyle.locationBodyLast,
                ]}
              >
                {point.time ? (
                  <View style={tripStyle.locationMetaRow}>
                    <Typography variant="body">{point.time}</Typography>
                  </View>
                ) : null}
                <View style={tripStyle.destinationRow}>
                  <Typography
                    variant="body"
                    spacing={isStopPoint ? undefined : { top: 5 }}
                    style={layout.subtitleText}
                  >
                    {point.title}
                  </Typography>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderRoundTripRideInfo() {
    if (!shouldShowRoundTripCard) {
      return null;
    }

    if (roundTripLoading) {
      return (
        <View style={[layout.cardBox, layout.cardRoundNess, layout.p_20]}>
          <Loader loading={true} />
        </View>
      );
    }

    if (roundTripError) {
      return renderErrorMsgSection(roundTripError);
    }

    if (roundTripData?.rideType !== RideType.INTERCITY) {
      return null;
    }

    const requestedCabType = getTranslatedVehicleCategory(
      roundTripData?.vehicleCategory || roundTripData?.vehicleName,
      TranslateMessage,
    );
    const requestedDate = roundTripData?.scheduledTime
      ? formatBookingDateTime(roundTripData.scheduledTime)
      : formatBookingDateTime(roundTripData?.orderTime);
    const customerName = roundTripData?.customerName || "-";
    const customerPhoneNumber = roundTripData?.phoneNumber || "-";
    const assignedDriverLabel = roundTripData?.riderName
      ? `${roundTripData.riderName}${roundTripData.riderId ? ` (#${roundTripData.riderId})` : ""}`
      : "-";
    const rideStatusAppearance = roundTripData?.orderStatus
      ? getBookingStatusAppearance(
          roundTripData.orderStatus as IBookingType,
          theme,
        )
      : null;

    return (
      <View
        style={[layout.cardBox, layout.cardRoundNess, layout.cardPadding20]}
      >
        {/* Header */}
        <View
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
            layout.flexWrap,
          ]}
        >
          <Typography
            variant="subTitle"
            spacing={{ top: 5 }}
            style={layout.subtitleText}
          >
            {TranslateMessage("Admin.Delivery.App.Round.Trip.Details")}
          </Typography>
          {renderRideAssignmentAction(
            roundTripData,
            AssignmentTarget.ROUND_TRIP,
          )}
        </View>

        {/* Info rows */}
        <View style={[layout.flexColItem, layout.marginTopMd]}>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Requested.Cab.Type")}
            </Typography>
            <Typography variant="body">{requestedCabType}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.Customer.Table.Customer.Name",
              )}
            </Typography>
            <Typography variant="body">{customerName}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.Customer.Table.Phone.Number",
              )}
            </Typography>
            <Typography variant="body">{customerPhoneNumber}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Requested.Ride.Date")}
            </Typography>
            <Typography
              variant="body"
              fontWeight="semiBold"
              color={theme.colors.textLinkDark}
              style={layout.linkBadge}
            >
              {requestedDate || "-"}
            </Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Driver")}
            </Typography>
            <Typography variant="body">{assignedDriverLabel}</Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage(
                "Admin.Delivery.App.RequestManagementList.Table.Status",
              )}
            </Typography>
            <Typography
              variant="body"
              fontWeight="semiBold"
              color={rideStatusAppearance?.textColor ?? theme.colors.textBody}
              style={[
                layout.linkBadge,
                {
                  backgroundColor:
                    rideStatusAppearance?.backgroundColor ??
                    theme.colors.surfaceMedium,
                  borderColor:
                    rideStatusAppearance?.borderColor ??
                    theme.colors.borderMedium,
                },
              ]}
            >
              {TranslateMessage(
                bookingStatusLabel[
                  roundTripData?.orderStatus as IBookingType
                ] as string,
              )}
            </Typography>
          </View>
          <View
            style={[
              layout.flexDirectionRow,
              layout.alignItemCenter,
              layout.justifyBetween,
            ]}
          >
            <Typography variant="body" fontWeight="medium">
              {TranslateMessage("Admin.Delivery.App.Total.Payable")}
            </Typography>
            <Typography variant="body" fontWeight="semiBold">
              {currencyFormate(
                roundTripData?.totalAmount ?? 0,
                roundTripData?.currency ?? "",
              )}
            </Typography>
          </View>
        </View>
      </View>
    );
  }

  function renderBilling() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess, layout.p_20]}>
        <Typography
          variant="subTitle"
          spacing={{ top: 5 }}
          style={layout.subtitleText}
        >
          {TranslateMessage("Admin.Delivery.App.Bill.Details")}
        </Typography>
        <View style={tripStyle.billDetail}>
          <List.Section>
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Trip.Title")}
              right={() => (
                <Typography variant="body">
                  {currencyFormate(
                    data?.rideSubTotal ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              contentStyle={tripStyle.listItem}
              titleStyle={[typographyStyle.body, layout.mediumFontFamily]}
            />
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Waiting.Charges")}
              right={() => (
                <Typography variant="body">
                  {currencyFormate(
                    data?.waitingCharges ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              contentStyle={tripStyle.listItem}
              titleStyle={[typographyStyle.body, layout.mediumFontFamily]}
            />
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Cancellation.Charge")}
              right={() => (
                <Typography variant="body">
                  {currencyFormate(
                    data?.outstandingDues ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              contentStyle={tripStyle.listItem}
              titleStyle={[typographyStyle.body, layout.mediumFontFamily]}
            />
          </List.Section>
          <Divider style={[tripStyle.divider, layout.zeroVerticalMargin]} />
          <List.Section>
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Total.Bill")}
              right={() => (
                <Typography variant="subTitle">
                  {currencyFormate(
                    data?.totalAmount ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              titleStyle={typographyStyle.subTitle}
              contentStyle={layout.noLeftPadding}
            />
            <Typography variant="textLabel">
              {TranslateMessage("Admin.Delivery.App.Includes.Taxes")}
            </Typography>
          </List.Section>
        </View>
      </View>
    );
  }

  function renderPayment() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess, layout.p_20]}>
        <View style={tripStyle.billDetail}>
          <List.Section>
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Total.Payable")}
              right={() => (
                <Typography variant="subTitle">
                  {currencyFormate(
                    data?.totalAmount ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              titleStyle={typographyStyle.subTitle}
              contentStyle={layout.noLeftPadding}
            />
            <List.Item
              title={TranslateMessage("Admin.Delivery.App.Payment.Title")}
              style={[tripStyle.listItem, layout.paddingTop20]}
              titleStyle={typographyStyle.subTitle}
              contentStyle={layout.noLeftPadding}
            />
            <List.Item
              title={data?.paymentMethod}
              right={() => (
                <Typography variant="body">
                  {currencyFormate(
                    data?.totalAmount ?? 0,
                    data?.currency ?? "",
                  )}
                </Typography>
              )}
              style={tripStyle.listItem}
              titleStyle={typographyStyle.body}
              contentStyle={layout.noLeftPadding}
            />
          </List.Section>
        </View>
      </View>
    );
  }
  function renderErrorMsgSection(error: string) {
    return <ErrorMessageContainer message={error} />;
  }
  function renderInvoice() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess, layout.p_20]}>
        <Pressable
          style={[
            layout.flexDirectionRow,
            layout.alignItemCenter,
            layout.justifyBetween,
          ]}
        >
          <Typography variant="subTitle" fontWeight="regular">
            {TranslateMessage("Admin.Delivery.App.Get.invoice.copy")}
          </Typography>
          <Icon name="chevronRight" size={20} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }
  function renderTicketRaised() {
    return (
      <View style={[layout.cardBox, layout.cardRoundNess]}>
        <View style={layout.padding_10}>
          <Typography variant="subTitle" fontWeight="bold">
            {TranslateMessage("Admin.Delivery.App.Ticket.Raised")}
          </Typography>
          {tickets.map((ticket, index) => (
            <View key={ticket.id}>
              <Pressable
                style={[
                  layout.flexDirectionRow,
                  layout.alignItemCenter,
                  layout.justifyBetween,
                  layout.pV_10,
                ]}
                onPress={() => {
                  router.push(`${Routes.TICKET}/${ticket.id}`);
                }}
              >
                <View>
                  <View style={layout.flexDirectionRow}>
                    <Typography variant="body" fontWeight="medium">
                      {TranslateMessage(
                        "Admin.Delivery.App.Ticket.Table.TicketId",
                      )}{" "}
                      :
                    </Typography>
                    <Typography variant="body">#{ticket.id}</Typography>
                  </View>
                  <View style={layout.flexDirectionRow}>
                    <Typography variant="body" fontWeight="medium">
                      {TranslateMessage("Admin.Delivery.App.Reported.From")} :
                    </Typography>
                    <Typography variant="body">
                      {TranslateMessage(
                        ticketTarget[ticket.userRole as IUSERROLE] as string,
                      )}
                    </Typography>
                  </View>
                  <View style={layout.flexDirectionRow}>
                    <Typography variant="body" fontWeight="medium">
                      {TranslateMessage(
                        "Admin.Delivery.App.Ticket.Table.TicketIssueType",
                      )}{" "}
                      :
                    </Typography>
                    <Typography style={layout.marginTop2}>
                      {getTicketLabelByKey(ticket.ticketType)}
                    </Typography>
                  </View>
                </View>
                <Icon
                  name="chevronRight"
                  size={20}
                  color={theme.colors.iconBase}
                />
              </Pressable>
              {index !== tickets.length - 1 && <View style={layout.divider} />}
            </View>
          ))}
        </View>
      </View>
    );
  }
  function renderAssignRideModal() {
    const selectedBookingDate = getScheduledDate(
      activeAssignmentRide?.scheduledTime,
    );
    const hasScheduleConflict = Boolean(
      selectedBookingDate &&
      riderMonthlySchedule?.upcomingScheduledTimes?.some(
        (scheduledTime) =>
          getScheduledDate(scheduledTime) === selectedBookingDate,
      ),
    );

    return (
      <AssignRideModal
        visible={assignModalVisible}
        onCancel={handleAssignModalClose}
        onProceed={handleAssignModalProceed}
        isReassignFlow={isReassignAllowed}
        bookingId={activeAssignmentRide?.id}
        riderId={selectedDriver?.id}
        riderName={selectedDriver?.firstName}
        riderImage={selectedDriver?.profileUrl ?? null}
        scheduledTime={activeAssignmentRide?.scheduledTime}
        hasScheduleConflict={hasScheduleConflict}
        scheduleLoading={riderMonthlyScheduleLoading}
        assignLoading={assignLoading}
        scheduleError={riderMonthlyScheduleError}
      />
    );
  }

  const selectedBookingDate = getScheduledDate(
    activeAssignmentRide?.scheduledTime,
  );

  const scheduleCalendarDate = getScheduledDate(
    activeAssignmentRide?.scheduledTime,
  );
  const scheduleMarkedDates = (
    riderMonthlySchedule?.upcomingScheduledTimes || []
  ).reduce<
    Record<
      string,
      { selected: boolean; marked: boolean; selectedColor: string }
    >
  >((acc, scheduledTime) => {
    const date = getScheduledDate(scheduledTime);

    if (date) {
      acc[date] = {
        selected: true,
        marked: true,
        selectedColor: theme.colors.textErrorDark,
      };
    }

    return acc;
  }, {});
  const headerDate =
    data?.rideType === RideType.INTERCITY
      ? formatBookingDateTime(data?.scheduledTime ?? data?.orderTime)
      : data?.scheduledTime
        ? formatBookingDateTime(data?.scheduledTime)
        : formatToDayMonthTime(data?.orderTime ?? "");

  return (
    <>
      <Portal>
        <Loader loading={loading} styles={layout.loader} />
      </Portal>
      <View style={layout.newBookingContainer}>
        <View style={layout.flexOne}>
          <View
            style={[
              styles.header,
              layout.paddinghor17,
              layout.headerVerticalPadding,
              { backgroundColor: theme.colors.surfaceMedium },
            ]}
          >
            <Typography variant="subTitle" color={theme.colors.textBody}>
              {headerDate}
            </Typography>
            <Typography
              variant="body"
              color={theme.colors.textBody}
              spacing={{ top: 5 }}
            >
              {TranslateMessage(
                "Admin.Delivery.App.RequestManagementList.Table.Booking.ID",
              )}{" "}
              : {id}
            </Typography>
          </View>
          <ScrollView>
            {renderMap()}
            <View style={[layout.paddinghor17, layout.paddingTop26]}>
              {renderUserDetails()}
              {renderDestination()}
              {renderIntercityRideInfoCard(
                data,
                TranslateMessage("Admin.Delivery.App.Intercity.Ride.Details"),
                AssignmentTarget.MAIN,
              )}
              {renderRoundTripRideInfo()}
              {renderBilling()}
              {renderPayment()}
              {/* {renderInvoice()} */}
              {tickets?.length > 0 ? renderTicketRaised() : null}
            </View>
            {renderErrorMsgSection(error)}
          </ScrollView>
        </View>
        {isAssignmentAllowed && isDriverSidebarVisible ? (
          <View style={layout.driverListContainer}>
            <View
              style={[
                layout.cardBox,
                layout.tableContainer,
                layout.driverInnerConatiner,
              ]}
            >
              <Typography
                variant="subTitle"
                spacing={{ bottom: theme.spacing.md }}
              >
                {TranslateMessage(
                  assignmentTarget === AssignmentTarget.ROUND_TRIP
                    ? "Admin.Delivery.App.Round.Trip.Driver.Assignment"
                    : "Admin.Delivery.App.Driver.Assignment",
                )}
              </Typography>
              <DriverListWithSearch
                onDriverSelect={handleDriverSelectionChange}
                selectedDriverId={selectedDriverId}
                pinnedDriver={selectedDriver}
                showHeader={true}
                pageSize={10}
                showCheckboxes={true}
                selectedCheckboxDriverId={selectedDriverId}
                onCheckboxChange={handleDriverSelectionChange}
                onAssignPress={handleAssignRide}
                isAssignDisabled={
                  !selectedDriverId || isSameAssignedRiderSelected
                }
                assignButtonTitle={TranslateMessage(
                  isReassignAllowed
                    ? "Admin.Delivery.App.Reassign.Driver"
                    : "Admin.Delivery.App.Assign.Ride",
                )}
                onSchedulePress={handleScheduleCalendarOpen}
                scheduleCalendarDate={scheduleCalendarDate}
                scheduleMarkedDates={scheduleMarkedDates}
                scheduleLoading={riderMonthlyScheduleLoading}
                scheduleError={riderMonthlyScheduleError}
                scheduleDriverId={scheduleDriverId}
                scheduleOpenSignal={scheduleOpenSignal}
                selectedRideDate={selectedBookingDate}
                onScheduleDateSelect={handleScheduleDateSelect}
              />
            </View>
          </View>
        ) : null}
      </View>
      {renderAssignRideModal()}
      <CancelBookingModal
        visible={cancelModalVisible}
        cancelRemark={cancelRemark}
        cancellationReasons={cancellationReasons}
        loading={cancelLoading}
        error={cancellationError}
        onCancelRemarkChange={setCancelRemark}
        onSelectReason={setCancelRemark}
        onClose={handleCancelModalClose}
        onProceed={handleCancelProceed}
      />
      <CustomModal
        visible={completeConfirmVisible}
        dismissOutside={true}
        title={TranslateMessage("Admin.Delivery.App.Complete.Ride")}
        bodyContent={[]}
        onCancel={handleCompleteModalClose}
        onSave={handleCompleteProceed}
        isConfirmDisabled={completeLoading}
        confirmBtnTitle={TranslateMessage("Admin.Delivery.App.Yes")}
        cancelBtnTitle={TranslateMessage("Admin.Delivery.App.CancelBtnTitle")}
        dialogStyle={{ maxWidth: 500, width: "100%" }}
      >
        <View>
          <Typography>
            {TranslateMessage("Admin.Delivery.App.Complete.Ride.Confirmation")}
          </Typography>
        </View>
      </CustomModal>
      <CustomSnackbar
        visible={assignmentSnackbarVisible}
        message={
          assignmentError ||
          TranslateMessage("Admin.Delivery.App.Booking.Assign.Rider.Success")
        }
        onDismiss={handleAssignmentSnackbarDismiss}
        type={assignmentError ? SnackbarType.WARNING : SnackbarType.SUCCESS}
      />
      <CustomSnackbar
        visible={cancellationSnackbarVisible && !cancellationError}
        message={TranslateMessage("Admin.Delivery.App.Booking.Cancel.Success")}
        onDismiss={handleCancellationSnackbarDismiss}
        type={SnackbarType.SUCCESS}
      />
      <CustomSnackbar
        visible={completionSnackbarVisible}
        message={
          completionError ||
          TranslateMessage("Admin.Delivery.App.Complete.Ride.Success")
        }
        onDismiss={handleCompletionSnackbarDismiss}
        type={completionError ? SnackbarType.WARNING : SnackbarType.SUCCESS}
      />
      <Portal>
        <Loader
          loading={riderMonthlyScheduleLoading && !assignModalVisible}
          styles={layout.loader}
        />
      </Portal>
    </>
  );
};
export default TripDetailsContainer;
