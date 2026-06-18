import { translateMessage } from 'src/i18n/createTranslation';

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
interface IOption {
  label: string;
  value: number;
}
interface ICutsomerData{
  year:string,
  monthName:string,
  count:number
  totalSales?:number
  totalProfit?:number
}

interface IReportCardProps  {
    id: number;
    amount: number;
    messageKey: string;
};
interface DashboardCardDTO {
id: number;
amount: number|string;
messageKey: string;
currency?:string;
}
function generateInitialData(): DashboardCardDTO[] {
    return [
      { id: 1, amount: 0, messageKey: 'Admin.Delivery.App.Dashboard.TotalWalletBalance',currency:'' },
      { id: 2, amount: 0, messageKey: 'Admin.Delivery.App.Drivers.Working.List' },
      { id: 3, amount: 0, messageKey: 'Admin.Delivery.App.Support.Requests' }
    ];
  }



interface NewChartProps {
	startMonth: string;
	endMonth: string;
}
const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getCurrentMonthDateRange = (): string => {
  const today = new Date();
  return `${formatDate(new Date(today.getFullYear(), today.getMonth(), 1))} to ${formatDate(today)}`;
};
export const getDefaultStartAndEndMonth = () => {
  const currentDate = new Date();
  const end = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
  const start = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  return { start, end };
};



export {ICutsomerData,generateInitialData,NewChartProps, IReportCardProps,IOption , getCurrentMonthDateRange }
