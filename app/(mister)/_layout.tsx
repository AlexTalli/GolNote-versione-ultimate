// app/(mister)/_layout.tsx
import { Stack, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function MisterLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user?.role) {
      router.replace({ pathname: '/(auth)/auth-choice', params: { role: 'mister' } });
      return;
    }

    if (user.role !== 'mister') {
      router.replace('/(player)/join-team');
      return;
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs principali */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Dettagli fuori dalle tabs */}
      <Stack.Screen name="team/[teamId]" options={{ headerShown: false }} />
      <Stack.Screen name="player/[playerId]/fines" options={{ headerShown: false }} />
    </Stack>
  );
}
