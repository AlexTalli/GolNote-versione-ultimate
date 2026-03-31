import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, CircleAlert as AlertCircle } from 'lucide-react-native';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useDatabase, useTeams } from '@/hooks/useDatabase';

export default function DashboardTeamsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { isInitialized } = useDatabase();

  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister',
    [isInitialized, user?.role]
  );

  const { teams, loading, refreshTeams } = useTeams({ enabled });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTeams();
    setRefreshing(false);
  }, [refreshTeams]);

  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per vedere le squadre.</Text>
      </SafeAreaView>
    );
  }

  if (!isInitialized || loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Caricamento squadre...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}> 
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Squadre · Dashboard</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {teams.length === 0 ? (
          <View style={[styles.centered, { paddingVertical: 24 }]}> 
            <Text style={{ color: '#6b7280' }}>Nessuna squadra trovata.</Text>
          </View>
        ) : (
          teams.map((team: any) => (
            <View key={String(team.id)} style={styles.teamCard}>
              <View style={[styles.colorBar, { backgroundColor: team.color || '#22c55e' }]} />
              <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}>
                <View style={styles.teamNameRow}>
                  {team.logo_uri ? (
                    <Image source={{ uri: team.logo_uri }} style={styles.teamLogo} />
                  ) : (
                    <View style={[styles.teamLogoFallback, { backgroundColor: team.color || '#22c55e' }]} />
                  )}
                  <Text style={styles.teamName}>{team.name}</Text>
                </View>
                {!!team.description && (
                  <Text style={styles.teamDescription} numberOfLines={2}>
                    {team.description}
                  </Text>
                )}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Users size={14} color="#6b7280" />
                    <Text style={styles.statText}>{Number(team.players_count || 0)} giocatori</Text>
                  </View>
                  <View style={styles.statItem}>
                    <AlertCircle size={14} color="#ef4444" />
                    <Text style={[styles.statText, { color: '#ef4444' }]}>
                      {Number(team.active_fines || 0)} multe attive
                    </Text>
                  </View>
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
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorBar: { width: 6 },
  teamNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  teamLogoFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  teamDescription: {
    marginTop: 2,
    color: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
});
