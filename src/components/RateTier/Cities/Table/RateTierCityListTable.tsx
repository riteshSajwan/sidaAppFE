import React from 'react';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import {
  DEFAULT_TABLE_SIZE,
} from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import {
  TableColumn,
} from 'src/components/ServiceArea/table/ServiceAreasListTableUtil';
import { IRateTierCityListWithActions, RateTierCityListTableProps } from 'src/components/RateTier/Cities/Table/RateTierCityListTableUtil';
import { useTranslation } from 'react-i18next';

const RateTierCityListTable = ({
  rateTierCityListData,
  page,
  handleSort,
  filter,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: RateTierCityListTableProps) => {
  const { t: TranslateMessage } = useTranslation();

  const numberOfPages = Math.ceil( rateTierCityListData.total / DEFAULT_TABLE_SIZE);

  const columns: TableColumn<IRateTierCityListWithActions>[] = [
    {
      key: 'countryName',
      title: TranslateMessage('Admin.Delivery.App.Countrylabel'),
      sortable: true,
    },
    {
      key: 'cityName',
      title: TranslateMessage('Admin.Delivery.App.Citylabel'),
      sortable: true,
    },
    // {
    //   key: 'rateTierAdded',
    //   title: TranslateMessage('Admin.Delivery.App.RateTier.Added'),
    // },
  ];

  return (
    <CustomDataTable
      data={ rateTierCityListData.data}
      columns={columns}
      sortField={filter.sortField}
      sortOrder={filter.sortOrder}
      page={page}
      onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={ rateTierCityListData.total}
      onPageChange={handlePageChange}
      error={error}
      renderRowDetails={(id?: string) => {
        return id ? handleViewDetailsPress(id) : () => { };
      }}

    />
  );
};

export default RateTierCityListTable;
