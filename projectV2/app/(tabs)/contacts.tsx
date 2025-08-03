import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, UserPlus } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';

interface Contact {
  userId?: string;
  phone: string;
  username?: string;
  profilePicture?: string;
  statusMessage?: string;
  isOnline?: boolean;
  displayName?: string;
}

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, isAuthenticated } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const styles = getStyles(isDark);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
      return;
    }
    loadContacts();
  }, [isAuthenticated]);

  const loadContacts = async () => {
    if (!isConnected) return;
    
    setRefreshing(true);
    try {
      sendMessage({
        type: 'get_contacts',
        payload: {}
      });
      
      // Mock data for now
      setContacts([
        {
          userId: 'user1',
          phone: '+1234567890',
          username: 'Alice Smith',
          isOnline: true,
          statusMessage: 'Available',
        },
        {
          userId: 'user2',
          phone: '+1234567891',
          username: 'Bob Johnson',
          isOnline: false,
          statusMessage: 'Busy',
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    (contact.username?.toLowerCase() || contact.phone).includes(searchQuery.toLowerCase())
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => item.userId && router.push(`/chat/${item.userId}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.username || item.phone).charAt(0).toUpperCase()}
        </Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactName}>
          {item.username || item.displayName || item.phone}
        </Text>
        <Text style={styles.contactStatus}>
          {item.statusMessage || (item.isOnline ? 'Online' : 'Offline')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddContact = () => {
    Alert.alert(
      'Add Contact',
      'Contact synchronization will scan your phone contacts and find users on Zynap.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sync Contacts', onPress: syncContacts },
      ]
    );
  };

  const syncContacts = () => {
    // In a real app, this would access phone contacts
    // For now, we'll just refresh the contact list
    loadContacts();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleAddContact}>
          <UserPlus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={isDark ? '#888888' : '#666666'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={isDark ? '#888888' : '#666666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.userId || item.phone}
        renderItem={renderContactItem}
        style={styles.contactList}
        onRefresh={loadContacts}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
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
    headerButton: {
      padding: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: isDark ? '#333333' : '#f5f5f5',
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
    },
    contactList: {
      flex: 1,
    },
    contactItem: {
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
      position: 'relative',
    },
    avatarText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#4CAF50',
      borderWidth: 2,
      borderColor: isDark ? '#000000' : '#ffffff',
    },
    contactContent: {
      flex: 1,
      justifyContent: 'center',
    },
    contactName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 2,
    },
    contactStatus: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
    },
  });
}