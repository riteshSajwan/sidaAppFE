import { buildQueryParam } from 'src/common/service/ApiUtil';
import RestService from 'src/common/service/restService/restService';
import {
  IInvoiceListFilter,
  IInvoiceListResponse,
  IInvoiceSettleResponse,
  InvoiceStatusType,
} from 'src/components/Invoicing/InvoicingListUtil';
import { AUTH_BASE_URL } from 'src/constants';

const getExtraRideChargeInvoicesByStatus = (
  filter?: IInvoiceListFilter,
  page?: number,
  size?: number
): Promise<IInvoiceListResponse> => {
  return RestService.generateHeaders().then((headers) => {
    const status = filter?.status ?? '';
    const normalizedStatus =
      status && status !== InvoiceStatusType.ALL ? status : '';
    const queryParams = [
      buildQueryParam('searchKey', filter?.searchKey),
      `page=${page}`,
      `size=${size}`,
    ]
      .filter(Boolean)
      .join('&');
    const statusPath = normalizedStatus ? `/status/${normalizedStatus}` : '/status/ALL';

    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/extra-ride-charges/invoices${statusPath}?${queryParams}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};

const settleExtraRideChargeInvoices = (invoiceIds: string[]) : Promise<IInvoiceSettleResponse>=> {
  return RestService.generateHeaders({ 'Content-type': 'application/json; charset=UTF-8' }).then((headers) =>
    RestService.fetch(
      `${AUTH_BASE_URL}/api/order/extra-ride-charges/settle`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(invoiceIds),
      }
    )
  );
};

const resendExtraRideChargeInvoice = (invoiceId: string): Promise<unknown> => {
  return RestService.generateHeaders().then((headers) =>
    RestService.fetch(
      `${AUTH_BASE_URL}/api/order/extra-ride-charges/invoices/${invoiceId}/resend`,
      {
        method: 'POST',
        headers,
      }
    )
  );
};

export { getExtraRideChargeInvoicesByStatus, resendExtraRideChargeInvoice, settleExtraRideChargeInvoices };
