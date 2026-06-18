import { ReactNode } from 'react';
import { IWallet, IWalletListResponse } from 'src/components/DriverDetailPage/DriverWallet/DriverWalletListUtil';
import { translateMessage } from 'src/i18n/createTranslation';


interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IWalletListWithActions = IWallet & {
  actions?: unknown;
};

interface WalletListTableProps {
    walletListData:IWalletListResponse ;
    page: number;
    handlePageChange: (page: number) => void;
    filter:IWalletListResponse;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof IWallet) => void;
    error?: string;
}
enum  transactionStatus {
    ALL = 'ALL',
    REFUNDED = 'refunded',
    DEBITED = 'DEBITED',
    CREDITED='CREDITED'
}
function WalletTransactionStatus() {
  return [
    {
      label: translateMessage('Admin.Delivery.App.All.TransactionHistory'),
      value: transactionStatus.ALL,
    },
    {
      label: translateMessage('Admin.Delivery.App.Driver.Wallets.Credited'),
      value: transactionStatus.CREDITED,
    },
    {
      label: translateMessage('Admin.Delivery.App.Driver.Wallets.Debited'),
      value: transactionStatus.DEBITED,
    },
  ];
}


export { WalletListTableProps, TableColumn, IWalletListResponse, IWalletListWithActions, WalletTransactionStatus,transactionStatus }
