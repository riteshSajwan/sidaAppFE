import { IInvoiceListResponse, IInvoice, InvoiceStatusType } from 'src/components/Invoicing/InvoicingListUtil';

interface InvoiceListTableProps {
  invoiceListData: IInvoiceListResponse;
  page: number;
  currentStatus: string;
  selectedInvoiceIds: string[];
  handlePageChange: (page: number) => void;
  handleDownloadPress: (invoice: IInvoice) => () => void;
  handleResendPress: (invoice: IInvoice) => () => void;
  handleSelectInvoice: (invoiceId: string) => void;
  error?: string;
}
type IInvoiceListWithActions = IInvoice & {
  actions?: unknown;
};

const shouldShowSelection = (status: string) => status === InvoiceStatusType.REPORT_GENERATED;

export { InvoiceListTableProps, shouldShowSelection ,IInvoiceListWithActions};
