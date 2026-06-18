import { getExtraRideChargeInvoicesByStatus, resendExtraRideChargeInvoice, settleExtraRideChargeInvoices } from 'src/common/service/invoicing/api';
import {
  fetchInvoiceListingFailure,
  fetchInvoiceListingRequest,
  fetchInvoiceListingSuccess,
  resendInvoiceFailure,
  resendInvoiceRequest,
  resendInvoiceSuccess,
  settleInvoiceFailure,
  settleInvoiceRequest,
  settleInvoiceSuccess,
} from 'src/common/service/invoicing/slice';
import { IInvoiceListFilter } from 'src/components/Invoicing/InvoicingListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchInvoiceListingAction =
  (filter: IInvoiceListFilter, page: number, size: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchInvoiceListingRequest());

    return getExtraRideChargeInvoicesByStatus(filter, page, size)
      .then((result) => {
        dispatch(fetchInvoiceListingSuccess(result));
      })
      .catch(() => {
        dispatch(
          fetchInvoiceListingFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
      });
  };

export const settleInvoiceListingAction =
  (invoiceIds: string[]): AppThunk<Promise<boolean>> =>
  (dispatch) => {
    dispatch(settleInvoiceRequest());

    return settleExtraRideChargeInvoices(invoiceIds)
      .then((response) => {
        if(response.success)
        {
          dispatch(settleInvoiceSuccess(translateMessage('Admin.Delivery.App.InvoiceSettle.Success')));
          return true;
        }
        else{
          dispatch(
            settleInvoiceFailure(
              translateMessage('Admin.Delivery.App.SomethingWentWrong')
            )
          );
          return false;
        }
    
      })
      .catch(() => {
        dispatch(
          settleInvoiceFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        return false;
      });
  };

export const resendInvoiceAction =
  (invoiceId: string): AppThunk<Promise<boolean>> =>
  (dispatch) => {
    dispatch(resendInvoiceRequest());

    return resendExtraRideChargeInvoice(invoiceId)
      .then((response) => {
        if (response === true || (typeof response === 'object' && response !== null)) {
          dispatch(resendInvoiceSuccess(translateMessage('Admin.Delivery.App.InvoiceResend.Success')));
          return true;
        }

        dispatch(
          resendInvoiceFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        return false;
      })
      .catch(() => {
        dispatch(
          resendInvoiceFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
        return false;
      });
  };
