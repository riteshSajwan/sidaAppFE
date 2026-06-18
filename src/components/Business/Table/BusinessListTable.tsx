import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { setTenantId } from 'src/common/utils/tenantUtils';
import { BusinessListTableProps, IBuisnessListWithActions } from 'src/components/Business/Table/BusinessListTableUtil';
import { Routes } from 'src/routing/paths';
import { RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
import { IBusiness, SubscriptionStatus } from 'src/components/Business/BusinessListUtils';
import { useDashboardStyle } from 'src/components/DashboardPage/DashboardStyle';
import Typography from 'src/common/components/Typography/Typography';
const BuisnessListTable = ({
  businessListData,
  page,
  filter,
  handleSort,
  handleTogglePress,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  handleEditPress,
  error = '',
}: BusinessListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const {theme} = useAppTheme();
  const button = useButtonStyle();
  const numberOfPages = Math.ceil(businessListData.total / DEFAULT_TABLE_SIZE);
  const userDetails = useSelector((state: RootState) => state.profile.data);
  const DashboardStyle = useDashboardStyle();

  function renderSubscriptionStatus(item: IBusiness) {
    const isActive = item.subscriptionStatus === SubscriptionStatus.ACTIVE;
    return (
      <View style={isActive ? DashboardStyle.pickedUpColor : DashboardStyle.rejected}>
        <Typography color= {isActive ? theme.colors.textSuccessDark:theme.colors.textErrorDark}>{item.subscriptionStatus ?? '-'}</Typography>
      </View>
    );
  }

  function renderBusinessName(item: IBusiness) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.businessName}
        </Text>
      </View>
    );
  }
  function renderBusinessAddress(item: IBusiness) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 200 }}>
          {item.businessAddress}
        </Text>
      </View>
    );
  }

  function renderAction(active: boolean, businessId: number, planId: number, tenantId: string, onActionPress: (id: number) => (active: boolean) => void) {

    function businessToogle(event: GestureResponderEvent) {
      event.stopPropagation();
      onActionPress(businessId)(active);
    }

    const handleViewBusiness = (event: GestureResponderEvent) => {
      event.stopPropagation();
      setTenantId(tenantId)
        .then(() => {
          router.push(Routes.DASHBOARD);
        })
        .catch((error) => {
          console.error('Failed to set tenant ID:', error);
        });
    };


    return (
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
            <Pressable onPress={businessToogle}>
              <Icon name={active ? 'switchOn' : 'switchOff'} size={35} color={active ? theme.colors.themeIcon : theme.colors.iconDisabled}  />
            </Pressable>
            <Pressable onPress={handleEditPress(planId)}>
              <Icon name='edit' size={20} color={theme.colors.iconBase} />
            </Pressable>
             <Pressable onPress={handleViewBusiness} >
                <Icon name={'eye'} size={30} color={theme.colors.iconBase}  />
          </Pressable>
      </View>
    );
  }
  function renderBusinessId(item: IBusiness) {
    return (
      <View>
        <Text>
          {item.tenantId} 
        </Text>
      </View>
    );
  }

  function renderBusinessEmail(item: IBusiness) {
    return (
      <View>
        <Text>
          {item.businessEmail}
        </Text>
      </View>
    );
  }
  function renderBusinessPhone(item: IBusiness) {
    return (
      <View>
        <Text>
          {item.phoneNumber}
        </Text>
      </View>
    );
  }
  function renderFleetSize(item: IBusiness) {
    return (
      <View>
        <Text>
          {item.fleetSize}
        </Text>
      </View>
    );
  }  function renderRiderLimit(item: IBusiness) {
    return (
      <View>
        <Text>
          {item.riderLimit}
        </Text>
      </View>
    );
  }
  const columns: TableColumn<IBuisnessListWithActions>[] = [
    {
      key: 'tenantId',
      title: TranslateMessage('Admin.Delivery.App.Business.Table.BusinessId'),
      render: (item: IBusiness) => renderBusinessId(item),
    },

    {
      key: 'businessName',
      title: TranslateMessage('Admin.Delivery.App.Business.NameLabel'),
      render: (item: IBusiness) => renderBusinessName(item),
    },
    {
      key: 'businessEmail',
      title: TranslateMessage('Admin.Delivery.App.Business.EmailLabel'),
      cellTextStyle: { textTransform: 'none' },
      render: (item: IBusiness) => renderBusinessEmail(item),
    },
    {
      key: 'businessAddress',
      title: TranslateMessage('Admin.Delivery.App.BusinessAddress'),
      render: (item: IBusiness) => renderBusinessAddress(item),
    },
    {
      key: 'subscriptionStatus',
      title: TranslateMessage('Admin.Delivery.App.Subscription'),
      render: (item: IBusiness) => renderSubscriptionStatus(item),
    },
    {
      key: 'actions',
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: IBusiness) =>
        renderAction(item.active ?? false, Number(item.id), Number(item.planId ?? item.id), item?.tenantId ?? '', handleTogglePress),
    },

  ]
  function renderRowDetails(id?:string| number) {
    return () => {
      if (!id) return;
      router.push(`${Routes.BUSINESS}/${id}`);
    };
  }
  return (
    <CustomDataTable
      data={businessListData.data}
      columns={columns}
      sortField={filter?.sortField}
      sortOrder={filter?.sortOrder}
      onSort={handleSort}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={businessListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default BuisnessListTable;
