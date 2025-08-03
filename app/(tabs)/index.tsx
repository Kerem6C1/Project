const loadChats = async () => {
    if (!isConnected) {
      console.log('Cannot load chats: WebSocket not connected');
      return;
    }
    
    setRefreshing(true);
    try {
      // Mock data for now - this would be populated from WebSocket responses
      setChats([
        {
          id: 'user1',
          name: 'Alice Smith',
          lastMessage: 'Hey, how are you doing?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          unreadCount: 2,
          isGroup: false,
        },
        {
          id: 'group1',
          name: 'Team Group',
          lastMessage: 'Meeting at 3 PM today',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0,
          isGroup: true,
        },
      ]);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setRefreshing(false);
    }
  };

        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>