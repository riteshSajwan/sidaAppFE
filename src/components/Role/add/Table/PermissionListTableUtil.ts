import { ReactNode } from 'react';
import { IMenu } from 'src/components/Role/add/AddRoleUtil';

interface TableColumn<T> {
  key: keyof T | 'actions';
  title: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  isDashboard?: boolean;
}

export interface IPermissionSelection {
  menuId: number;
  view: boolean;
  edit: boolean;
}

type IPermissionListWithActions = IMenu & {
  actions?: unknown;
};

interface PermissionListTableProps {
  permissionListData: IMenu[];
  selectedPermissions: IPermissionSelection[];
  onPermissionChange: (menuId: number, type: 'view' | 'edit') => void;
  error?: string;
}

export { IPermissionListWithActions, PermissionListTableProps, TableColumn };
