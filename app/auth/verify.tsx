@@ .. @@
   const handleVerify = async (verificationCode?: string) => {
     const finalCode = verificationCode || code.join('');
     
     if (finalCode.length !== 6) {
       Alert.alert('Error', 'Please enter the complete 6-digit code');
       return;
     }

     if (!phone) {
       Alert.alert('Error', 'Phone number not found');
       router.back();
       return;
     }

     setIsLoading(true);
     try {
       await verifyCode(phone, finalCode);
       router.replace('/(tabs)');
     } catch (error) {
       console.error('Verify code error:', error);
       Alert.alert('Error', error instanceof Error ? error.message : 'Invalid verification code');
       setCode(['', '', '', '', '', '']);
       inputRefs.current[0]?.focus();
     } finally {
       setIsLoading(false);
     }
   };
@@ .. @@
   const handleResendCode = () => {
     if (countdown > 0) return;
     
     if (!phone) {
       Alert.alert('Error', 'Phone number not found');
       return;
     }
    
     setCountdown(60);
    
     // In a real app, call the sendVerificationCode function
     Alert.alert('Success', 'Verification code resent to ' + phone);
   };