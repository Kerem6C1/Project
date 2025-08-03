// App constants and configuration

export const APP_CONFIG = {
  name: 'Zynap',
  version: '1.0.0',
  websocket: {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 10000,
    heartbeatInterval: 30000,
  },
  auth: {
    tokenRefreshThreshold: 300000, // 5 minutes
    maxDevices: 5,
  },
  messages: {
    maxLength: 4000,
    maxAttachmentSize: 10 * 1024 * 1024, // 10MB
    supportedTypes: ['text', 'image', 'file', 'audio'],
  },
  ui: {
    animationDuration: 200,
    debounceDelay: 300,
  },
};

export const COLORS = {
  primary: '#0D47A1',
  primaryLight: '#e3f2fd',
  secondary: '#1976D2',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Dark theme
  dark: {
    background: '#000000',
    surface: '#1a1a1a',
    card: '#333333',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textTertiary: '#888888',
    border: '#333333',
  },
  
  // Light theme
  light: {
    background: '#ffffff',
    surface: '#f8f9fa',
    card: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
  },
};

export const STORAGE_KEYS = {
  USER: '@zynap:user',
  TOKEN: '@zynap:token',
  DEVICE_ID: '@zynap:device_id',
  THEME: '@zynap:theme',
  SETTINGS: '@zynap:settings',
  ENCRYPTION_KEY: '@zynap:encryption_key',
};

export const API_ENDPOINTS = {
  auth: {
    sendCode: '/api/auth/send-code',
    verifyCode: '/api/auth/verify-code',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
  },
  user: {
    profile: '/api/user/profile',
    updateProfile: '/api/user/profile',
    devices: '/api/user/devices',
  },
  messages: {
    send: '/api/messages/send',
    get: '/api/messages',
    markRead: '/api/messages/read',
  },
  contacts: {
    get: '/api/contacts',
    sync: '/api/contacts/sync',
    block: '/api/contacts/block',
  },
};

export const WEBSOCKET_EVENTS = {
  // Authentication
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  
  // Messages
  SEND_MESSAGE: 'send_message',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_DELIVERED: 'message_delivered',
  MESSAGE_READ: 'message_read',
  
  // Presence
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  
  // Contacts
  GET_CONTACTS: 'get_contacts',
  CONTACTS_UPDATED: 'contacts_updated',
  
  // Devices
  GET_ACTIVE_DEVICES: 'get_active_devices',
  DEVICE_LOGGED_OUT: 'device_logged_out',
  
  // Errors
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized',
};