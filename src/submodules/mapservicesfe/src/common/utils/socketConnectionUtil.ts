export interface ISocketMessageProps {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface ISocketConnectionProps {
  url: string;
  onMessage: (data: object) => void;
  closeSocket: () => void;
  messagePayload?: ISocketMessageProps
}

export const createSocketConnection = ({
  url,
  onMessage,
  closeSocket,
  messagePayload
}: ISocketConnectionProps) => {
  const socket = new WebSocket(url);
  socket.onopen = () => {
    console.info('Connected to WebSocket Server');
  };

  socket.onmessage = (event) => {
    if (onMessage) {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    }
  };

  socket.onerror = (error) => {
    closeSocket();
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    closeSocket();
    console.info('WebSocket connection closed');
  };

  const sendMessage = (messagePayload: ISocketMessageProps) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(messagePayload));
    }
  };

  const closeConnection = () => {
    socket.close();
  };

  return {
    socket,
    sendMessage,
    closeConnection,
  };
};
