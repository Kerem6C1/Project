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
import { ArrowLeft, Smartphone, LogOut } from 'lucide-react-native';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/dateUtils';

interface Device {
  deviceId: string;
  deviceName: string;
  createdAt: string;
}

export default function DevicesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const [devices, setDevices] = useState<Device[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const styles = getStyles(isDark);

  useEffect(() => {
    if (isConnected) {
      loadDevices();
    }
  }, [isConnected]);

  const loadDevices = () => {
    setRefreshing(true);
    sendMessage({
      type: 'get_active_devices',
      payload: {}
    });

    // Mock data for demonstration
    setDevices([
      {
        deviceId: 'device1',
        deviceName: 'iPhone 15 Pro',
        createdAt: new Date().toISOString(),
      },
      {
        deviceId: 'device2',
        deviceName: 'iPad Air',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]);
    setRefreshing(false);
  };

  const handleLogoutDevice = (device: Device) => {
    Alert.alert(
      'Logout Device',
      `Are you sure you want to logout "${device.deviceName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            sendMessage({
              type: 'logout_device',
              payload: { deviceId: device.deviceId }
            });
            setDevices(prev => prev.filter(d => d.deviceId !== device.deviceId));
          },
        },
      ]
    );
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const isCurrentDevice = item.deviceId === user?.deviceId;

    return (
      <View style={styles.deviceItem}>
        <View style={styles.deviceIcon}>
          <Smartphone size={24} color="#0D47A1" />
        </View>
        <View style={styles.deviceContent}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>
              {item.deviceName}
              {isCurrentDevice && <Text style={styles.currentDeviceLabel}> (This device)</Text>}
            </Text>
            <Text style={styles.deviceDate}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <Text style={styles.deviceId}>Device ID: {item.deviceId}</Text>
        </View>
        {!isCurrentDevice && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleLogoutDevice(item)}
          >
            <LogOut size={20} color="#ff5252" />
          </TouchableOpacity>
        )}
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
        <Text style={styles.headerTitle}>Linked Devices</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Active Sessions</Text>
          <Text style={styles.infoSubtitle}>
            You can be logged in to up to 5 devices at the same time.
          </Text>
        </View>

        <FlatList
          data={devices}
          keyExtractor={(item) => item.deviceId}
          renderItem={renderDevice}
          style={styles.devicesList}
          onRefresh={loadDevices}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
      paddingBottom: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#0D47A1',
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#ffffff',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    infoContainer: {
      paddingVertical: 24,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    infoSubtitle: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
      lineHeight: 20,
    },
    devicesList: {
      flex: 1,
    },
    deviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
      borderRadius: 12,
      marginBottom: 12,
    },
    deviceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#333333' : '#e3f2fd',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    deviceContent: {
      flex: 1,
    },
    deviceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      flex: 1,
    },
    currentDeviceLabel: {
      fontSize: 12,
      fontWeight: 'normal',
      color: '#0D47A1',
    },
    deviceDate: {
      fontSize: 12,
      color: isDark ? '#888888' : '#666666',
    },
    deviceId: {
      fontSize: 12,
      color: isDark ? '#cccccc' : '#999999',
      fontFamily: 'monospace',
    },
    logoutButton: {
      padding: 8,
      backgroundColor: isDark ? '#331a1a' : '#ffebee',
      borderRadius: 8,
    },
  });
}