const handleSendCode = async () => {
  if (!phoneNumber.trim()) {
    Alert.alert('Error', 'Please enter your phone number');
    return;
  }

  // Basic phone validation
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    Alert.alert('Error', 'Please enter a valid phone number');
    return;
  }

  // Format to E.164
  let formattedPhone = phoneNumber.trim();
  if (!formattedPhone.startsWith('+')) {
    // Default to US country code if no country code provided
    formattedPhone = `+1${cleanPhone}`;
  }

  setIsLoading(true);
  try {
    await sendVerificationCode(formattedPhone);
    router.push({
      pathname: '/auth/verify',
      params: { phone: formattedPhone }
    });
  } catch (error) {
    console.error('Send code error:', error);
    Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send verification code');
  } finally {
    setIsLoading(false);
  }
};