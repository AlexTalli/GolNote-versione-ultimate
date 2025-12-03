// app/(mister)/(tabs)/index.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl } from 'react-native';
import { DashboardCard } from '@/components/DashboardCard';
import { useDashboardStats } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';   // 👈 IMPORTANTE

export default function MisterDashboard() {
  const { stats, loading, refreshStats } = useDashboardStats();
  const { user } = useAuth();                      // 👈 nickname disponibile qui
  const [refreshing, setRefreshing] = useState(false);

  const {
    totalTeams,
    totalPlayers,
    activeFines,
    totalAmount,
    paidAmount,
    unpaidAmount,
  } = useMemo(() => {
    const totalTeams = Number(stats.total_teams || 0);
    const totalPlayers = Number(stats.total_players || 0);
    const activeFines = Number(stats.active_fines || 0);
    const totalAmount = Number(stats.total_amount || 0);
    const paidAmount = Number(stats.paid_amount || 0);
    const unpaidAmount = Math.max(totalAmount - paidAmount, 0);
    return {
      totalTeams,
      totalPlayers,
      activeFines,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  }, [stats]);

  const fmtEuro = (n: number) => `${n.toFixed(2)}€`;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshStats();
    } finally {
      setRefreshing(false);
    }
  }, [refreshStats]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 👇 TESTO PERSONALIZZATO */}
      <Text style={styles.welcomeText}>
        Benvenuto, {user?.nickname ?? 'Mister'} !
      </Text>

      <View style={styles.statsGrid}>
        <DashboardCard
          title="Squadre"
          value={String(totalTeams)}
          icon="shield"
          color="#8b5cf6"
        />
        <DashboardCard
          title="Giocatori"
          value={String(totalPlayers)}
          icon="users"
          color="#3b82f6"
        />
        <DashboardCard
          title="Multe Attive"
          value={String(activeFines)}
          icon="alert-circle"
          color="#ef4444"
        />
        <DashboardCard
          title="Totale Multe"
          value={fmtEuro(totalAmount)}
          icon="euro"
          color="#f59e0b"
        />
        <DashboardCard
          title="Multe Pagate"
          value={fmtEuro(paidAmount)}
          icon="check-circle"
          color="#22c55e"
        />
        <DashboardCard
          title="Multe da Pagare"
          value={fmtEuro(unpaidAmount)}
          icon="alert-circle"
          color="#f97316"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  centered: { justifyContent: 'center', alignItems: 'center', flex: 1 },
});