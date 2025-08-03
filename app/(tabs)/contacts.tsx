@@ .. @@
       // Mock data for now
       setContacts([
         {
-          userId: 'user1',
+          userId: 'contact1',
           phone: '+1234567890',
           username: 'Alice Smith',
           isOnline: true,
           statusMessage: 'Available',
         },
         {
-          userId: 'user2',
+          userId: 'contact2',
           phone: '+1234567891',
           username: 'Bob Johnson',
           isOnline: false,
           statusMessage: 'Busy',
         },
+        {
+          userId: 'contact3',
+          phone: '+1234567892',
+          username: 'Carol Wilson',
+          isOnline: true,
+          statusMessage: 'At work',
+        },
       ]);
     } catch (error) {
-      Alert.alert('Error', 'Failed to load contacts');
+      console.error('Load contacts error:', error);
+      Alert.alert('Error', 'Failed to load contacts. Please try again.');
     } finally {
       setRefreshing(false);
     }