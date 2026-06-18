import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';
import { DriverUploadPreviewTableProps, IPreviewDriverRow } from 'src/components/DriverDetailPage/DriverUploadPreview/DriverUploadPreviewUtil';

const DriverUploadPreviewTable = ({
  data,
  page,
  total,
  onPageChange,
}: DriverUploadPreviewTableProps) => {
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

  function renderEmergencyContact(item: IPreviewDriverRow) {
    const ec = item.emergencyContactDto;
    if (!ec) return renderText(null);
    return renderText(`${ec.fullName ?? 'N/A'} (${ec.phoneNumber ?? 'N/A'})`);
  }

  const columns: TableColumn<IPreviewDriverRow>[] = [
    {
      key: 'firstName',
      title: TranslateMessage('Admin.Delivery.App.Customer.Driver.Name'),
      minWidth: 140,
      render: (item) => renderText(item.firstName),
    },
    {
      key: 'phoneNumber',
      title: TranslateMessage('Admin.Delivery.App.Customer.Table.Phone.Number'),
      minWidth: 140,
      render: (item) => renderText(item.phoneNumber),
    },
    {
      key: 'email',
      title: TranslateMessage('Admin.Delivery.App.Profile.EmailAddress'),
      minWidth: 200,
      render: (item) => renderText(item.email),
    },
    {
      key: 'dob',
      title: TranslateMessage('Admin.Delivery.App.DateOfBirth'),
      minWidth: 120,
      render: (item) => renderText(item.dob),
    },
    {
      key: 'country',
      title: TranslateMessage('Admin.Delivery.App.Countrylabel'),
      minWidth: 110,
      render: (item) => renderText(item.country),
    },
    {
      key: 'city',
      title: TranslateMessage('Admin.Delivery.App.Citylabel'),
      minWidth: 110,
      render: (item) => renderText(item.city),
    },
    {
      key: 'address',
      title: TranslateMessage('Admin.Delivery.App.Addresslabel'),
      minWidth: 180,
      render: (item) => renderText(item.address),
    },
    {
      key: 'emergencyContactDto',
      title: TranslateMessage('Admin.Delivery.App.EmergencyInfo'),
      minWidth: 220,
      render: (item) => renderEmergencyContact(item),
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

export default DriverUploadPreviewTable;
