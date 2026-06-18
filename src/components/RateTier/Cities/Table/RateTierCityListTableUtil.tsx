import { ReactNode } from 'react';
import { IRateTierCity, IRateTierCityListFilter, IRateTierCityListResponse } from 'src/components/RateTier/Cities/RateTierCityListUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IRateTierCityListWithActions = IRateTierCity & {
    actions?: unknown;
};

interface RateTierCityListTableProps {
    rateTierCityListData:IRateTierCityListResponse ;
    page: number;
    handlePageChange: (page: number) => void;
    filter:IRateTierCityListFilter ;
    handleViewDetailsPress: (id: string) => () => void;
    handleSort?: (key: keyof IRateTierCity) => void;
    error?: string;
}

export { RateTierCityListTableProps, TableColumn, IRateTierCityListWithActions }
