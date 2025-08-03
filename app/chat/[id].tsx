@@ .. @@
   const loadMessages = () => {
     if (!chatId) return;
     
+    console.log('Loading messages for chat:', chatId);
     sendWSMessage({
       type: 'get_messages',
       payload: { chatPartnerId: chatId }
@@ .. @@
     // Mock messages for demonstration
     setMessages([
       {
-        _id: '1',
+        _id: 'msg1',
         from: chatId,
         to: user?.userId || '',
         content: 'Hey there! How are you doing?',
@@ .. @@
       },
       {
-        _id: '2',
+        _id: 'msg2',
         from: user?.userId || '',
         to: chatId,
         content: 'I\'m doing great! Thanks for asking.',
@@ .. @@
       },
       {
-        _id: '3',
+        _id: 'msg3',
         from: chatId,
         to: user?.userId || '',
         content: 'That\'s wonderful to hear!',
@@ .. @@
   const sendMessage = () => {
     if (!messageText.trim() || !chatId) return;

+    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
     const newMessage: Message = {
-      _id: Date.now().toString(),
+      _id: messageId,
       from: user?.userId || '',
       to: chatId,
       content: messageText.trim(),
@@ .. @@
     // Send via WebSocket
     sendWSMessage({
       type: 'send_message',
       payload: {
+        messageId,
         to: chatId,
         encryptedContent: messageText.trim(),
         messageType: 'text',
         chatType: 'individual'
       }
     });