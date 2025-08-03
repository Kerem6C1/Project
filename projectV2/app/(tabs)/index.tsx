import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { formatTime } from '@/utils/dateUtils';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  profilePicture?: string;
}

export default function ChatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, isAuthenticated } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const styles = getStyles(isDark);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    loadChats();
  }, [isAuthenticated]);

  const loadChats = async () => {
    if (!isConnected) return;
    
    setRefreshing(true);
    try {
      // Get recent messages to build chat list
      sendMessage({
        type: 'get_messages',
        payload: {}
      });
      
      // Mock data for now - this would be populated from WebSocket responses
      setChats([
        {
          id: '1',
          name: 'Alice Smith',
          lastMessage: 'Hey, how are you doing?',
          timestamp: '10:30 AM',
          unreadCount: 2,
          isGroup: false,
        },
        {
          id: '2',
          name: 'Team Group',
          lastMessage: 'Meeting at 3 PM today',
          timestamp: '9:45 AM',
          unreadCount: 0,
          isGroup: true,
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setRefreshing(false);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
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
      </View>
    </TouchableOpacity>
  );

  const handleNewChat = () => {
    router.push('/contacts');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zynap</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color={isDark ? '#ffffff' : '#0D47A1'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
            <Plus size={24} color={isDark ? '#ffffff' : '#0D47A1'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        style={styles.chatList}
        onRefresh={loadChats}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />

      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      )}
    </View>
  );
}

function getStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#0D47A1',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      padding: 8,
    },
    chatList: {
      flex: 1,
    },
    chatItem: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#f0f0f0',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#0D47A1',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    chatContent: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    chatName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    timestamp: {
      fontSize: 12,
      color: isDark ? '#888888' : '#666666',
    },
    chatFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    lastMessage: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
      flex: 1,
    },
    unreadBadge: {
      backgroundColor: '#0D47A1',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    unreadText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    connectionStatus: {
      position: 'absolute',
      top: 100,
      left: 16,
      right: 16,
      backgroundColor: '#ff9800',
      padding: 8,
      borderRadius: 8,
    },
    connectionText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: 14,
    },
  });
}