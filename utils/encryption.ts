// Simple encryption utilities for message content
// In production, use proper end-to-end encryption libraries

export class MessageEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  
  // Generate a random key for encryption
  static generateKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Simple XOR encryption for demo purposes
  // In production, use proper encryption libraries
  static encrypt(message: string, key: string): string {
    try {
      const encrypted = message
        .split('')
        .map((char, index) => {
          const keyChar = key[index % key.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        })
        .join('');
      
      return btoa(encrypted); // Base64 encode
    } catch (error) {
      console.error('Encryption error:', error);
      return message; // Fallback to plain text
    }
  }
  
  static decrypt(encryptedMessage: string, key: string): string {
    try {
      const decoded = atob(encryptedMessage); // Base64 decode
      const decrypted = decoded
        .split('')
        .map((char, index) => {
          const keyChar = key[index % key.length];
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
        })
        .join('');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedMessage; // Fallback to encrypted text
    }
  }
  
  // Validate message integrity
  static validateMessage(message: string): boolean {
    if (!message || typeof message !== 'string') {
      return false;
    }
    
    // Check for reasonable message length
    if (message.length > 4000) {
      return false;
    }
    
    return true;
  }
}

// Phone number utilities
export class PhoneUtils {
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  }
  
  static validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
  
  static maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return phone;
    const visible = phone.slice(-4);
    const masked = '*'.repeat(phone.length - 4);
    return masked + visible;
  }
}