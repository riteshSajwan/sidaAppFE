import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface IInvoice {
  id: string;
  invoiceId: string;
  invoiceUrl: string;
}

interface IInvoiceListResponse {
  data: IInvoice[];
  total: number;
  page: number;
  size: number;
}

interface IInvoiceListFilter {
  searchKey: string;
  status: string;
}

interface IInvoiceListTempFilter {
  searchKey: string;
  status: string;
}


interface IInvoiceSettleResponse {
  success: boolean
}


export enum InvoiceStatusType {
  REPORT_GENERATED = 'REPORT_GENERATED',
  SETTLED = 'SETTLED',
  ALL = 'ALL',
}

function generateInvoiceListData(): IInvoiceListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE,
  };
}

function generateInitialFilterData(): IInvoiceListFilter {
  return {
    searchKey: '',
    status: 'ALL',
  };
}

function generateInitialTempFilterData(): IInvoiceListTempFilter {
  return {
    searchKey: '',
    status: InvoiceStatusType.ALL,
  };
}

function invoiceStatusOptions() {
  return [
    {
      label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.All'),
      value: InvoiceStatusType.ALL,
    },
    {
      label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.Generated'),
      value: InvoiceStatusType.REPORT_GENERATED,
    },
    {
      label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.Settled'),
      value: InvoiceStatusType.SETTLED,
    },
  ];
}

function normalizeInvoiceUrl(invoiceUrl: string): string {
  return invoiceUrl.replace(/%22$/i, '').replace(/"$/, '');
}

function getInvoiceFileName(invoiceUrl: string): string {
  const normalizedInvoiceUrl = normalizeInvoiceUrl(invoiceUrl);
  const lastSegment = normalizedInvoiceUrl.split('/').pop() || '';

  try {
    return decodeURIComponent(lastSegment);
  } catch {
    return lastSegment;
  }
}

export {
  generateInitialFilterData,
  generateInitialTempFilterData,
  generateInvoiceListData,
  getInvoiceFileName,
  IInvoice,
  IInvoiceListFilter,
  IInvoiceListResponse,
  IInvoiceListTempFilter, IInvoiceSettleResponse, invoiceStatusOptions,
  normalizeInvoiceUrl
};
