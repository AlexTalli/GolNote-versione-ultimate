import { Stack, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

// Layout per il ruolo "mister" - gestisce autenticazione e navigazione
export default function MisterLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Controllo autenticazione e ruolo al mount/cambio
  useEffect(() => {
    if (loading) return; // Aspetta caricamento auth

    if (!user) {
      // Nessun utente: torna alla schermata iniziale di scelta ruolo
      router.replace('/');
      return;
    }

    if (user.role !== 'mister') {
      // Ruolo sbagliato: vai a join-team per player
      router.replace('/(player)/join-team');
      return;
    }
  }, [user, loading, router, pathname]);

  // Mostra loading durante controllo auth
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Navigazione stack per mister
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      {/* Tabs principali */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      {/* Dettagli fuori dalle tabs */}
      <Stack.Screen name="team/[teamId]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="attendance/[teamId]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="player-attendance/[teamId]/[playerId]" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="player/[playerId]/fines" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );

  
}
