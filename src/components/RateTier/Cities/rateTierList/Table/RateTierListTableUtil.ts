import { ReactNode } from 'react';
import { IRateTierList, IRateTierListResponse } from 'src/components/RateTier/Cities/rateTierList/RateTierListingUtil';


interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    isDashboard?:boolean;
}

type IRateListListWithActions = IRateTierList & {
    actions?: unknown;
};

interface RateTierListTableProps {
    id:string
    rateTierListData:IRateTierListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    handleViewDetailsPress: (id: string, title: string) => () => void;
    handleEditPress: (id: number) => () => void;
    canEdit: boolean;
    error?: string;
}


export { IRateListListWithActions, RateTierListTableProps, TableColumn };

