import { ReactNode } from 'react';
import { IRequest, IRequestListFilter, IRequestListResponse } from 'src/components/RequestManagement/RequestListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IRequestListWithActions = IRequest & {
    actions?: unknown;
};

interface RequestListTableProps {
    requestListData:IRequestListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter:IRequestListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof IRequest) => void;
    error?: string;
}

export { RequestListTableProps, TableColumn, IRequestListWithActions }
