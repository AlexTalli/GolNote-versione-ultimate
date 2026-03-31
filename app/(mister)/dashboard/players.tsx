import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useDatabase, usePlayers } from '@/hooks/useDatabase';
import type { Player } from '@/database/database.supabase';

export default function DashboardPlayersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { isInitialized } = useDatabase();

  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister',
    [isInitialized, user?.role]
  );

  const { players, loading, refreshPlayers } = usePlayers(undefined, { enabled });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlayers();
    setRefreshing(false);
  }, [refreshPlayers]);

  const groupedPlayers = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      const teamA = (a.team_name || 'Senza squadra').toLowerCase();
      const teamB = (b.team_name || 'Senza squadra').toLowerCase();
      if (teamA !== teamB) return teamA.localeCompare(teamB, 'it', { sensitivity: 'base' });

      const surnameA = (a.surname || a.name).toLowerCase();
      const surnameB = (b.surname || b.name).toLowerCase();
      return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
    });

    return sorted.reduce<Record<string, Player[]>>((acc, player) => {
      const key = player.team_name || 'Senza squadra';
      if (!acc[key]) acc[key] = [];
      acc[key].push(player);
      return acc;
    }, {});
  }, [players]);

  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per vedere i giocatori.</Text>
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

  const teamEntries = Object.entries(groupedPlayers);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Giocatori · Dashboard</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {teamEntries.length === 0 ? (
          <View style={[styles.centered, { paddingVertical: 24 }]}>
            <Text style={{ color: '#6b7280' }}>Nessun giocatore trovato.</Text>
          </View>
        ) : (
          teamEntries.map(([teamName, teamPlayers]) => (
            <View key={teamName} style={styles.section}>
              <View style={styles.teamCard}>
                <View style={styles.teamHeader}>
                  <Text style={styles.teamTitle}>{teamName}</Text>
                  <Text style={styles.teamSubtitle}>{teamPlayers.length} giocatori</Text>
                </View>

                <View style={styles.playersWrap}>
                  {teamPlayers.map((player, idx) => (
                    <View key={String(player.id)}>
                      <View style={styles.rowCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>
                            {player.surname ? `${player.surname} ${player.name}` : player.name}
                          </Text>
                          <View style={styles.positionBadge}>
                            <Text style={styles.positionBadgeText}>{player.position}</Text>
                          </View>
                        </View>

                        <Text style={styles.rowIndex}>#{idx + 1}</Text>
                      </View>

                      {idx < teamPlayers.length - 1 && <View style={styles.playerDivider} />}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { alignItems: 'center', justifyContent: 'center' },
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
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 18 },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  teamHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#eff6ff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  teamSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#475569',
  },
  playersWrap: {
    paddingVertical: 2,
  },
  rowCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  positionBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  positionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  rowIndex: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748b',
  },
  playerDivider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: '#f1f5f9',
  },
});
