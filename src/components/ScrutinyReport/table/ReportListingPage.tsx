import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { ReportListingTableProps, IPreviewDriverRow } from './ReportListingUtils';

const ReportListingPage = ({
  data,
  page,
  total,
  onPageChange,
}: ReportListingTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const tablestyle = useTableStyle();

  const numberOfPages = Math.ceil(total / DEFAULT_TABLE_SIZE);

  function renderText(value: string | null) {
    return (
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ minWidth: 100 }}>
          {value ?? 'N/A'}
        </Text>
      </View>
    );
  }



  const columns: TableColumn<IPreviewDriverRow>[] = [
   
    {
      key: 'parameters',
      title: TranslateMessage('Admin.Sida.APP.ScrutinyReport.Parameter'),
      minWidth: 80,
      render: (item) => renderText(item.parameters),
    },
    {
      key: 'permissable',
      title: TranslateMessage('Admin.Sida.APP.ScrutinyReport.Permissable'),
      minWidth: 80,
      render: (item) => renderText(item.permissable),
    },
    {
      key: 'provided',
      title: TranslateMessage('Admin.Sida.APP.ScrutinyReport.Provided'),
      minWidth: 80,
      render: (item) => renderText(item.provided),
    },
    {
      key: 'status',
      title: TranslateMessage('Admin.Sida.APP.ScrutinyReport.ComplianceCheck'),
      minWidth: 80,
      render: (item) => renderText(item.status),
    },

    
   
  ];

  return (
    <CustomDataTable
      data={data}
      columns={columns}
      page={page}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={total}
      numberOfPages={numberOfPages}
      onPageChange={onPageChange}
      error=""
      hidePagination={false}
      cellContentAlign="left"
      headerContentAlign="left"
    />
  );
};

export default ReportListingPage;
