import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useDatabase, useFines } from '@/hooks/useDatabase';

type Metric = 'active' | 'total' | 'paid' | 'unpaid';

const METRIC_LABELS: Record<Metric, string> = {
  active: 'Multe Attive',
  total: 'Totale Multe',
  paid: 'Multe Pagate',
  unpaid: 'Multe da Pagare',
};

const fmtEuro = (n: number) => `${n.toFixed(2)}€`;

export default function DashboardFinesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { metric } = useLocalSearchParams<{ metric?: string }>();
  const { user } = useAuth();
  const { isInitialized } = useDatabase();

  const selectedMetric: Metric =
    metric === 'active' || metric === 'paid' || metric === 'unpaid' || metric === 'total'
      ? metric
      : 'total';

  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister',
    [isInitialized, user?.role]
  );

  const { fines, loading, refreshFines } = useFines(undefined, { enabled });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFines();
    setRefreshing(false);
  }, [refreshFines]);

  const filteredFines = useMemo(() => {
    if (selectedMetric === 'total') return fines;
    if (selectedMetric === 'paid') return fines.filter((f: any) => !!f.is_paid);
    return fines.filter((f: any) => !f.is_paid);
  }, [fines, selectedMetric]);

  const totalAmount = useMemo(
    () => filteredFines.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0),
    [filteredFines]
  );

  const groupedByTeam = useMemo(() => {
    const grouped = filteredFines.reduce<
      Record<string, Record<string, { playerName: string; count: number; amount: number }>>
    >((acc, fine: any) => {
      const teamName = fine.team_name || 'Senza squadra';
      const playerName = fine.player_name || 'Giocatore';
      const playerKey = `${fine.player_id}-${playerName}`;

      if (!acc[teamName]) acc[teamName] = {};
      if (!acc[teamName][playerKey]) {
        acc[teamName][playerKey] = { playerName, count: 0, amount: 0 };
      }

      acc[teamName][playerKey].count += 1;
      acc[teamName][playerKey].amount += Number(fine.amount || 0);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([teamName, playersMap]) => ({
        teamName,
        players: Object.values(playersMap).sort((a, b) => b.amount - a.amount),
        totalCount: Object.values(playersMap).reduce((sum, p) => sum + p.count, 0),
        totalAmount: Object.values(playersMap).reduce((sum, p) => sum + p.amount, 0),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredFines]);

  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per vedere le multe.</Text>
      </SafeAreaView>
    );
  }

  if (!isInitialized || loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Caricamento multe...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>{METRIC_LABELS[selectedMetric]}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Totale</Text>
          <Text style={styles.summaryValue}>{fmtEuro(totalAmount)}</Text>
          <Text style={styles.summarySub}>{filteredFines.length} multe</Text>
        </View>

        {groupedByTeam.length === 0 ? (
          <Text style={styles.emptyText}>Nessun dato per questa metrica.</Text>
        ) : (
          groupedByTeam.map((group) => (
            <View key={group.teamName} style={styles.teamSection}>
              <View style={styles.teamCard}>
                <View style={styles.teamHeader}>
                  <Text style={styles.teamTitle}>{group.teamName}</Text>
                  <Text style={styles.teamSubtitle}>
                    {group.totalCount} multe · {fmtEuro(group.totalAmount)}
                  </Text>
                </View>

                <View style={styles.playersWrap}>
                  {group.players.map((player, idx) => (
                    <View key={`${group.teamName}-${player.playerName}`}>
                      <View style={styles.rowCard}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.rowTitle}>{player.playerName}</Text>
                          <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{player.count} multe</Text>
                          </View>
                        </View>

                        <View style={styles.amountChip}>
                          <Text style={styles.rowAmount}>{fmtEuro(player.amount)}</Text>
                        </View>
                      </View>

                      {idx < group.players.length - 1 && <View style={styles.playerDivider} />}
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  summaryLabel: { color: '#6b7280', fontWeight: '600' },
  summaryValue: { fontSize: 26, fontWeight: '700', color: '#111827', marginTop: 4 },
  summarySub: { color: '#6b7280', marginTop: 2 },
  teamSection: { marginBottom: 14 },
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
  teamTitle: { fontSize: 16, fontWeight: '700', color: '#1e3a8a' },
  teamSubtitle: { fontSize: 13, color: '#475569', marginTop: 2 },
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
  rowTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  countBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#fef2f2',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b91c1c',
  },
  amountChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  rowAmount: { fontSize: 14, fontWeight: '800', color: '#c2410c' },
  playerDivider: {
    height: 1,
    marginHorizontal: 12,
    backgroundColor: '#f1f5f9',
  },
  emptyText: { color: '#6b7280', marginBottom: 8 },
});
