import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './useAuth';

interface WebSocketMessage {
  type: string;
  payload: any;
}

interface WebSocketResponse {
  type: string;
  success?: boolean;
  message?: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketResponse | null;
}

const WS_URL = 'wss://your-websocket-server.com'; // Replace with your actual WebSocket URL

export function useWebSocket(): UseWebSocketReturn {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketResponse | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (!isAuthenticated || !user?.token) {
      return;
    }

    try {
      const wsUrl = `${WS_URL}?token=${user.token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketResponse;
          setLastMessage(data);
          console.log('WebSocket message received:', data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts.current < 5) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [isAuthenticated, user?.token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'User logout');
    }
    
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, isAuthenticated, user?.token]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && isAuthenticated && !isConnected) {
        connect();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Keep connection alive in background for real-time notifications
      }
    };

    if (Platform.OS !== 'web') {
      // In a real React Native app, you would use AppState
      // import { AppState } from 'react-native';
      // AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      if (Platform.OS !== 'web') {
        // AppState.removeEventListener('change', handleAppStateChange);
      }
    };
  }, [connect, isAuthenticated, isConnected]);

  return {
    isConnected,
    sendMessage,
    lastMessage,
  };
}