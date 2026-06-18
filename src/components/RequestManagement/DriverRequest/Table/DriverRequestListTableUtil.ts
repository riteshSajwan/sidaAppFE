import { ReactNode } from 'react';
import { IDriverRequest, IDriverRequestListFilter, IDriverRequestListResponse } from 'src/components/RequestManagement/DriverRequest/DriverRequestListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IDriverRequestListWithActions = IDriverRequest & {
    actions?: unknown;
};

interface DriverRequestListTableProps {
    driverRequestListData:IDriverRequestListResponse ;
    page: number;
    handlePageChange: (page: number) => void;
    filter:IDriverRequestListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof IDriverRequest) => void;
    error?: string;
}

export { DriverRequestListTableProps, TableColumn, IDriverRequestListWithActions }
