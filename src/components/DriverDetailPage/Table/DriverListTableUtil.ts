import { ReactNode } from 'react';
import {  IDriver, IDriverListFilter, IDriverListResponse } from 'src/components/DriverDetailPage/DriverListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type IDriverListWithActions = IDriver & {
    actions?: unknown;
};

interface DriverListTableProps {
    DriverListData:IDriverListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter:IDriverListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof IDriver) => void;
    error?: string;
}

export {DriverListTableProps, TableColumn, IDriverListWithActions }
