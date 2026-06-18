import React from 'react';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE,TableColumn} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { Text, View } from 'react-native';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-native-paper';
import { IUserListWithActions, UserListTableProps } from 'src/components/CustomerDetailPage/Table/CustomerListTableUtil';
import { ICustomer } from 'src/components/CustomerDetailPage/CustomerListUtil';
import { Image } from 'react-native';
import Menustyle from 'src/components/Menu/Menustyle';
import { router } from 'expo-router';
import { Routes } from 'src/routing/paths';
import { DELAY_TOOLTIP } from 'src/constants';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { RenderImage } from 'src/common/components/Image/Image';


const CustomerListTable = ({
  userListData,
  page,
  handleSort,
  filter,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: UserListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const numberOfPages = Math.ceil(userListData.total / DEFAULT_TABLE_SIZE);
  const style = useLayoutStyle();
  function renderDate(item: ICustomer) {
    return <Text>{formatToDateMonthYear(item.createdAt)}</Text>;
  }

  const  renderRowDetails=(id?: string | number, title?: string,textsDisabled?:boolean,emailsDisabled?:boolean) => {
    const isDeleted = textsDisabled && emailsDisabled;
    return () => {
      if (!id || isDeleted) return;
      router.push(`${Routes.CUSTOMER}${Routes.CUSTOMERDETAILS}/${id}`);
    };
  }

  function renderImage(item: ICustomer) {
    return (
     <View> 
      <RenderImage
          uri={item.profileUrl}
          style={[Menustyle.Avatarimage, Menustyle.roundimage]}
      />
      </View>
    );
  }
  
  function renderEmail(item: ICustomer) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
    return (
     <View > 
      <Tooltip title={item.email} leaveTouchDelay={DELAY_TOOLTIP}>
      <Text  numberOfLines={1} ellipsizeMode="tail" style={{ width: 120 }}>{isDeleted?'Deleted':item.email? item.email: 'N/A'}</Text>
      </Tooltip>
      </View>
    );
  }
    function renderPhone(item: ICustomer) {
      const isDeleted = item.textsDisabled && item.emailsDisabled;
      return (
        <View>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
            {isDeleted?'Deleted':item.phoneNumber ?? 'Test'}
          </Text>
        </View>
      );
    }

  function renderDriverName(item: ICustomer) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
    return (
      <Tooltip title={item.firstName} leaveTouchDelay={DELAY_TOOLTIP}>
        <Text  numberOfLines={1} ellipsizeMode="tail" style={{ width: 120 }}>{isDeleted?'Deleted':item.firstName ?? 'Test'}</Text>
      </Tooltip>
    );
  }
  function renderIsDeletedButton(item: ICustomer) {
    const isDeleted = item.textsDisabled  && item.emailsDisabled;
  
    return (
      <View style={{ width: 80 }}>
        <Text
          style={[
            style.customerListTable,
            {
              borderColor:isDeleted ? theme.colors.borderErrorInverse : theme.colors.borderSuccessInverse,
              color:isDeleted ? theme.colors.textErrorDark : theme.colors.textSuccessDark,
            },
          ]}
        >
          {isDeleted
            ? TranslateMessage('Admin.Delivery.App.Deleted')
            : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Active')}
        </Text>
      </View>
    );
  }

  function renderButton(item: ICustomer) {
    return (
      <View style={{width:85}}>
       <Text
          style={[
            style.customerListTable,
            {
              borderColor: item.isBlocked ? theme.colors.borderErrorInverse : theme.colors.borderSuccessInverse,
              color: item.isBlocked ? theme.colors.textErrorDark : theme.colors.textSuccessDark,
            },
          ]}
        >
        {item.isBlocked
          ? TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Block')
          : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Unblock')
        }
      </Text>
      </View>
    );
  }

  const columns = [
    {
      key: 'profileUrl',
      title: TranslateMessage(
         'Admin.Delivery.App.Customer.Table.Profile.Image'
      ),
      render: (item: ICustomer) => renderImage(item),

    },
    {
      key: 'id',
      title: TranslateMessage(
        'Admin.Delivery.App.Customer.ID'
      ),
      hide:isDashboard
    },
    {
      key: 'firstName',
      title: TranslateMessage(
       'Admin.Delivery.App.Customer.Table.Customer.Name'
      ),
      sortable: true,
      render: (item: ICustomer) => renderDriverName(item),
    },
   
    {
      key: 'email',
      title: TranslateMessage(
      'Admin.Delivery.App.Customer.Email'
      ),
      render: (item: ICustomer) => renderEmail(item),
      sortable: true,
      hide:isDashboard
    },

    {
      key: 'phoneNumber',
      title: TranslateMessage(
      'Admin.Delivery.App.Customer.Table.Phone.Number'
      ),
      sortable: true,
      render: (item: ICustomer) => renderPhone(item),
    },

    {
      key: 'createdAt',
      title: TranslateMessage(
       'Admin.Delivery.App.UserManagementList.Filter.Registration.Date'
      ),
      sortable: true,
      render: (item: ICustomer) => renderDate(item),
      hide: isDashboard
    },
    {
      key: 'isBlocked',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Status'
      ),
      render: (item: ICustomer) => renderButton(item),
    },
    {
      key: 'deleted',
      title: TranslateMessage(
        'Admin.Delivery.App.Account.Status'
      ),
      render: (item: ICustomer) => renderIsDeletedButton(item),
    },
  ].filter(
    column => !column.hide
  );

  return (
    <CustomDataTable
      data={userListData.data}
      columns={columns as TableColumn<IUserListWithActions>[]}
      sortField={filter.sortField}
      sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={userListData.total}
      onPageChange={handlePageChange}
      error={error}
      hidePagination={isDashboard}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default CustomerListTable;
