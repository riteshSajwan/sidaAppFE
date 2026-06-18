import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { IStatusType } from 'src/components/TicketPage/TicketDetailUtil';
import { IItemPageList } from 'src/common/layouts/Header/HeaderUtil';

interface ITicket {
  id: number;
  userId: number;
  orderId: number;
  userRole: string;
  ticketTarget:  string;
  ticketType:  string;
  description: string;
  imageId: string | null;
  ticketStatus: string;
  comments: string | null;
  createdAt: string; 
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  ticketTypeDescription:string
}

interface ITicketListFilter {
  searchKey?: string;
  ticketStatus?: string;
  sortField?:string,
  sortOrder?:string,
}

interface ITicketListTempFilter {
  ticketStatus: string;
  searchKey: string;
}

interface ITickeListResponse extends IItemPageList {
  data: ITicket[];
}

function generateTicketListData(): ITickeListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE
  };
}


function generateInitialFilterData(): ITicketListFilter {
  return {
    ticketStatus: 'ALL',
    searchKey: '',
  }
}

function generateInitialTempFilterData(): ITicketListTempFilter {
    return {
        ticketStatus: 'ALL',
        searchKey: '',
    }
}

 
 

function orderStatusOptions() {
  return [ {
    label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.All'),
    value: IStatusType.ALL,
  },
  {
    label: translateMessage('Admin.Delivery.App.OrderList.Filter.OPEN'),
    value: IStatusType.OPEN,
  },
  {
    label: translateMessage('Admin.Delivery.App.OrderList.Filter.Close'),
    value: IStatusType.CLOSED,
  },]
};


export {
    ITicket,
    ITickeListResponse,
    ITicketListFilter,
    ITicketListTempFilter,
    generateTicketListData,
    generateInitialFilterData,
    generateInitialTempFilterData,
    orderStatusOptions,
  };
  
