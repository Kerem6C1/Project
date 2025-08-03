// Generate device ID
function generateDeviceId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${Platform.OS}_${Device.modelName?.replace(/\s+/g, '') || 'unknown'}_${timestamp}_${random}`;
}

export function useAuthProvider(): AuthContextType {
  const sendVerificationCode = async (phone: string) => {
    try {
      // In a real app, this would make an API call to your backend
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Send verification code error:', error);
      throw error;
    }
  };

  const verifyCode = async (phone: string, code: string) => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const deviceName = `${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${Device.modelName || 'Device'}`;

      // In a real app, this would make an API call to verify the code
      if (code !== '123456') { // Mock verification - remove in production
        throw new Error('Invalid verification code');
      }
      
      const mockUser: User = {
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        phone,
        username: phone.replace(/^\+\d+/, '').slice(-4), // Use last 4 digits as username
        token: 'jwt_' + Math.random().toString(36).substr(2, 32),
        deviceId,
      };

      // Store auth data
    } catch (error) {
      console.error('Verify code error:', error);
      throw error;
    }
  };
}