import React from 'react';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {DEFAULT_TABLE_SIZE, TableColumn,} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { Text, View } from 'react-native';
import {IDriverRequestListWithActions,DriverRequestListTableProps,} from 'src/components/RequestManagement/DriverRequest/Table/DriverRequestListTableUtil';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { useTranslation } from 'react-i18next';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import { DriverRequestApprovalList, getRequestLabelByKey, IDriverRequest } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';
import { RequestStatusLabel, RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { Routes } from 'src/routing/paths';
import { router } from 'expo-router';

const DriverRequestListTable = ({
  driverRequestListData,
  page,
  handleSort,
  filter,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: DriverRequestListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const DashboardStyle = useDashboardStyle();
  
  const numberOfPages = Math.ceil(driverRequestListData.total / DEFAULT_TABLE_SIZE);
  function renderDate(item: IDriverRequest) {
    return <Text>{formatToDateMonthYear(item.createdAt)}</Text>;
  }

  const renderRowDetails = (id?: string |number, title?: string) => () => {
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


  function renderButton(item: IDriverRequest) {
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
  function renderRequestName(item: IDriverRequest) {
    return (
      <View>
      <Text>
        {getRequestLabelByKey(item.requestName)}
      </Text>
    </View>
    );
  }

  const columns: TableColumn<IDriverRequestListWithActions>[] = [
    {
      key: 'id',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.ID'
      ),
      sortable: true,
    },
    {
      key: 'requestName',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Title'
      ),
      sortable: true,
      render: (item) => renderRequestName(item),
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
      render: (item: IDriverRequest) => renderDate(item),
    },
    {
      key: 'approvalRequestStatus',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Status'
      ),
      render:  (item: IDriverRequest) => renderButton(item),
    },
  ];

  return (
    <CustomDataTable
      data={driverRequestListData.data}
      columns={columns}
      sortField={filter.sortField}
      sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={driverRequestListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default DriverRequestListTable;
