import React from 'react';
import {Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import CustomDataTable from 'src/common/components/CustomDataTable/CustomDataTable';
import { useWalletStyle } from 'src/components/DriverDetailPage/DriverWallet/Table/DriverWalletListStyle';
import useCurrencyFormatter from 'src/common/hook/useCurrencyFormator';
import { formatToDateMonthYear } from 'src/common/utils/dateUtil';
import { IWallet, TransactionStatus, TransactionStatusLabel } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';
import { IWalletListWithActions, TableColumn, WalletListTableProps } from 'src/components/DriverDetailPage/DriverWallet/Table/DriverWalletListTableUtil';

const DriverWalletListTable = ({
  walletListData,
  page,
  handleSort,
  handlePageChange,
  handleViewDetailsPress,
  error = '',
}: WalletListTableProps) => {
  const { t: TranslateMessage } = useTranslation();
  const currencyFormate = useCurrencyFormatter();
  const numberOfPages = Math.ceil(walletListData.total / DEFAULT_TABLE_SIZE);
  const walletStyles = useWalletStyle();

  function renderDate(item: IWallet) {
    return <Text style={walletStyles.dateText}>{formatToDateMonthYear(item.createdAt)}</Text>;
  }
  function renderAmountWithCurrency(item: IWallet) {
    if (item.transactionType === TransactionStatus.CREDITED) {
      return (
        <View>
          <Text style={walletStyles.refundedAmountText}>+{currencyFormate(item.amount ?? 0, item.currency ?? '')}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={walletStyles.debitedAmountText}>{currencyFormate(item.amount ?? 0, item.currency ?? '')}</Text>
        </View>
      );
    }
  }
  function renderOrder(item: IWallet) {
    return <Text style={walletStyles.dateText}>#{item.referenceId ? item.referenceId : item.orderId}</Text>
  }

  function renderTransactionStatus(item: IWallet) {
    const isDebited = item.transactionType === TransactionStatus.DEBITED;
    const isCredited = item.transactionType === TransactionStatus.CREDITED;
  
    return (
      <View>
        <Text
          style={[
            walletStyles.refundedStatus,
            (isDebited || isCredited) && {
              backgroundColor: isDebited ? 'red' : 'green',
              color: 'white',
            },
          ]}
        >
          {TranslateMessage(TransactionStatusLabel[item.transactionType as TransactionStatus] as string)}
        </Text>
      </View>
    );
  }
  const columns: TableColumn<IWalletListWithActions>[] = [
    {
      key: 'referenceId',
      title: 'ID',
      render: (item: IWallet) => renderOrder(item),
      sortable: true,
    },
    {
      key: 'updatedAt',
      title: 'Date',
      sortable: true,
      render: (item: IWallet) => renderDate(item),
    },
    {
      key: 'amount',
      title: 'Credit Amount',
      render: (item: IWallet) => renderAmountWithCurrency(item),
      sortable: true,
    },
    {
      key: 'transactionType',
      title: 'Transaction Type',
      render: (item: IWallet) => renderTransactionStatus(item),
      sortable: true,
    },
  ];

  return (
    <CustomDataTable
      data={walletListData.userTransactionDto}
      columns={columns}
      // sortField={filter.sortField}
      // sortOrder={filter.sortOrder}
      page={page}
      // onSort={handleSort}
      numberOfPages={numberOfPages}
      rowsPerPage={DEFAULT_TABLE_SIZE}
      totalItems={walletListData.total}
      onPageChange={handlePageChange}
      error={error}
    />
  );
};

export default DriverWalletListTable;
