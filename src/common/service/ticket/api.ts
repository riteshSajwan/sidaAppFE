import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { ITickeListResponse, ITicketListFilter } from 'src/components/TicketPage/TicketListUtil';
import { buildQueryParam } from 'src/common/service/ApiUtil';
import { ITicket, ITicketStatusRequest } from 'src/components/TicketPage/TicketDetailUtil';
const getAllTicket = (filter: ITicketListFilter,page?: number,size?: number): Promise<ITickeListResponse> => {
  return RestService.generateHeaders().then((headers) => {
      const queryParams = [
        buildQueryParam('searchKey', filter.searchKey),
        buildQueryParam('sortField', filter.sortField),
        buildQueryParam('sortOrder', filter.sortOrder),
        buildQueryParam('ticketStatus', filter.ticketStatus),
        `page=${page}`,
        `size=${size}`,
      ]
        .filter(Boolean)
        .join('&');
      return RestService.fetch(`${AUTH_BASE_URL}/api/order/tickets/getPaginated?${queryParams}`,{
          method: 'GET',
          headers,
        }
      );
    })
    .then((result) => result.response);
};


const getOrderDetailsByTicketId = (ticketId: string): Promise<ITicket> => {
  return RestService.generateHeaders({'Content-Type': 'application/json; charset=UTF-8',}).then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/order/tickets/getTicket/${ticketId}`,
      {
        method: 'GET',
        headers,
      }
    );
  });
};


const saveTicket = (data: ITicketStatusRequest) => {
  return RestService.generateHeaders({'Content-type': 'application/json; charset=UTF-8',}).then((headers) => {
      return RestService.fetch(
        AUTH_BASE_URL + `/api/order/tickets/updateTicketStatus`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(data),
        }
      );
    });
};


export { getAllTicket, getOrderDetailsByTicketId, saveTicket }