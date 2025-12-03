// app/(player)/_layout.tsx
import { Stack } from 'expo-router';

export default function PlayerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="join-team" />
      <Stack.Screen name="team/[teamId]" />
      <Stack.Screen name="[playerId]/fines" />
    </Stack>
  );
}
