import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Tooltip } from 'react-native-paper';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { getBookingStatusAppearance, IBookingType as IBookingStatusType } from 'src/components/Booking/Table/BookingListTableUtil';
import { getTranslatedVehicleCategory, IBooking } from 'src/components/NewBooking/NewBookingListUtil';
import { BookingListTableProps, bookingStatusLabel, IBookingListWithActions, IBookingType } from 'src/components/NewBooking/Table/NewBookingListTableUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DELAY_TOOLTIP } from 'src/constants';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';

const NewBookingListTable = ({
  BookingListData,
  page,
  filter,
  handleSort,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  onCancelBooking,
  onUnassignRider,
  selectedBookingId,
  onSelectBooking,
  error = '',
}: BookingListTableProps) => {

  const { t: TranslateMessage } = useTranslation();
  const tablestyle = useTableStyle();
  const formStyle = useFormStyle();
  const {theme} = useAppTheme();
  const layout = useLayoutStyle();
  const numberOfPages = Math.ceil(BookingListData.total / DEFAULT_TABLE_SIZE);
  const shouldShowSelectionColumn =
    Boolean(onSelectBooking) &&
    (
      filter.rideStatus === IBookingType.REQUESTED ||
      filter.rideStatus === IBookingType.RIDER_ASSIGNED
    );
  const shouldShowCancelAction =
    !filter.rideStatus ||
    filter.rideStatus === IBookingType.REQUESTED ||
    filter.rideStatus === IBookingType.RIDER_ASSIGNED;
  const shouldShowActionsColumn = Boolean(onCancelBooking) && shouldShowCancelAction && !isDashboard;

  function renderBookinId(item: IBooking) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.id}
        </Text>
      </View>
    );
  }

  function renderCustomerName(item: IBooking) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.customerName}
        </Text>
      </View>
    );
  }
  function renderSoureName(item: IBooking) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.sourceName}
        </Text>
      </View>
    );
  }

  function renderRoundTripIcon(item: IBooking) {
    if (!item.isRoundTrip) return null;
    return (
      <View style={[layout.alignItemsCenter,layout.justifyCenter]}>
        <Icon name='dataTransfer' size={20} color={theme.colors.iconBase} />
      </View>
    );
  }

  function renderDestinationName(item: IBooking) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.destinationName}
        </Text>
      </View>
    );
  }
  function renderOrderStatus(item: IBooking) {
    const statusAppearance = getBookingStatusAppearance(
      item.orderStatus as IBookingStatusType,
      theme
    );

    return (
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={[layout.statusContainer,{
            color: statusAppearance.textColor,
            backgroundColor: statusAppearance.backgroundColor,
            borderColor: statusAppearance.borderColor,
          }]}
        >
          {TranslateMessage(bookingStatusLabel[item.orderStatus as IBookingType] as string)}
        </Text>
      </View>
    );
  }

  function renderRequestedRideDate(item: IBooking) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 170 }}>
          {item.scheduledTime ? formatToDateMonthYear(item.scheduledTime) : '-'}
        </Text>
      </View>
    );
  }

  function renderCabType(item: IBooking) {
    const translatedVehicleCategory = getTranslatedVehicleCategory(
      item.vehicleCategory,
      TranslateMessage
    );

    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {translatedVehicleCategory}
        </Text>
      </View>
    );
  }


  function renderViewDetails(
    id: string,
    title: string,
    onPress: (id: string, title: string) => () => void
  ) {
    return (
      <Tooltip title={TranslateMessage('Admin.Delivery.App.ViewDetails')} leaveTouchDelay={DELAY_TOOLTIP}>
        <Pressable
          style={tablestyle.actionContainer}
          onPress={onPress(id, title)}
        >
          <Icon name='infoOutline' color={theme.colors.iconBase} size={25} />
        </Pressable>
      </Tooltip>
    );
  }

  function renderCancelAction(item: IBooking) {
    if (!shouldShowCancelAction) {
      return null;
    }

    const canCancelBooking =
      item.orderStatus === IBookingType.REQUESTED ||
      item.orderStatus === IBookingType.RIDER_ASSIGNED ||
      item.orderStatus === IBookingType.ARRIVED_AT_PICKUP_LOCATION ||
      item.orderStatus === IBookingType.IN_PROGRESS 

    if (!canCancelBooking) {
      return null;
    }

    return (
      <Tooltip title={TranslateMessage('Admin.Delivery.App.Cancel.Booking')} leaveTouchDelay={DELAY_TOOLTIP}>
        <Pressable
          style={tablestyle.actionContainer}
          onPress={() => onCancelBooking?.(item)}
        >
          <Icon name='cancel' color={theme.colors.iconErrorDark} size={24} />
        </Pressable>
      </Tooltip>
    );
  }

  function renderUnassignAction(item: IBooking) {
    const shouldShowUnassignAction =
      filter.rideStatus === IBookingType.RIDER_ASSIGNED &&
      item.orderStatus === IBookingType.RIDER_ASSIGNED;

    if (!shouldShowUnassignAction || !item.riderId || !onUnassignRider) {
      return null;
    }

    return (
      <Tooltip title={TranslateMessage('Admin.Delivery.App.Unassign.Rider')} leaveTouchDelay={DELAY_TOOLTIP}>
        <Pressable style={tablestyle.actionContainer} onPress={() => onUnassignRider(item)} >
          <Icon name='removeUser' color={theme.colors.iconErrorDark} size={24} />
        </Pressable>
      </Tooltip>
    );
  }

  const renderBookingRowDetails = (id?: string | number) => {
    return () => {
      if (!id) return;
      router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}`);
    };
  };
  function canSelectBooking(item: IBooking) {
    return (
      item.orderStatus === IBookingType.REQUESTED ||
      item.orderStatus === IBookingType.RIDER_ASSIGNED
    );
  }
  function renderSelection(item: IBooking) {
    if (!onSelectBooking) {
      return null;
    }

    if (!canSelectBooking(item)) {
      return null;
    }

    const isSelected = selectedBookingId === item.id;

    return (
      <View style={[layout.alignItemsCenter,layout.justifyCenter]}>
        <Pressable
          onPress={() => onSelectBooking(item.id)}
          style={[
            formStyle.checkBox,
            isSelected && formStyle.checkBoxChecked,
          ]}
        >
          {isSelected ? <Icon name='tick' size={18} color={theme.colors.iconInverse} /> : null}
        </Pressable>
      </View>
    );
  }
  const columns = [
    ...(shouldShowSelectionColumn
      ? [{
          key: 'actions' as const,
          title: '',
          render: (item: IBooking) => renderSelection(item),
          width: 60,
        }]
      : []),
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Booking.ID'),
      sortable: true,
      render: (item: IBooking) => renderBookinId(item),
    },
    {
      key: 'scheduledTime',
      title: TranslateMessage('Admin.Delivery.App.Requested.Ride.Date'),
      sortable: true,
      render: (item: IBooking) => renderRequestedRideDate(item),
      width: 190,
    },
    {
      key: 'customerName',
      title: TranslateMessage('Admin.Delivery.App.Customer.Customer.Name'),
      sortable: true,
      render: (item: IBooking) => renderCustomerName(item),
    },
    {
      key: 'sourceName',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Pickup.Location'),
      sortable: true,
      render: (item: IBooking) => renderSoureName(item),
    },
    {
      key: 'isRoundTrip',
      title: '',
      render: (item: IBooking) => renderRoundTripIcon(item),
      width: 40,
    },
    {
      key: 'destinationName',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Drop.off.Location'),
      sortable: true,
      render: (item: IBooking) => renderDestinationName(item),
    },

    {
      key: 'vehicleCategory',
      title: TranslateMessage('Admin.Delivery.App.Requested.Cab.Type'),
      sortable: true,
      render: (item: IBooking) => renderCabType(item),
    },
    {
      key: 'orderStatus',
      title: TranslateMessage('Admin.Delivery.App.Booking.Ride.Status'),
      sortable: true,
      render: (item: IBooking) => renderOrderStatus(item),
      width: 150,
    },
    {
      key: 'actions',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Actions'
      ),
      render: (item: IBookingListWithActions) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          {/* {renderViewDetails(
            item.id.toString(),
            item.customerName,
            handleViewDetailsPress
          )} */}
          {renderUnassignAction(item)}
          {onCancelBooking ? renderCancelAction(item) : null}
        </View>
      ),
      hide: !shouldShowActionsColumn
    },
  ].filter(
    column => !column.hide
  );;

  return (
    <CustomDataTable
      data={BookingListData.data}
      columns={columns as TableColumn<IBookingListWithActions>[]}
      // sortField={filter.sortField}
      // sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={BookingListData.total}
      onPageChange={handlePageChange}
      error={error}
      hidePagination={isDashboard}
      renderRowDetails={renderBookingRowDetails}
    />
  );
};

export default NewBookingListTable;
