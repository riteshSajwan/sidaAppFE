import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Tooltip } from 'react-native-paper';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { ITicketListWithActions, TicketListTableProps } from 'src/components/TicketPage/Table/TicketListTableUtil';
import { useTicketStyle } from 'src/components/TicketPage/TicketDetailStyle';
import { getTicketLabelByKey, IStatusType, ITicket, IUSERROLE, ticketStatusLabel, ticketTarget } from 'src/components/TicketPage/TicketDetailUtil';
import { DELAY_TOOLTIP } from 'src/constants';
import { Routes } from 'src/routing/paths';
const TicketListTable = ({
  ticketListData,
  page,
  filter,
  handleSort,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  canEdit,
  error = '',
}: TicketListTableProps) => {

  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const TicketDetailStyle = useTicketStyle();
  const numberOfPages = Math.ceil(ticketListData.total / DEFAULT_TABLE_SIZE);

  function renderOrderId(item: ITicket) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.transactionId || item.orderId}
        </Text>
      </View>
    );
  }

  function renderTicketId(item: ITicket) {
    return (
      <View>
        <Text>
          #{item.id}
        </Text>
      </View>
    );
  }
  function renderTicketStatus(item: ITicket) {
    return (
      <View style={[item.ticketStatus===IStatusType.CLOSED ? DashboardStyle.pickedUpColor:DashboardStyle.rejected,TicketDetailStyle.padding_5]}>
        <Text style={TicketDetailStyle.fontSize_13}>
          {TranslateMessage(ticketStatusLabel[item.ticketStatus as IStatusType] as string)}
        </Text>
      </View>
    );
  }
  function renderTicketTargetTo(item: ITicket) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 150 }}>
        {TranslateMessage(ticketTarget[item.ticketTarget as IUSERROLE] as string)}
        </Text>
      </View>
    );
  }
  function renderTicketTargetFrom(item: ITicket) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 150 }}>
          {TranslateMessage(ticketTarget[item.userRole as IUSERROLE] as string)}
        </Text>
      </View>
    );
  }
  
  function renderTicketIssue(item: ITicket) {
    return (
      <View>
        <Tooltip title={getTicketLabelByKey(item.ticketType)} leaveTouchDelay={DELAY_TOOLTIP}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 110 }}>
          {getTicketLabelByKey(item.ticketType)}
        </Text>
        </Tooltip>
      </View>
    );
  }
  function renderDate(item: ITicket) {
    return <Text>{formatToDateMonthYear(item.createdAt)}</Text>;
  }

  const columns = [
    {
      
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.Ticket.Table.TicketId'),
      render: (item: ITicket) => renderTicketId(item),
    },
    {
      key: 'order_id',
      title: TranslateMessage('Admin.Delivery.App.Orders.Table.RequestId'),
      sortable: true,
      render: (item: ITicket) => renderOrderId(item),
    },
    {
      key: 'ticketStatus',
      title: TranslateMessage('Admin.Delivery.App.Ticket.Table.TicketStatus'),
      render: (item: ITicket) => renderTicketStatus(item),
    },
    {
      key: 'userRole',
      title: TranslateMessage('Admin.Delivery.App.Reported.From'),
      render: (item: ITicket) => renderTicketTargetFrom(item),
    },
    {
      key: 'ticketTarget',
      title: TranslateMessage('Admin.Delivery.App.Reported.To'),
      render: (item: ITicket) => renderTicketTargetTo(item),
    },
    {
      key: 'ticketTypeDescription',
      title: TranslateMessage('Admin.Delivery.App.Ticket.Table.TicketIssueType'),
      render: (item: ITicket) => renderTicketIssue(item),
    },
    {
      key: 'createdAt',
      title: TranslateMessage('Admin.Delivery.App.Restaurant.Created.AT'),
      render: (item: ITicket) => renderDate(item),
    },
  ]
  function renderRowDetails(id?: string|number) {
    return () => {
      if (!canEdit || !id) return;
      router.push(`${Routes.TICKET}/${id}`);
    };
  }

  
  return (
    <CustomDataTable
      data={ticketListData.data}
      columns={columns as TableColumn<ITicketListWithActions>[]}
      sortField={filter?.sortField}
      sortOrder={filter?.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={ticketListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default TicketListTable;
