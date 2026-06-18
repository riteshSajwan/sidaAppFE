import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
  renderLinkPress,
  TableColumn
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { ActiveManageCountriesTableProps, IActiveManageCountriesWithActions } from 'src/components/ManageServiceAreas/ManageActiveCountries/table/ManageActiveCountriesUtilTable';
import { Routes } from 'src/routing/paths';
import { Icon } from 'src/submodules/iconlibrary/src';

const ActiveCountryListTable = ({
  activeCountries,
  page,
  handlePageChange,
  handleCountryPress,
  handleTogglePress,
  handleEditPress,
  canEdit,
  error = '',
}: ActiveManageCountriesTableProps) => {
  const numberOfPages = Math.ceil(activeCountries.total / DEFAULT_TABLE_SIZE);
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const {theme} = useAppTheme();
  function renderAction(isActive: boolean, id: number, onActionPress: (id: number) => (isActive: boolean) => void) {

    if (!canEdit) {
      return null;
    }

    function countryToggle(event: GestureResponderEvent) {
      event.stopPropagation
      onActionPress(id)(!isActive)
    }
    return (
      <View style={[layout.flexDirectionRow, layout.alignItemCenter]}>
        <Pressable onPress={countryToggle}>
          <Icon name={isActive ? 'switchOn' : 'switchOff'} size={35} color={isActive ? theme.colors.themeIcon : theme.colors.iconOnDisabled} />
        </Pressable>
        <Pressable
          onPress={handleEditPress(id)}
        >
          <Icon name='edit' size={20} color={theme.colors.iconBase}/>
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IActiveManageCountriesWithActions>[] = [
    {
      key: 'countryName', title: TranslateMessage('Admin.Delivery.App.Country.Name'),
      render: (item: IActiveManageCountriesWithActions) =>
        renderLinkPress(handleCountryPress, item.countryName, item.id.toString(), theme),
    },
    { key: 'countryISO', title: TranslateMessage('Admin.Delivery.App.Country.Code') },
    { key: 'currency', title: TranslateMessage('Admin.Delivery.App.Country.Currency') },
    { key: 'distanceUnit', title: TranslateMessage('Admin.Delivery.App.Country.DistanceUnit') },
    ...(canEdit ? [{
      key: 'actions' as const,
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: IActiveManageCountriesWithActions) =>
        renderAction(item.activeStatus, item.id, handleTogglePress),
    }] : []),
  ];
  function renderRowDetails(id?: string|number) {
    return () => {
      if (!id) return;
      router.push(`${Routes.COUNTRIES}/${id}${Routes.CITIES}`);
    };
  }

  return (
    <CustomDataTable
      data={activeCountries.data}
      columns={columns}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={activeCountries.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={renderRowDetails}
    />
  );
};

export default ActiveCountryListTable;
