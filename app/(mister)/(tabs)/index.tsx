import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, Text, View, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { DashboardCard } from '@/components/DashboardCard';
import { useDashboardStats } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';  

export default function MisterDashboard() {
  // Hook per ottenere statistiche dashboard e funzione refresh
  const { stats, loading, refreshStats } = useDashboardStats();
  const { user } = useAuth();                      
  const [refreshing, setRefreshing] = useState(false);

  // Calcola valori numerici dalle statistiche grezze, assicurando valori sicuri
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
    const unpaidAmount = Math.max(totalAmount - paidAmount, 0); // Evita valori negativi
    return {
      totalTeams,
      totalPlayers,
      activeFines,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  }, [stats]);

  // Formatta numeri come euro con 2 decimali
  const fmtEuro = (n: number) => `${n.toFixed(2)}€`;

  // Gestore per il pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshStats();
    } finally {
      setRefreshing(false);
    }
  }, [refreshStats]);

  // Mostra caricamento iniziale (non durante refresh)
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
      {/* Messaggio di benvenuto con nickname dell'utente */}
      <Text style={styles.welcomeText}>
        Benvenuto, {user?.displayNickname ?? user?.nickname ?? 'Mister'} !
      </Text>

      {/* Griglia di card statistiche */}
      <View style={styles.statsGrid}>
        <DashboardCard
          title="Squadre"
          value={String(totalTeams)}
          icon="shield"
          color="#8b5cf6"
          onPress={() => router.push('/(mister)/dashboard/teams')}
        />
        <DashboardCard
          title="Giocatori"
          value={String(totalPlayers)}
          icon="users"
          color="#3b82f6"
          onPress={() => router.push('/(mister)/dashboard/players')}
        />
        <DashboardCard
          title="Multe Attive"
          value={String(activeFines)}
          icon="alert-circle"
          color="#ef4444"
          onPress={() =>
            router.push({
              pathname: '/(mister)/dashboard/fines',
              params: { metric: 'active' },
            })
          }
        />
        <DashboardCard
          title="Totale Multe"
          value={fmtEuro(totalAmount)}
          icon="euro"
          color="#f59e0b"
          onPress={() =>
            router.push({
              pathname: '/(mister)/dashboard/fines',
              params: { metric: 'total' },
            })
          }
        />
        <DashboardCard
          title="Multe Pagate"
          value={fmtEuro(paidAmount)}
          icon="check-circle"
          color="#22c55e"
          onPress={() =>
            router.push({
              pathname: '/(mister)/dashboard/fines',
              params: { metric: 'paid' },
            })
          }
        />
        <DashboardCard
          title="Multe da Pagare"
          value={fmtEuro(unpaidAmount)}
          icon="alert-circle"
          color="#f97316"
          onPress={() =>
            router.push({
              pathname: '/(mister)/dashboard/fines',
              params: { metric: 'unpaid' },
            })
          }
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