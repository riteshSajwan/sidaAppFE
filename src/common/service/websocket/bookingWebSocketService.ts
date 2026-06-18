import { INewBookingMessage } from 'src/common/service/websocket/newBookingNotificationActions';

interface IBookingWebSocketConfig {
  url: string;
  tenantId?: string | null;
  onNewOrder: (data: INewBookingMessage) => void;
  onConnect: () => void;
  onDisconnect: (event?: CloseEvent) => void;
  onError: (error: Event | string) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

class BoookingWebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private config: IBookingWebSocketConfig | null = null;

  public connect(config: IBookingWebSocketConfig): Promise<void> {
    if (!config.url) {
      return Promise.resolve();
    }

    // Fully tear down any existing connection before creating a new one.
    // We set shouldReconnect = false first so the onclose handler won't
    // trigger tryReconnect while we're in the middle of reconnecting.
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onclose = null; // detach handler to avoid race
      this.socket.close();
      this.socket = null;
    }

    this.reconnectAttempts = 0;
    this.config = config;
    this.shouldReconnect = true;

    return this.createConnection();
  }

  public disconnect(): void {
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.onclose = null; // detach to prevent tryReconnect on intentional close
      this.socket.close();
      this.socket = null;
    }

    this.reconnectAttempts = 0;
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  private createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        resolve();
        return;
      }

      // Browser WebSocket API cannot send custom headers.
      // tenantId is passed as a query param: ?x-tenant-id=<tenantId>
      const protocols = undefined;

      this.socket = new WebSocket(this.config.url, protocols);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.config?.onConnect();
        resolve();
      };

      this.socket.onmessage = (event) => {
        const parsedData = this.parseMessage(event.data);

        if (!parsedData) {
          return;
        }

        if (Array.isArray(parsedData)) {
          parsedData.forEach((item) => {
            if (item && typeof item === 'object') {
              this.config?.onNewOrder(item as INewBookingMessage);
            }
          });
          return;
        }

        if (typeof parsedData === 'object') {
          this.config?.onNewOrder(parsedData as INewBookingMessage);
        }
      };

      this.socket.onerror = (error) => {
        this.config?.onError(error);
        reject(error);
      };

      this.socket.onclose = (event) => {
        this.config?.onDisconnect(event);
        this.socket = null;
        this.tryReconnect();
      };
    });
  }

  private tryReconnect(): void {
    if (!this.shouldReconnect || !this.config) {
      return;
    }

    const maxReconnectAttempts = this.config.maxReconnectAttempts ?? 5;

    if (this.reconnectAttempts >= maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts += 1;
    const reconnectInterval = this.config.reconnectInterval ?? 5000;

    this.reconnectTimeout = setTimeout(() => {
      this.createConnection().catch(() => {});
    }, reconnectInterval);
  }

  private parseMessage(messageData: unknown): unknown {
    if (typeof messageData !== 'string') {
      return messageData;
    }

    try {
      return JSON.parse(messageData);
    } catch {
      return null;
    }
  }
}

export const bookingWebSocketService = new BoookingWebSocketService();
