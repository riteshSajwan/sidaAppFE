import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setConnectionError,setConnectionStatus, WsConnectionStatus,} from 'src/common/service/websocket/newBookingNotificationSlice';
import { playBookingNotificationSound } from 'src/common/service/websocket/bookingNotificationSound';
import { bookingWebSocketService } from 'src/common/service/websocket/bookingWebSocketService';
import { getTenantId } from 'src/common/utils/tenantUtils';
import { WEBSOCKET_BASE_URL } from 'src/constants';
import { AppDispatch, RootState } from 'src/store';
import { handleNewBookingNotification, INewBookingMessage } from 'src/common/service/websocket/newBookingNotificationActions';

interface UseOrderWebSocketProps {
  enabled?: boolean;
  websocketUrl?: string;
}

export const useOrderWebSocket = ({
  enabled = true,
  websocketUrl = WEBSOCKET_BASE_URL,
}: UseOrderWebSocketProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  const userId = useSelector((state: RootState) => state.profile.data?.id);
  const connectionStatus = useSelector(
    (state: RootState) => state.newBookingNotification.connectionStatus
  );

  const isConnectingRef = useRef(false);
  const lastUserIdRef = useRef<number | null>(null);

  // Stable refs for callbacks — avoids stale closures without reconnecting
  const onNewOrderRef = useRef<(data: INewBookingMessage) => void>(() => {});
  const onConnectRef = useRef<() => void>(() => {});
  const onDisconnectRef = useRef<(event?: CloseEvent) => void>(() => {});
  const onErrorRef = useRef<(error: Event | string) => void>(() => {});

  onNewOrderRef.current = (data: INewBookingMessage) => {
    playBookingNotificationSound();
    dispatch(handleNewBookingNotification(data));
  };

  onConnectRef.current = () => {
    dispatch(setConnectionStatus(WsConnectionStatus.CONNECTED));
    isConnectingRef.current = false;
  };

  onDisconnectRef.current = (event?: CloseEvent) => {
    if (event && event.code !== 1000) {
      dispatch(
        setConnectionError(
          `Socket closed (${event.code}${event.reason ? `: ${event.reason}` : ''})`
        )
      );
      isConnectingRef.current = false;
      return;
    }
    dispatch(setConnectionStatus(WsConnectionStatus.DISCONNECTED));
    isConnectingRef.current = false;
  };

  onErrorRef.current = (error: Event | string) => {
    const errorMessage = typeof error === 'string' ? error : 'Connection failed';
    dispatch(setConnectionError(errorMessage));
    isConnectingRef.current = false;
  };

  const buildSocketUrl = useCallback(
    (baseUrl: string, tenantId: string | null) => {
      if (!tenantId) return baseUrl;
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}tenantId=${encodeURIComponent(tenantId)}`;
    },
    []
  );

  const connect = useCallback(() => {
    if (!enabled || !websocketUrl || !isLoggedIn || !userId || isConnectingRef.current) {
      return;
    }

    if (bookingWebSocketService.isConnected() && lastUserIdRef.current === userId) {
      return;
    }

    isConnectingRef.current = true;
    lastUserIdRef.current = userId;
    dispatch(setConnectionStatus(WsConnectionStatus.CONNECTING));

    getTenantId()
      .then((tenantId) => {
        const socketUrl = buildSocketUrl(websocketUrl, tenantId);

        return bookingWebSocketService.connect({
          url: socketUrl,
          tenantId: tenantId ?? undefined,
          onNewOrder: (data) => onNewOrderRef.current(data),
          onConnect: () => onConnectRef.current(),
          onDisconnect: (event) => onDisconnectRef.current(event),
          onError: (error) => onErrorRef.current(error),
          reconnectInterval: 5000,
          maxReconnectAttempts: 5,
        });
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
        dispatch(setConnectionError(errorMessage));
        isConnectingRef.current = false;
      });
  }, [dispatch, enabled, buildSocketUrl, isLoggedIn, userId, websocketUrl]);

  const disconnect = useCallback(() => {
    bookingWebSocketService.disconnect();
    dispatch(setConnectionStatus(WsConnectionStatus.DISCONNECTED));
    isConnectingRef.current = false;
    lastUserIdRef.current = null;
  }, [dispatch]);

  useEffect(() => {
    if (enabled && isLoggedIn && userId && websocketUrl) {
      connect();
      return () => {
        disconnect();
      };
    }

    disconnect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled, isLoggedIn, userId, websocketUrl]);

  return {
    connect,
    connectionStatus,
    disconnect,
    isConnected: connectionStatus === WsConnectionStatus.CONNECTED,
  };
};
