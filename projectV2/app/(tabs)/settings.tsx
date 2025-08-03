import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { 
  User, 
  Smartphone, 
  Shield, 
  Moon, 
  LogOut, 
  ChevronRight,
  Users,
  Bell
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Device {
  deviceId: string;
  deviceName: string;
  createdAt: string;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(isDark);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = getStyles(isDark);

  useEffect(() => {
    if (isConnected) {
      loadDevices();
    }
  }, [isConnected]);

  const loadDevices = () => {
    sendMessage({
      type: 'get_active_devices',
      payload: {}
    });
  };

  const handleLogoutDevice = (deviceId: string) => {
    Alert.alert(
      'Logout Device',
      'Are you sure you want to logout this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            sendMessage({
              type: 'logout_device',
              payload: { deviceId }
            });
            loadDevices();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from all devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightElement
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon size={20} color="#0D47A1" />
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showChevron && !rightElement && (
          <ChevronRight size={20} color={isDark ? '#888888' : '#666666'} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon={User}
            title="Profile"
            subtitle={user?.phone || 'Update your profile'}
            onPress={() => router.push('/profile')}
          />
          <SettingItem
            icon={Smartphone}
            title="Linked Devices"
            subtitle={`${devices.length} active devices`}
            onPress={() => router.push('/devices')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <SettingItem
            icon={Shield}
            title="Privacy & Security"
            subtitle="Block users, manage encryption"
            onPress={() => router.push('/privacy')}
          />
          <SettingItem
            icon={Users}
            title="Groups"
            subtitle="Manage your groups"
            onPress={() => router.push('/groups')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon={Moon}
            title="Dark Theme"
            subtitle="Toggle dark/light theme"
            showChevron={false}
            rightElement={
              <Switch
                value={isDarkTheme}
                onValueChange={setIsDarkTheme}
                trackColor={{ false: '#767577', true: '#0D47A1' }}
                thumbColor={isDarkTheme ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Push notifications"
            showChevron={false}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#0D47A1' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <SettingItem
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of all devices"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
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
    content: {
      flex: 1,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#0D47A1',
      paddingHorizontal: 16,
      paddingBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#f0f0f0',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333333' : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    settingSubtitle: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
      marginTop: 2,
    },
    settingRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
}