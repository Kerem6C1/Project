const WS_URL = __DEV__ ? 'ws://localhost:8080' : 'wss://api.zynap.com/ws';

export function useWebSocket(): UseWebSocketReturn {
  const { user, isAuthenticated } = useAuth();

  const connect = useCallback(() => {
    if (!isAuthenticated || !user?.token) {
      console.log('WebSocket connection skipped: not authenticated');
      return;
    }

    try {
      const wsUrl = `${WS_URL}?token=${encodeURIComponent(user.token)}&deviceId=${encodeURIComponent(user.deviceId)}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Send authentication message
        sendMessage({
          type: 'authenticate',
          payload: {
            userId: user.userId,
            deviceId: user.deviceId,
            token: user.token
          }
        });
      };

      wsRef.current.onmessage = (event) => {

        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && reconnectAttempts.current < 5) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };
    } catch (error) {
    }
  }, [isAuthenticated, user]);
}