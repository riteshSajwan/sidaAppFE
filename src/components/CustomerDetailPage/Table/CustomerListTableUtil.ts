import { ReactNode } from 'react';
import {  ICustomer, IUserListFilter, IUserListResponse } from 'src/components/CustomerDetailPage/CustomerListUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface TableColumn<T> {
  key: keyof T | 'actions';
  title: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
}

type IUserListWithActions = ICustomer & {
    actions?: unknown;
  
};

interface UserListTableProps {
    userListData:IUserListResponse ;
    page: number;
    isDashboard?:boolean;
    handlePageChange: (page: number) => void;
    filter:IUserListFilter ;
    handleViewDetailsPress: (id: string, title:string) => () => void;
    handleSort?: (key: keyof ICustomer) => void;
    error?: string;
}



function customerStatus() { 
  return[
  {
    label: translateMessage(
      'Admin.Delivery.App.UserManagementList.Filter.Block'
    ),
    value: 'true'
  },
  {
    label: translateMessage(
      'Admin.Delivery.App.UserManagementList.Filter.Unblock'
    ),
    value: 'false'
  },
];
}
export { UserListTableProps, TableColumn, IUserListWithActions, customerStatus }
