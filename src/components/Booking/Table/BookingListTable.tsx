import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IBooking } from 'src/components/Booking/BookingListUtil';
import { BookingListTableProps, bookingStatusLabel, getBookingStatusAppearance, IBookingListWithActions, IBookingType } from 'src/components/Booking/Table/BookingListTableUtil';
import { Routes } from 'src/routing/paths';

const BookingListTable = ({
  BookingListData,
  page,
  filter,
  handleSort,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: BookingListTableProps) => {

  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const layout = useLayoutStyle();
  const numberOfPages = Math.ceil(BookingListData.total / DEFAULT_TABLE_SIZE);

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
      item.orderStatus as IBookingType,
      theme
    );

    return (
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={[layout.bookingstatus,{color: statusAppearance.textColor,
            backgroundColor: statusAppearance.backgroundColor,
            borderColor: statusAppearance.borderColor,}]}
        >
          {TranslateMessage(bookingStatusLabel[item.orderStatus as IBookingType] as string)}
        </Text>
      </View>
    );
  }

  const renderBookingRowDetails = (id?: string | number) => {
    return () => {
      if (!id) return;
      router.push(`${Routes.BOOKING}${Routes.BOOKINGDETAILS}/${id}`);
    };
  };
  const columns = [
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Booking.ID'),
      sortable: true,
      render: (item: IBooking) => renderBookinId(item),
      flex: 1,
      minWidth: 140,
    },
    {
      key: 'customerName',
      title: TranslateMessage('Admin.Delivery.App.Customer.Customer.Name'),
      sortable: true,
      render: (item: IBooking) => renderCustomerName(item),
      flex: 1,
      minWidth: 170,
    },
    {
      key: 'sourceName',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Pickup.Location'),
      sortable: true,
      render: (item: IBooking) => renderSoureName(item),
      flex: 1,
      minWidth: 220,
    },
    {
      key: 'destinationName',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Drop.off.Location'),
      sortable: true,
      render: (item: IBooking) => renderDestinationName(item),
      flex: 1,
      minWidth: 220,
    },

    {
      key: 'orderStatus',
      title: TranslateMessage('Admin.Delivery.App.Booking.Ride.Status'),
      sortable: true,
      render: (item: IBooking) => renderOrderStatus(item),
      flex: 1,
      minWidth: 160,
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

export default BookingListTable;
