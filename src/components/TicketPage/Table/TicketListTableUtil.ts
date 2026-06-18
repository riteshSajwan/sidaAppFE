import { ReactNode } from 'react';
import { ITickeListResponse, ITicket, ITicketListFilter } from 'src/components/TicketPage/TicketListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type ITicketListWithActions = ITicket & {
    actions?: unknown;
};

interface TicketListTableProps {
    ticketListData:ITickeListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter?:ITicketListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof ITicket) => void;
    canEdit: boolean;
    error?: string;
}

export { ITicketListWithActions, TableColumn, TicketListTableProps };

