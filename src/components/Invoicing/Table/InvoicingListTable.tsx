import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { DEFAULT_TABLE_SIZE, TableColumn } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { useAppTheme } from 'src/common/context/AppTheme';
import { usePermission } from 'src/common/hooks/usePermission';
import { MenuType } from 'src/common/utils/permissionUtils';
import { getInvoiceFileName, IInvoice } from 'src/components/Invoicing/InvoicingListUtil';
import { IInvoiceListWithActions, InvoiceListTableProps, shouldShowSelection } from 'src/components/Invoicing/Table/InvoicingListTableUtil';
import { Icon } from 'src/submodules/iconlibrary/src';

const InvoicingListTable = ({
  invoiceListData,
  page,
  currentStatus,
  selectedInvoiceIds,
  handlePageChange,
  handleDownloadPress,
  handleResendPress,
  handleSelectInvoice,
  error = '',
}: InvoiceListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const { theme } = useAppTheme();
  const formStyle = useFormStyle();
  const layout = useLayoutStyle();
  const numberOfPages = Math.ceil(invoiceListData.total / DEFAULT_TABLE_SIZE);
  const showSelection = shouldShowSelection(currentStatus);
   const { isProductAdmin } = usePermission(MenuType.INVOICING);
  function renderSelection(item: IInvoice) {
    if (!showSelection) {
      return null;
    }

    return (
      <View style={[layout.alignItemCenter, layout.justifyCenter, { top: theme.spacing.xs }]}> 
        <Pressable
          onPress={() => handleSelectInvoice(item.invoiceId)}
          style={[
            formStyle.checkBox,
            selectedInvoiceIds.includes(item.invoiceId) && formStyle.checkBoxChecked,
          ]}
        >
          <Icon name='tick' size={25} color={theme.colors.iconInverse} />
        </Pressable>
      </View>
    );
  }

  const columns: TableColumn<IInvoiceListWithActions>[] = [
    ...(showSelection && isProductAdmin
      ? [{
          key: 'actions' as const,
          title: '',
          render: (item: IInvoice) => renderSelection(item),
          width: 60,
        }]
      : []),
    {
      key: 'id',
      title: TranslateMessage('Admin.Delivery.App.InvoiceManagement.Table.InvoiceId'),
    },
    {
      key: 'invoiceUrl',
      title: TranslateMessage('Admin.Delivery.App.InvoiceManagement.Table.FileName'),
      render: (item: IInvoice) => getInvoiceFileName(item.invoiceUrl),
    },
    {
      key: 'download' as keyof IInvoice,
      title: TranslateMessage('Admin.Delivery.App.RequestManagementList.Table.Actions'),
      render: (item: IInvoice) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Pressable onPress={handleDownloadPress(item)}>
            <Icon name='import' color={theme.colors.iconBase} size={18} />
          </Pressable>
          <Pressable onPress={handleResendPress(item)}>
            <Icon name='refresh' color={theme.colors.iconBase} size={18} />
          </Pressable>
        </View>
      ),
    },
  ];

  return (
    <CustomDataTable
      data={invoiceListData.data}
      columns={columns}
      page={page}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={invoiceListData.total}
      onPageChange={handlePageChange}
      error={error}
    />
  );
};

export default InvoicingListTable;
