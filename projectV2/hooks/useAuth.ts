import { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

interface User {
  userId: string;
  phone: string;
  username?: string;
  profilePicture?: string;
  token: string;
  deviceId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendVerificationCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Storage keys
const STORAGE_KEYS = {
  USER: '@zynap:user',
  TOKEN: '@zynap:token',
  DEVICE_ID: '@zynap:device_id',
};

// Generate device ID
function generateDeviceId(): string {
  return `${Platform.OS}_${Device.modelName || 'unknown'}_${Date.now()}`;
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedUser, storedToken, storedDeviceId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID),
      ]);

      if (storedUser && storedToken && storedDeviceId) {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          token: storedToken,
          deviceId: storedDeviceId,
        });
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async (phone: string) => {
    // This will be handled by WebSocket
    return new Promise((resolve, reject) => {
      // Mock implementation - in real app this would use WebSocket
      setTimeout(() => {
        resolve(undefined);
      }, 1000);
    });
  };

  const verifyCode = async (phone: string, code: string) => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const deviceName = `${Platform.OS} ${Device.modelName || 'Device'}`;

      // This will be handled by WebSocket
      const mockUser: User = {
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        phone,
        token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
        deviceId,
      };

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, mockUser.token),
        AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId),
      ]);

      setUser(mockUser);
    } catch (error) {
      throw new Error('Verification failed');
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.DEVICE_ID),
      ]);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getOrCreateDeviceId = async (): Promise<string> => {
    let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = generateDeviceId();
      await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
    }
    return deviceId;
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    sendVerificationCode,
    verifyCode,
    logout,
  };
}

export { AuthContext };