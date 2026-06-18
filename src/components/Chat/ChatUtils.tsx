
import moment from 'moment';
import { IconName } from 'src/submodules/iconlibrary/src/assets/icons';

type IChatMemberItem ={
    id: string;
    firstUser: number;
    firstUserName: string;
    firstUserProfileUrl: string | null;
    secondUser: number;
    secondUserName: string | null;
    lastMsg: string;
    createdAt: string | null;
    updatedAt: string | null;
    firstUserRole?: string;
    sellerName?:string
  }
  
type IChatResponse ={
    data: IChatMemberItem[];
    total: number;
    page: number;
    size: number;
  }
type ChatMessage = {
  activity: string;
  id: string;
  isPin: boolean;
  isdeleted: number;
  messageType: string;
  nickname: string;
  text: string;
  timestamp: string;
  Pname?:{name:string|null, profileUrl:string|null}

};
type SharedChatProps = {
  initialMessages?: ChatMessage[];
  onSendMessage: (message: string) => void;
  selectedUser: IChatMemberItem | undefined
  setText: (text: string) => void,
  text: string,
  scrollToBottomTrigger:boolean,
  loadMore:()=>void,
  readOnly?: boolean,
  showSenderName?: boolean,
};

const DEFAULT_USER_LIST_SIZE=50;





function generateSupportListData(): IChatResponse {
    return {
      data: [],
      total: 0,
      page: 0,
      size: DEFAULT_USER_LIST_SIZE
    };
  }

function convertUTCToLocalMessageDate(value: string) {
  return moment(value).local().format('MMM DD, YYYY');
};
type IErrorState = {
  jitsiError: string;
  apiError: string;
}
function generateError(): IErrorState {
  return {
    jitsiError: '',
    apiError: ''
  };
}
type ISuppportListProps = {
  users: IChatMemberItem[];
  onUserSelect: (user: IChatMemberItem) => void;
  onEndReached: () => void;
  selectedUser:IChatMemberItem | undefined
};
type  GroupedMessage = {
  date: string;
  messages: ChatMessage[];
}

export enum UserRole {
  RIDER = 'RIDER',
  USER = 'USER',
  RESTAURANT = 'OWNER',
}

function getUserImage(role: string | null) {
  switch (role) {
    case UserRole.RIDER:
      return require('src/common/assets/images/riderIcon.png');
    case UserRole.USER:
      return require('src/common/assets/images/cutomerIcon.png');
    case UserRole.RESTAURANT:
      return require('src/common/assets/images/sellerIcon.png');
    default:
      return require('src/common/assets/images/cutomerIcon.png');
  }
}

function getUserIconName(role: string | null): IconName {
  switch (role) {
    case UserRole.RIDER:
      return 'car';
    case UserRole.USER:
      return 'userOutline';
    case UserRole.RESTAURANT:
      return 'restaurant';
    default:
      return 'userOutline';
  }
}


export { ChatMessage, convertUTCToLocalMessageDate, DEFAULT_USER_LIST_SIZE, generateError, generateSupportListData, getUserIconName, getUserImage, GroupedMessage, IChatMemberItem, IChatResponse, IErrorState, ISuppportListProps, SharedChatProps };
  