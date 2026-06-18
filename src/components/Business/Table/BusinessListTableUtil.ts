import { ReactNode } from 'react';
import { LanguageConvert } from 'src/common/components/LangaugeSelector/LanguageSelectorUtil';
import { IBusiness, IBusinessListFilter, IBusinessListResponse } from 'src/components/Business/BusinessListUtils';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type IBuisnessListWithActions = IBusiness & {
    actions?: unknown;
};

interface BusinessListTableProps {
    businessListData:IBusinessListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter?:IBusinessListFilter ;
    handleViewDetailsPress: (id: string, title: string) => () => void;
    handleEditPress: (id: number) => () => void;
    handleSort?: (key: keyof IBusiness) => void;
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

export { BusinessListTableProps, TableColumn, IBuisnessListWithActions }
