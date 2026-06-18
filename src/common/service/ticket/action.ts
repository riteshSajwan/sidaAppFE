import { getAllTicket, getOrderDetailsByTicketId, saveTicket } from 'src/common/service/ticket/api';
import { fetchTicketDetailsFailure, fetchTicketDetailsRequest, fetchTicketDetailsSuccess, fetchTicketListingFailure, fetchTicketListingRequest, fetchTicketListingSuccess, updateTicketStatusFailure, updateTicketStatusRequest, updateTicketStatusSuccess } from 'src/common/service/ticket/slice';
import { ITicket, ITicketStatusRequest } from 'src/components/TicketPage/TicketDetailUtil';
import { ITicketListFilter } from 'src/components/TicketPage/TicketListUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchTicketListingAction = (filter: ITicketListFilter, page: number, size: number): AppThunk => (dispatch) => {
  dispatch(fetchTicketListingRequest());
  return getAllTicket(filter, page, size)
    .then((result) => {
      dispatch(fetchTicketListingSuccess(result));
      return result;
    })
    .catch(() => {
      dispatch(fetchTicketListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
      );
    });
};
export const fetchTicketDetailsAction = (id: string): AppThunk<Promise<ITicket | undefined>> =>
  (dispatch) => {
    dispatch(fetchTicketDetailsRequest());
    return getOrderDetailsByTicketId(id)
      .then((result: ITicket) => {
        dispatch(fetchTicketDetailsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(fetchTicketDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return undefined;
      });
  };

export const updateTicketStatusAction =(payload: ITicketStatusRequest): AppThunk<Promise<boolean>> =>(dispatch) => {
      dispatch(updateTicketStatusRequest());
      return saveTicket(payload)
        .then(() => {
          dispatch(updateTicketStatusSuccess());
          return true;
        })
        .catch(() => {
          dispatch(updateTicketStatusFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
          );
          return false;
        });
    };
