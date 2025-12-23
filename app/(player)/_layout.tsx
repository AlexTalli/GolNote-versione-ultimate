// app/(player)/_layout.tsx
import { Stack } from 'expo-router';

// Layout per il ruolo "player" - navigazione semplice senza controlli auth avanzati
export default function PlayerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      {/* Schermata per unirsi a un team */}
      <Stack.Screen name="join-team" options={{ gestureEnabled: false }} />
      {/* Dettagli team */}
      <Stack.Screen name="team/[teamId]" options={{ gestureEnabled: false }} />
      {/* Multe del giocatore */}
      <Stack.Screen name="[playerId]/fines" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
