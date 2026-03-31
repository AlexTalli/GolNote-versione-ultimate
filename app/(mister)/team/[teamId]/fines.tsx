import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { useDatabase, usePlayers } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerCard } from '@/components/PlayerCard';
import type { Player } from '@/database/database.supabase';

const POSITION_ORDER: Record<string, number> = {
  portiere: 0,
  difensore: 1,
  centrocampista: 2,
  attaccante: 3,
};

export default function TeamFinesPlayersScreen() {
  const insets = useSafeAreaInsets();

  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const safeTeamName = useMemo(
    () => (typeof teamName === 'string' ? teamName : 'Squadra'),
    [teamName]
  );

  const { isInitialized } = useDatabase();
  const { user } = useAuth();

  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister' && teamId > 0,
    [isInitialized, user?.role, teamId]
  );

  const { players, loading, refreshPlayers } = usePlayers(teamId, { enabled });

  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'surname' | 'position'>('position');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlayers();
    setRefreshing(false);
  }, [refreshPlayers]);

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

  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per gestire le multe.</Text>
      </SafeAreaView>
    );
  }

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  if (!isInitialized || loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Caricamento giocatori...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}> 
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          Multe · {safeTeamName}
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.helperText}>Seleziona un giocatore per vedere o aggiungere multe.</Text>

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

        {players.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>
              Nessun giocatore disponibile in questa squadra.
            </Text>
          </View>
        ) : (
          sortedPlayers.map((player: Player, index: number) => (
            <PlayerCard
              key={String(player.id)}
              player={player}
              index={index + 1}
              onPress={() =>
                router.push({
                  pathname: '/(mister)/player/[playerId]/fines',
                  params: {
                    playerId: String(player.id),
                    playerName: player.surname ? `${player.surname} ${player.name}` : player.name,
                    teamName: safeTeamName,
                  },
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
    fontWeight: 'bold',
    color: '#ffffff',
  },

  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  helperText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
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
});
