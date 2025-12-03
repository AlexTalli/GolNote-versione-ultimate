// app/_layout.tsx
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useDatabase } from '@/hooks/useDatabase';
import { RoleProvider } from '@/contexts/RoleContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Handler globale per come mostrare le notifiche quando l'app è in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // vecchio campo, ancora supportato per compat, ma segnato deprecated
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,

    // nuovi campi consigliati su iOS
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useFrameworkReady();
  const { isInitialized } = useDatabase();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RoleProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </RoleProvider>
    </AuthProvider>
  );
}