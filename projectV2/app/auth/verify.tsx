import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { verifyCode } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const styles = getStyles(isDark);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '') && text) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const finalCode = verificationCode || code.join('');
    
    if (finalCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    if (!phone) {
      Alert.alert('Error', 'Phone number not found');
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode(phone, finalCode);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    // Implement resend logic here
    Alert.alert('Success', 'Verification code resent');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? '#ffffff' : '#0D47A1'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Phone</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.phoneText}>{phone}</Text>
        </View>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text style={styles.verifyButtonText}>Verify</Text>
              <ArrowRight size={20} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
          </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={countdown > 0}
          >
            <Text style={[
              styles.resendButton,
              countdown > 0 && styles.resendButtonDisabled
            ]}>
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
      paddingHorizontal: 32,
      paddingTop: 48,
    },
    instructionContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    instruction: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#666666',
      textAlign: 'center',
      marginBottom: 8,
    },
    phoneText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    codeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
      gap: 8,
    },
    codeInput: {
      width: 48,
      height: 56,
      borderWidth: 2,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 12,
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
    },
    codeInputFilled: {
      borderColor: '#0D47A1',
      backgroundColor: isDark ? '#0D47A1' : '#e3f2fd',
    },
    verifyButton: {
      backgroundColor: '#0D47A1',
      borderRadius: 12,
      paddingVertical: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    verifyButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    resendText: {
      fontSize: 14,
      color: isDark ? '#cccccc' : '#666666',
    },
    resendButton: {
      fontSize: 14,
      fontWeight: '600',
      color: '#0D47A1',
    },
    resendButtonDisabled: {
      color: isDark ? '#888888' : '#cccccc',
    },
  });
}