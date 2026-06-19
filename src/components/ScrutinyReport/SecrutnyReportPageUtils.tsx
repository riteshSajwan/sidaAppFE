// import { ReactNode } from 'react';
// // import { IBanner, IBannerListFilter, IBannerListResponse } from 'src/components/BannerPage/BannerListUtil';

// interface TableColumn<T> {
//     key: keyof T | 'actions';
//     title: string;
//     sortable?: boolean;
//     render?: (item: T) => ReactNode;
//     isDashboard?:boolean;
// }

// type IReportListWithActions = IBanner & {
//     actions?: unknown;
    
// };

// interface bannerListTableProps {
//     bannerListData:IBannerListResponse ;
//     page: number;
//     isDashboard?:boolean;
//     handlePageChange: (page: number) => void;
//     filter?:IBannerListFilter;
//     handleViewDetailsPress: (id: string, title:string) => () => void;
//     handleEditPress: (id: string) => () => void;
//     handleSort?: (key: keyof IBanner) => void;
//     handleTogglePress:(id: number) => (isActive: boolean)=>void;
//     error?: string;
    
// }

// export {bannerListTableProps, TableColumn, IReportListWithActions }
