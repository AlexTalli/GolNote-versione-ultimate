import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';

// Configurazione notifiche: mostra alert/banner/lista, no suono/badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Contenuto app - attende che AuthContext risolva la sessione
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

// Layout radice dell'app - gestisce providers globali
export default function RootLayout() {
  // Listener per debug notifiche
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('[NOTIF] 📨 Notification received!', notification.request.content);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[NOTIF] 👆 Notification tapped!', response.notification.request.content);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </AuthProvider>
  );
}