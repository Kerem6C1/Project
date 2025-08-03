import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { formatTime, formatDate } from '@/utils/dateUtils';

interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  delivered: boolean;
  read: boolean;
  messageType: string;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { isConnected, sendMessage: sendWSMessage } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const styles = getStyles(isDark);

  useEffect(() => {
    if (chatId && isConnected) {
      loadMessages();
    }
  }, [chatId, isConnected]);

  const loadMessages = () => {
    if (!chatId) return;
    
    sendWSMessage({
      type: 'get_messages',
      payload: { chatPartnerId: chatId }
    });

    // Mock messages for demonstration
    setMessages([
      {
        _id: '1',
        from: chatId,
        to: user?.userId || '',
        content: 'Hey there! How are you doing?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        delivered: true,
        read: true,
        messageType: 'text',
      },
      {
        _id: '2',
        from: user?.userId || '',
        to: chatId,
        content: 'I\'m doing great! Thanks for asking.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        delivered: true,
        read: false,
        messageType: 'text',
      },
      {
        _id: '3',
        from: chatId,
        to: user?.userId || '',
        content: 'That\'s wonderful to hear!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        delivered: true,
        read: false,
        messageType: 'text',
      },
    ]);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !chatId) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      from: user?.userId || '',
      to: chatId,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      delivered: false,
      read: false,
      messageType: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Send via WebSocket
    sendWSMessage({
      type: 'send_message',
      payload: {
        to: chatId,
        encryptedContent: messageText.trim(),
        messageType: 'text',
        chatType: 'individual'
      }
    });

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.from === user?.userId;
    const showStatus = isOwn && item === messages[messages.length - 1];

    return (
      <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
        <View style={[styles.messageBubble, isOwn && styles.ownMessageBubble]}>
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
              {formatTime(item.timestamp)}
            </Text>
            {showStatus && (
              <Text style={styles.messageStatus}>
                {item.read ? '✓✓' : item.delivered ? '✓' : '⏱'}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {chatId?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Chat Partner</Text>
            <Text style={styles.headerSubtitle}>
              {isTyping ? 'typing...' : 'last seen recently'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? '#888888' : '#666666'}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 12,
      backgroundColor: isDark ? '#1a1a1a' : '#0D47A1',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
    },
    headerSubtitle: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    menuButton: {
      padding: 8,
    },
    chatContainer: {
      flex: 1,
    },
    messagesList: {
      flex: 1,
    },
    messagesContent: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    messageContainer: {
      marginVertical: 2,
      alignItems: 'flex-start',
    },
    ownMessageContainer: {
      alignItems: 'flex-end',
    },
    messageBubble: {
      maxWidth: '80%',
      backgroundColor: isDark ? '#333333' : '#f0f0f0',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
    },
    ownMessageBubble: {
      backgroundColor: '#0D47A1',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 4,
    },
    messageText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      lineHeight: 20,
    },
    ownMessageText: {
      color: '#ffffff',
    },
    messageFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    messageTime: {
      fontSize: 11,
      color: isDark ? '#cccccc' : '#666666',
    },
    ownMessageTime: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
    messageStatus: {
      fontSize: 11,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#e0e0e0',
      gap: 12,
    },
    messageInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#333333' : '#ffffff',
      maxHeight: 100,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#0D47A1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });
}