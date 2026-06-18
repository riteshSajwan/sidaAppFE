import { AUTH_BASE_URL } from 'src/constants';
import RestService from 'src/common/service/restService/restService';
import { IChatResponse } from 'src/components/Chat/ChatUtils';


const getAllChatSupportList = (page?: number, size?: number): Promise<IChatResponse> => {
  const queryParams = [`page=${page}`, `size=${size}`,]
    .filter(Boolean)
    .join("&");
  return RestService.generateHeaders()
    .then((headers) => {
      return RestService.fetch(
        AUTH_BASE_URL + `/api/delivery/recentChatrooms?${queryParams}`,
        {
          method: "GET",
          headers,
        }
      );
    });
};

const updateLatestMessage = (roomId: string, message: string, userId: number | undefined): Promise<void> => {
  return RestService.generateHeaders()
    .then((headers) => {
      return RestService.fetch(
        AUTH_BASE_URL +
        `/api/delivery/chatroom/update?roomId=${roomId}&msg=${message}&senderId=${userId}`,
        {
          method: "PUT",
          headers,
        }
      );
    });
};
export const sendMessageEvent = (
  roomId: string,
  message: string,
): Promise<void> => {
  return RestService.generateHeaders({
        'Content-type': 'application/json',
    }).then((headers) => {
    return RestService.fetch(
      `${AUTH_BASE_URL}/api/delivery/message/event`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roomId,
          message,
          type: 'TEXT',
        }),
      }
    );
  });
};


export { getAllChatSupportList, updateLatestMessage } 