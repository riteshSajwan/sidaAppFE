import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { ActiveManageCityTableProps, IActiveManageCityWithActions } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/table/ManageCitiesUtilTable';

import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';
import { TableColumn } from '../../table/ManageActiveCountriesUtilTable';


const ActiveCItyListTable = ({
  activeCities,
  page,
  handlePageChange,
  // handleCountryPress,
  handleTogglePress,
  handleEditPress,
  canEdit,
  error = '',
}: ActiveManageCityTableProps) => {
  const numberOfPages = Math.ceil(activeCities.total / DEFAULT_TABLE_SIZE);
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const {theme} = useAppTheme();

  const { countryId } = useLocalSearchParams<{ countryId: string }>();

  function renderRowDetails(id?: string | number) {
    return () => {
      if (!id || !canEdit) return;
      router.push(`${Routes.COUNTRIES}/${countryId}${Routes.CITIES}/${id}`);
    };
  }
  function renderAction(
    isActive: boolean,
    id: number,
    onActionPress: (id: number) => (newValue: boolean) => void,
  
  ) {
    if (!canEdit) {
      return null;
    }

    function toggleHandler(event: GestureResponderEvent) {
      event.stopPropagation?.();
      onActionPress(id)(!isActive);
    }

    return (
      <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
        <Pressable onPress={toggleHandler}>
          <Icon name={isActive ? 'switchOn' : 'switchOff'} size={35} color={isActive ? theme.colors.themeIcon : theme.colors.iconOnDisabled} />
        </Pressable>
        <Pressable onPress={handleEditPress(id)}>
          <Icon name='edit' size={20} color={theme.colors.iconBase} />
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IActiveManageCityWithActions>[] = [
    {
      key: 'cityName',
      title: TranslateMessage(
        'Admin.Delivery.App.City.Name'
      ),
    },

    {
      key: 'radius',
      title: TranslateMessage(
        'Admin.Delivery.App.City.Radius'
      ),
    },
    ...(canEdit ? [{
      key: 'actions' as const,
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: IActiveManageCityWithActions) =>
        renderAction(item.activeStatus, item.id, handleTogglePress)
    }] : [])
  ];

  return (
    <CustomDataTable
      data={activeCities.data}
      columns={columns}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={activeCities.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default ActiveCItyListTable;
