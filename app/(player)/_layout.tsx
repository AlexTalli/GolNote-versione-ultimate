// app/(player)/_layout.tsx
import { Stack } from 'expo-router';

export default function PlayerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="join-team" options={{ gestureEnabled: false }} />
      <Stack.Screen name="team/[teamId]" options={{ gestureEnabled: false }} />
      <Stack.Screen name="[playerId]/fines" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
