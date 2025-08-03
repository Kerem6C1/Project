@@ .. @@
 import { useFrameworkReady } from '@/hooks/useFrameworkReady';
 import { AuthProvider } from '@/components/AuthProvider';
+import { ErrorBoundary } from '@/components/ErrorBoundary';

 export default function RootLayout() {
   useFrameworkReady();

   return (
-    <AuthProvider>
-      <Stack screenOptions={{ headerShown: false }}>
-        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
-        <Stack.Screen name="auth" options={{ headerShown: false }} />
-        <Stack.Screen name="chat" options={{ headerShown: false }} />
-        <Stack.Screen name="+not-found" />
-      </Stack>
-      <StatusBar style="light" />
-    </AuthProvider>
+    <ErrorBoundary>
+      <AuthProvider>
+        <Stack screenOptions={{ headerShown: false }}>
+          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
+          <Stack.Screen name="auth" options={{ headerShown: false }} />
+          <Stack.Screen name="chat" options={{ headerShown: false }} />
+          <Stack.Screen name="devices" options={{ headerShown: false }} />
+          <Stack.Screen name="+not-found" />
+        </Stack>
+        <StatusBar style="light" />
+      </AuthProvider>
+    </ErrorBoundary>
   );
 }