import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { IRateTierList } from 'src/components/RateTier/Cities/rateTierList/RateTierListingUtil';
import { IRateListListWithActions, RateTierListTableProps } from 'src/components/RateTier/Cities/rateTierList/Table/RateTierListTableUtil';
import { getVehicleCategoryLabel, getVehicleTypeLabel, VehicleCategory, VehicleType } from 'src/components/RateTier/Cities/rateTierList/add/AddRateTierUtil';
import { Routes } from 'src/routing/paths';
const RateTierListTable = ({ id, rateTierListData, page, handlePageChange, canEdit, error = '' }: RateTierListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const button = useButtonStyle();
  const numberOfPages = Math.ceil(rateTierListData.total / DEFAULT_TABLE_SIZE);

  function renderOrderId(item: IRateTierList) {
    return (
      <View>
        <Text>{item.cityId}</Text>
      </View>
    );
  }
  function renderVehicleType(item: IRateTierList) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {getVehicleTypeLabel(item.vehicleType as VehicleType)}
        </Text>
      </View>
    );
  }
  function renderVehicleCategory(item: IRateTierList) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {getVehicleCategoryLabel(item.vehicleCategory as VehicleCategory)}
        </Text>
      </View>
    );
  }
  function renderBasePrice(item: IRateTierList) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.basePrice}
        </Text>
      </View>
    );
  }
  function renderPricePerKm(item: IRateTierList) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.pricePerKm}
        </Text>
      </View>
    );
  }

  function renderCancellationChargesPercentage(item: IRateTierList) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ width: 120 }}>
          {item.cancellationChargesPercentage != null ? `${item.cancellationChargesPercentage}%` : '-'}
        </Text>
      </View>
    );
  }

  const columns: TableColumn<IRateListListWithActions>[] = [
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.City.Id'),
      render: (item: IRateTierList) => renderOrderId(item),
    },
    {
      key: 'vehicleType',
      title: TranslateMessage('Admin.Delivery.App.Driver.Vehicle.Type'),
      render: (item: IRateTierList) => renderVehicleType(item),
    },
    {
      key: 'vehicleCategory',
      title: TranslateMessage('Admin.Delivery.App.Vehicle.Category'),
      render: (item: IRateTierList) => renderVehicleCategory(item),
    },
    {
      key: 'basePrice',
      title: TranslateMessage('Admin.Delivery.App.Base.Price'),
      render: (item: IRateTierList) => renderBasePrice(item),
    },
    {
      key: 'pricePerKm',
      title: TranslateMessage('Admin.Delivery.App.Price.Per.Km'),
      render: (item: IRateTierList) => renderPricePerKm(item),
    },
    {
      key: 'cancellationChargesPercentage',
      title: TranslateMessage('Admin.Delivery.App.CancellationCharges'),
      render: (item: IRateTierList) => renderCancellationChargesPercentage(item),
    },
  ];
  const renderRowDetails = (rateTierId?: string | number) => () => {
    if (!canEdit || !id || !rateTierId) return;

    router.push(`${Routes.RATE_TIERS}${Routes.CITIES}/${id}/${rateTierId}`);
  };

  return (
    <CustomDataTable
      data={rateTierListData.data}
      columns={columns}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={rateTierListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default RateTierListTable;
