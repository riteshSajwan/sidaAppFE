import { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native';
import { IActiveCity, IActiveCityListResponse, } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageCities/ManageCitiesUtil';

 interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IActiveManageCityWithActions = IActiveCity & {
    actions?: unknown;
};

interface ActiveManageCityTableProps {
    activeCities:IActiveCityListResponse ;
    page: number;
    handlePageChange: (page: number) => void;
    handleTogglePress:(id: number) => (newValue: boolean)=>void;
    handleEditPress: (id: number) => (event: GestureResponderEvent) => void;
    handleSort?: (key: keyof IActiveCity) => void;
    canEdit: boolean;
    error?: string;
}

export { ActiveManageCityTableProps, IActiveManageCityWithActions, TableColumn };

