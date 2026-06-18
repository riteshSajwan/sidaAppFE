interface ItopPerformer {

    id: string,
    sellerName: string,
    ReviewRating: number,
    Orders: number,
    Currency: number,
    CurrencyType: string,
    logoURL: string,
    deliveryBoy:string,
    rating:string,
    delivery:string,
}

interface ITopPerformerListResponse {
    data: ItopPerformer[];
}
interface IDashboardCardProps  {
    id: number;
    amount: number | string;
    messageKey: string;
    currency?:string;
    onPress?: () => void;
};
interface ITotalWalletBalance  {
    available: IWalletBalanceItem[];
    pending: IWalletBalanceItem[];
    livemode: string;
    timestamp: string;
    totalAmount: number;
    currency: string;
};
interface IWalletBalanceItem {
    amount: number;
    currency: string;
    amountDecimal: number;
}
interface TransactionInitiated {
    status: string;  
    count: number;
}
interface TransactionInitiatedCount {
    statusCount: TransactionInitiated[];
    totalCount: number;
}
const getInitialTransactionInitiatedCount = () => ({
    statusCount: [],
    totalCount: 0,
}); 

function generateIntialDashboardData(): ItopPerformer {
    return {
        id: '',
        sellerName: '',
        ReviewRating: 0,
        Orders: 0,
        Currency: 0,
        CurrencyType: '',
        logoURL: '',
        deliveryBoy:'',
        rating:'',
        delivery:'',
    };
}
interface IDashboardProps {
    isDashboard?: boolean;
  }
interface DashboardCardDTO {
id: number;
amount: number|string;
messageKey: string;
currency?:string
}
function generateInitialData(): DashboardCardDTO[] {
    return [
      { id: 1, amount: 0, messageKey: 'Admin.Delivery.App.Dashboard.TotalWalletBalance',currency:'' }, 
      { id: 2, amount: 0, messageKey: 'Admin.Delivery.App.Drivers.Working.List' },
      { id: 3, amount: 0, messageKey: 'Admin.Delivery.App.Support.Requests' }
    ];
  }
  
function generateDashboardListData(): ITopPerformerListResponse {
    return {
        data: [],
    }
}

export {getInitialTransactionInitiatedCount,generateInitialData, generateIntialDashboardData, generateDashboardListData, ItopPerformer, ITopPerformerListResponse,IDashboardProps,IDashboardCardProps,ITotalWalletBalance,IWalletBalanceItem,TransactionInitiatedCount }
