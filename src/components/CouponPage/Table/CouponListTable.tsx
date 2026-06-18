import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { ICoupon } from 'src/components/CouponPage/CouponListUtil';
import { CouponListTableProps, getCouponNameByLanguage, ICouponListWithActions } from 'src/components/CouponPage/Table/CouponListTableUtil';
import { Routes } from 'src/routing/paths';
import { RootState } from 'src/store';
import { Icon } from 'src/submodules/iconlibrary/src';
const CouponListTable = ({
  couponListData,
  page,
  filter,
  handleSort,
  handleTogglePress,
  isDashboard,
  handlePageChange,
  handleViewDetailsPress,
  handleEditPress,
  canEdit,
  error = '',
}: CouponListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const {theme} = useAppTheme();
  const button = useButtonStyle();
  const numberOfPages = Math.ceil(couponListData.total / DEFAULT_TABLE_SIZE);
  const userDetails = useSelector((state: RootState) => state.profile.data);
  function renderCouponName(item: ICoupon) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {getCouponNameByLanguage(userDetails?.language,item.couponName,item.couponFrenchName )}
        </Text>
      </View>
    );
  }

  function renderAction(isActive: boolean, id: number, onActionPress: (id: number) => (isActive: boolean) => void) {

    if (!canEdit) {
      return null;
    }

    function couponToggle(event: GestureResponderEvent) {
      event.stopPropagation
      onActionPress(id)(!isActive)
    }
    return (
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
        <Pressable onPress={couponToggle}>
          <Icon name={isActive ? 'switchOff' : 'switchOn'} size={35} color={isActive ? theme.colors.iconBase : theme.colors.iconOnDisabled} />
        </Pressable>

        <Pressable
          onPress={handleEditPress(id)}
        >
          <Icon name='edit' size={20} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }
  function renderOrderId(item: ICoupon) {
    return (
      <View>
        <Text>
          {item.id}
        </Text>
      </View>
    );
  }

  function renderAmount(item: ICoupon) {
    return (
      <View>
        <Text>
          {item.minimumOrderValue}
        </Text>
      </View>
    );
  }
  function renderCoupanValue(item: ICoupon) {
    return (
      <View>
        <Text>
          {item.couponDiscountPercent} %
        </Text>
      </View>
    );
  }
  function renderDate(item: ICoupon) {
    return <Text>{formatToDateMonthYear(item.expirationDateTime.toString())}</Text>;
  }

  const columns: TableColumn<ICouponListWithActions>[] = [
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.Coupon.Table.CouponId'),
      render: (item: ICoupon) => renderOrderId(item),
    },

    {
      key: 'couponName',
      title: TranslateMessage('Admin.Delivery.App.Coupon.Name'),
      sortable: true,
      render: (item: ICoupon) => renderCouponName(item),
    },

    {
      key: 'minimumOrderValue',
      title: TranslateMessage('Admin.Delivery.App.Coupon.Amount'),
      render: (item: ICoupon) => renderAmount(item),
    },
    {
      key: 'couponDiscountPercent',
      title: TranslateMessage('Admin.Delivery.App.Coupon.value.Percentage'),
      render: (item: ICoupon) => renderCoupanValue(item),
    },
    {
      key: 'expirationDateTime',
      title: TranslateMessage('Admin.Delivery.App.Expiry.Date'),
      render: (item: ICoupon) =>
        renderDate(item),

    },
    ...(canEdit ? [{
      key: 'actions' as const,
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: ICoupon) =>
        renderAction(item.activeStatus, Number(item.id), handleTogglePress),
    }] : []),

  ]
  function renderRowDetails(id?: string|number) {
    return () => {
      if (!canEdit || !id) return;
      router.push(`${Routes.COUPON}/${id}`);
    };
  }
  return (
    <CustomDataTable
      data={couponListData.data}
      columns={columns}
      sortField={filter?.sortField}
      sortOrder={filter?.sortOrder}
      onSort={handleSort}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={couponListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default CouponListTable;
