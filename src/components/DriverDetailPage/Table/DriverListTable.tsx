import React from 'react';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { IDriverListWithActions,DriverListTableProps,} from 'src/components/DriverDetailPage/Table/DriverListTableUtil';
import { IDriver} from 'src/components/DriverDetailPage/DriverListUtil';
import { Image } from 'react-native';
import Menustyle from 'src/components/Menu/Menustyle';
import { router } from 'expo-router';
import { Routes } from 'src/routing/paths';
import { DELAY_TOOLTIP } from 'src/constants';
import { useAppTheme } from 'src/common/context/AppTheme';
import { Icon } from 'src/submodules/iconlibrary/src';
import { Tooltip } from 'react-native-paper';
import { RenderImage } from 'src/common/components/Image/Image';
import { useLayoutStyle } from 'src/common/assets/styles/layout';

const DriverListTable = ({
  DriverListData,
  page,
  filter,
  handleSort,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: DriverListTableProps) => {

  const { t: TranslateMessage } = useTranslation();
  const tablestyle = useTableStyle();
  const {theme} = useAppTheme();
  const layout = useLayoutStyle();
  const numberOfPages = Math.ceil(DriverListData.total / DEFAULT_TABLE_SIZE);

  function renderEmail(item: IDriver) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {isDeleted?'Deleted':item.email ?? 'N/A'}
        </Text>
      </View>
    );
  }

  function renderDriverName(item: IDriver) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {isDeleted?'Deleted':item.firstName ?? 'Test'}
        </Text>
      </View>
    );
  }
  function renderPhone(item: IDriver) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {isDeleted?'Deleted':item.phoneNumber ?? 'Test'}
        </Text>
      </View>
    );
  }

  const renderDriverRowDetails = (id?: string | number, title?: string,textsDisabled?:boolean,emailsDisabled?:boolean) => {
    const isDeleted = textsDisabled && emailsDisabled;
    return () => {
      if (!id ||isDeleted ) return;
      router.push(`${Routes.DRIVER}${Routes.DRIVERDETAILS}/${id}`);
    };
  };

  function renderButton(item: IDriver) {
    return (
      <View style={{ width: 80 }}>
        <Text
          style={{
            borderColor: item.isBlocked ? theme.colors.borderErrorInverse : theme.colors.borderSuccessInverse,
            padding: theme.spacing.xs,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: theme.roundness.xs,
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.textCaptionS,
            color: item.isBlocked ? theme.colors.textErrorDark : theme.colors.textSuccessDark,
            textAlign: 'center'
          }}
        >
          {item.isBlocked
            ? TranslateMessage(
              'Admin.Delivery.App.UserManagementList.Filter.Block'
            )
            : TranslateMessage(
              'Admin.Delivery.App.UserManagementList.Filter.Unblock'
            )}
        </Text>
      </View>
    );
  }
  function renderIsDeletedButton(item: IDriver) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;

    return (
      <View style={{ width: 80 }}>
        <Text

          style={[layout.driverStatus,{
            borderColor: isDeleted ? theme.colors.borderErrorInverse : theme.colors.borderSuccessInverse,
            color: isDeleted ? theme.colors.textErrorDark : theme.colors.textSuccessDark,
          }]}
        >
          {isDeleted
            ? TranslateMessage('Admin.Delivery.App.Deleted')
            : TranslateMessage('Admin.Delivery.App.UserManagementList.Filter.Active')}
        </Text>
      </View>
    );
  }
  const redirectToWallet = (item: IDriver) => {
    if(item.textsDisabled && item.emailsDisabled) return;
    router.push(
      `${Routes.DRIVER}${Routes.DRIVERDETAILS}/${item.id}${Routes.DRIVERWALLET}`
    );
  };
  
  function renderWallet(item: IDriver) {
    const isDeleted = item.textsDisabled && item.emailsDisabled;
  
    return (
      <Tooltip title="Wallet Details" leaveTouchDelay={DELAY_TOOLTIP}>
        <Pressable
          style={tablestyle.actionContainer}
          onPress={() => redirectToWallet(item)}
        >
          <Icon
            name="wallet"
            color={theme.colors.iconBase}
            size={25}
          />
        </Pressable>
      </Tooltip>
    );
  }
  function renderImage(item: IDriver) {
    return (
      <RenderImage
          uri={item.profileUrl}
          style={[Menustyle.Avatarimage, Menustyle.roundimage]}
        />
    );
  }

  function renderVehicle(item: IDriver) {
    return <Text>{item?.riderVehicleRegistration?.vehicleType}</Text>;
  }
  const columns = [
    {
      key: 'profileUrl',
      title: TranslateMessage('Admin.Delivery.App.Customer.Table.Profile.Image'),
      render: (item: IDriver) => renderImage(item),
    },
    {
      key: 'id',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.ID'
      ),
      hide: isDashboard
    },
    {
      key: 'firstName',
      title: TranslateMessage('Admin.Delivery.App.Customer.Driver.Name'),
      sortable: true,
      render: (item: IDriver) => renderDriverName(item),
    },

    {
      key: 'email',
      title: TranslateMessage('Admin.Delivery.App.Customer.Email'),
      render: (item: IDriver) => renderEmail(item),
      sortable: true,
      hide: isDashboard
    },

    {
      key: 'phoneNumber',
      title: TranslateMessage('Admin.Delivery.App.Customer.Phone.Number'),
      sortable: true,
      render: (item: IDriver) => renderPhone(item),
    },
    {
      key: 'isBlocked',
      title: TranslateMessage(
        'Admin.Delivery.App.RequestManagementList.Table.Status'
      ),
      render: (item: IDriver) => renderButton(item),
    },
    {
      key: 'deleted',
      title: TranslateMessage(
        'Admin.Delivery.App.Account.Status'
      ),
      render: (item: IDriver) => renderIsDeletedButton(item),
    },
     {
          key: 'wallet',
          title: TranslateMessage(
           'Admin.Delivery.App.Wallet.Details'
          ),
          sortable: true,
          render: (item: IDriver) => renderWallet(item),
           hide:isDashboard
    },
  ].filter(
    column => !column.hide
  );;

  return (
    <CustomDataTable
      data={DriverListData.data}
      columns={columns as TableColumn<IDriverListWithActions>[]}
      sortField={filter.sortField}
      sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={DriverListData.total}
      onPageChange={handlePageChange}
      error={error}
      hidePagination={isDashboard}
      renderRowDetails={renderDriverRowDetails}
    />
  );
};

export default DriverListTable;
