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

export default function PlayerTeamRosterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { teamId: teamIdParam, teamName: teamNameParam } =
    useLocalSearchParams<{ teamId?: string; teamName?: string }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'surname' | 'position'>('surname');

  const teamName = useMemo(
    () => String(teamNameParam || players[0]?.team_name || 'Rosa squadra'),
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

  const POSITION_ORDER: Record<string, number> = {
    portiere: 0,
    difensore: 1,
    centrocampista: 2,
    attaccante: 3,
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortBy === 'position') {
        const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
        const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;
        if (posA !== posB) return posA - posB;
        return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
      }

      const surnameA = a.surname || a.name.split(' ').pop() || a.name;
      const surnameB = b.surname || b.name.split(' ').pop() || b.name;
      return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
    });
  }, [players, sortBy]);

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
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Ordina per:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'position' && styles.sortBtnActive]}
              onPress={() => setSortBy('position')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'position' && styles.sortBtnTextActive]}>
                Ruolo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'surname' && styles.sortBtnActive]}
              onPress={() => setSortBy('surname')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'surname' && styles.sortBtnTextActive]}>
                Cognome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {sortedPlayers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Nessun giocatore.</Text>
          </View>
        ) : (
          sortedPlayers.map((p, index) => (
            <PlayerCard
              key={String(p.id)}
              player={p}
              index={index + 1}
              isCurrentPlayer={p.id === user?.playerId}
              showFinesInfo={false}
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
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  sortBtnActive: {
    backgroundColor: '#2e70b7ff',
    borderColor: '#2e70b7ff',
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortBtnTextActive: {
    color: '#ffffff',
  },
  emptyWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
  },
});