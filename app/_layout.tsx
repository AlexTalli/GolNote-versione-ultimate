import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useEffect } from 'react';

let Notifications: any = null;

// Lazy load Notifications - skip on Android (Expo Go limitation)
const loadNotifications = async () => {
  if (Notifications !== null) return;
  if (Platform.OS === 'android') {
    console.log('[NOTIF] Skipping Notifications on Android (Expo Go limitation)');
    return;
  }
  try {
    Notifications = await import('expo-notifications').then(m => m.default || m);
    if (Notifications && Notifications.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  } catch (e) {
    console.warn('[NOTIF] expo-notifications not available:', e);
  }
};

// Contenuto app - attende che AuthContext risolva la sessione
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
      <StatusBar style="auto" />
    </>
  );
}

// Layout radice dell'app - gestisce providers globali
export default function RootLayout() {
  // Lazy load Notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Listener per debug notifiche
  useEffect(() => {
    if (!Notifications) return;

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