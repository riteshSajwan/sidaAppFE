import { TableRowBase } from 'src/common/components/CustomDataTable/CustomDataTable';
import { DateType } from 'src/components/Business/BusinessListUtils';
import { TLocaleId } from 'src/i18n/localesTypes';

interface IWallet extends Partial<TableRowBase> {
    amount: number,
    createdAt: string,
    currency: string,
    referenceId: number,
    source: string,
    status: string,
    transactionType: string,
    orderId:string,
    updatedAt:string
}
interface IWalletListResponse {
    userTransactionDto: IWallet[];
    page: number;
    size: number;
    total: number;
}

interface IWalletListFilter {
    firstName: string;
    phoneNumber: string;
    activeStatus: string;
    email: string;
    searchKey: string;
    sortField: string;
    sortOrder: string;
    approvalRequestStatus: string;
    type: string;
    createdAt: DateType | null;
    order: string,
    creditAmount: string,
    status:string
}

interface IWalletListTempFilter {
    status: string;
    createdAt: DateType | null;
    firstName: string;
    searchKey: string;
}

interface IAprovalCountResponse {
    totalRequest: number;
    pendingRequest: number;
}

// function generateWalletListData(): IWalletListResponse {
//     return {
//         data: [],
//         page: 0,
//         size: DEFAULT_TABLE_SIZE,
//         total: 0,
//     }
// }

function generateInitialFilterData(): IWalletListFilter {
    return {
        firstName: '',
        searchKey: '',
        phoneNumber: '',
        activeStatus: '',
        email: '',
        sortField: '',
        sortOrder: '',
        approvalRequestStatus: '',
        createdAt: null,
        type: 'restaurant',
        order: '',
        creditAmount: '',
        status: TransactionStatus.ALL,
    }
}

function generateInitialTempFilterData(): IWalletListTempFilter {
    return {
        status: TransactionStatus.ALL,
        createdAt: null,
        firstName: '',
        searchKey: '',
    }
}

function generateInitialApprovalCountData(): IAprovalCountResponse {
    return {
        totalRequest: 0,
        pendingRequest: 0,
    }
}



enum WalletType {
    RESTAURANT = 'restaurant',
    CUSTOMER = 'customer',
    DRIVER = 'driver'
}

enum TransactionStatus {
    ALL = 'ALL',
    // REFUNDED= 'refunded',
    DEBITED= 'DEBITED',
    CREDITED='CREDITED'
}

export const TransactionStatusLabel: {[key in TransactionStatus]: TLocaleId}={
    [TransactionStatus.  ALL]: 'Admin.Delivery.App.Wallet.Transaction.Type.ALL',
    [TransactionStatus.DEBITED]:  'Admin.Delivery.App.Wallet.Transaction.Type.DEBITED',
    [TransactionStatus.CREDITED]: 'Admin.Delivery.App.Wallet.Transaction.Type.CREDITED'
 }

export {
    IWallet,
    IWalletListResponse,
    IWalletListTempFilter,
    IWalletListFilter,
    IAprovalCountResponse,
    generateInitialTempFilterData,
    generateInitialFilterData,
    generateInitialApprovalCountData,
    // generateWalletListData,
    WalletType,
    TransactionStatus
};
