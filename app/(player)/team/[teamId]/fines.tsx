import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

import { playersDB, Player } from '@/database/database.supabase';
import { PlayerCard } from '@/components/PlayerCard';
import { useAuth } from '@/contexts/AuthContext';

export default function PlayerTeamFinesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { teamId: teamIdParam, teamName: teamNameParam } =
    useLocalSearchParams<{ teamId?: string; teamName?: string }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const teamName = useMemo(
    () => String(teamNameParam || players[0]?.team_name || 'Multe squadra'),
    [teamNameParam, players]
  );

  const load = useCallback(async () => {
    if (!(teamId > 0)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await playersDB.getByTeamPublic(teamId);
      setPlayers(data);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text>Caricamento...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {teamName}
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionInfo}>Tocca un giocatore per vedere il dettaglio multe.</Text>

        {players.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Nessun giocatore.</Text>
          </View>
        ) : (
          players.map((p, index) => (
            <PlayerCard
              key={String(p.id)}
              player={p}
              index={index + 1}
              isCurrentPlayer={p.id === user?.playerId}
              onPress={() =>
                router.push({
                  pathname: '/(player)/[playerId]/fines',
                  params: { playerId: String(p.id) },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#2e70b7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionInfo: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  emptyWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
});