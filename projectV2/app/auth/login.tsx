import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { Phone, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { sendVerificationCode } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = getStyles(isDark);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Basic phone validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Format to E.164
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+1${cleanPhone}`;

    setIsLoading(true);
    try {
      await sendVerificationCode(formattedPhone);
      router.push({
        pathname: '/auth/verify',
        params: { phone: formattedPhone }
      });
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Z</Text>
          </View>
          <Text style={styles.appName}>Zynap</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Phone size={20} color={isDark ? '#888888' : '#666666'} />
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={isDark ? '#888888' : '#666666'}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Send Code</Text>
                <ArrowRight size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
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
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#0D47A1',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    logoText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    appName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#cccccc' : '#666666',
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      marginBottom: 32,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 24,
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      marginLeft: 12,
    },
    button: {
      backgroundColor: '#0D47A1',
      borderRadius: 12,
      paddingVertical: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: isDark ? '#888888' : '#666666',
      textAlign: 'center',
      lineHeight: 18,
    },
  });
}