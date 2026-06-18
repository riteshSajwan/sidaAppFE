import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
  TableColumn,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { getRestaurantRequestLabelByKey, IRequest, RequestApprovalList, RequestStatusLabel, RequestType } from 'src/components/RequestManagement/RequestListUtil';
import {
  IRequestListWithActions,
  RequestListTableProps,
} from 'src/components/RequestManagement/Table/RequestListTableUtil';
import { Routes } from 'src/routing/paths';
import { DriverRequestApprovalList } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';

const RequestListTable = ({
  requestListData,
  page,
  handleSort,
  filter,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: RequestListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  const layout = useLayoutStyle();
  const numberOfPages = Math.ceil(requestListData.total / DEFAULT_TABLE_SIZE);

  function renderDate(item: IRequest) {
    return <Text>{formatToDateMonthYear(item.createdAt)}</Text>;
  }

  function renderButton(item: IRequest) {
    switch (item.approvalRequestStatus) {
      case RequestType.APPROVED:
        return (
          <View style={[DashboardStyle.pickedUpColor,{padding:5,width:80}]}>
             {TranslateMessage(RequestStatusLabel[item.approvalRequestStatus as RequestType] as string)}
          </View>
        );
      case RequestType.REJECTED:
        return (
          <View style={[DashboardStyle.rejected,{padding:5,width:80}]}>
             {TranslateMessage(RequestStatusLabel[item.approvalRequestStatus as RequestType] as string)}
          </View>
        );
      case RequestType.PENDING:
        return (
          <View style={[DashboardStyle.pending,{padding:5,width:80}]}>
             {TranslateMessage(RequestStatusLabel[item.approvalRequestStatus as RequestType] as string)}
          </View>
        );
    }
  }
  function renderRequestName(item: IRequest) {
    return (
      <View>
      <Text>
        {getRestaurantRequestLabelByKey(item.requestName)}
      </Text>
    </View>
    );
  }

  const renderRowDetails = (id?: string|number, title?: string) => () => {
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
    }

    router.push(route);
  };

  const columns = [
   {
      key: 'id',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.ID'
      ),
      hide:isDashboard
    },
    {
      key: 'requestName',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Title'
      ),
      sortable: true,
      render: (item:IRequest) => renderRequestName(item),
    },
    {
      key: 'riderName',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Name'
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Date'
      ),
      sortable: true,
      render: (item: IRequest) => renderDate(item),
    },
    {
      key: 'approvalRequestStatus',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Status'
      ),
      render:  (item: IRequest) => renderButton(item),
    },
  ] .filter(
    column => !column.hide
  );

  return (
    <CustomDataTable
      data={requestListData.data}
      columns={columns as TableColumn<IRequestListWithActions>[]}
      sortField={filter.sortField}
      sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={requestListData.total}
      onPageChange={handlePageChange}
      error={error}
      hidePagination={isDashboard}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default RequestListTable;
