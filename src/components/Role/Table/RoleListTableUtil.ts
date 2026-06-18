import { ReactNode } from 'react';
import { LanguageConvert } from 'src/common/components/LangaugeSelector/LanguageSelectorUtil';
import { ICoupon, ICouponListFilter, ICouponListResponse} from 'src/components/CouponPage/CouponListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type ICouponListWithActions = ICoupon & {
    actions?: unknown;
};

interface CouponListTableProps {
    couponListData:ICouponListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter?:ICouponListFilter ;
    handleEditPress: (id: number) => () => void;
    handleSort?: (key: keyof ICoupon) => void;
    error?: string;
    handleTogglePress:(id: number) => (isActive: boolean)=>void;
}
export const getCouponNameByLanguage = (
    language: string | undefined,
    couponName: string,
    couponFrenchName: string
  ) => {
    switch (language) {
      case LanguageConvert.FRENCH:
        return couponFrenchName ;
      case LanguageConvert.ENGLISH:
        return couponName ;
      default:
        return couponName;
    }
  };

export { CouponListTableProps, TableColumn, ICouponListWithActions }
