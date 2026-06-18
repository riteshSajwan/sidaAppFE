import { ReactNode } from 'react';
import { ICountry, ICountryListResponse } from 'src/components/ManageServiceAreas/ManageActiveCountries/ManageActiveCountriesUtil';

interface TableColumn<T> {
    key: keyof T | 'actions';
    title: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type IActiveManageCountriesWithActions = ICountry & {
    actions?: unknown;
};

interface ActiveManageCountriesTableProps {
    activeCountries:ICountryListResponse ;
    page: number;
    handlePageChange: (page: number) => void;
    handleCountryPress: (id: string) => () => void;
    handleTogglePress:(id: number) => (newValue: boolean)=>void;
    handleSort?: (key: keyof ICountry) => void;
    handleEditPress:(id:number)=> () =>void;
    canEdit: boolean;
    error?: string;
}

export { ActiveManageCountriesTableProps, IActiveManageCountriesWithActions, TableColumn };

