import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useDatabase } from '@/hooks/useDatabase';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';
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

// Layout radice dell'app - gestisce bootstrap e providers globali
export default function RootLayout() {
  const { isInitialized } = useDatabase(); // Stato inizializzazione DB

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

  // Mostra loading fino a DB pronto
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Una volta DB pronto, fornisci contexts e navigazione
  return (
    <AuthProvider>
      <RoleProvider>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </RoleProvider>
    </AuthProvider>
  );
}