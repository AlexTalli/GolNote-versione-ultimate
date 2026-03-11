import { useLocalSearchParams, router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabase, useFines } from '@/hooks/useDatabase';
import { FineCard } from '@/components/FineCard';
import { DashboardCard } from '@/components/DashboardCard';

type FilterKind = 'all' | 'pending' | 'paid' | 'overdue';

// Schermata multe per giocatore (solo visualizzazione, no modifica)
export default function PlayerFinesScreen() {
  const insets = useSafeAreaInsets();

  // Parametro playerId dalla route
  const { playerId: pid } = useLocalSearchParams<{ playerId?: string }>();
  const playerId = useMemo(() => Number(pid ?? -1), [pid]);

  const { isInitialized } = useDatabase();

  // Abilita hook solo se DB pronto e playerId valido
  const enabled = useMemo(
    () => isInitialized && playerId > 0,
    [isInitialized, playerId]
  );

  // Hook per multe (solo lettura per player)
  const {
    fines,
    loading,
    refreshFines,
  } = useFines(playerId, { enabled });

  const [filter, setFilter] = useState<FilterKind>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFines();
    setRefreshing(false);
  }, [refreshFines]);

  // Filtro multe basato su stato pagamento e scadenza
  const filteredFines = useMemo(() => {
    const now = new Date();
    return fines.filter((f: any) => {
      const isPaid = !!f.is_paid;
      const due = f.due_date ? new Date(f.due_date) : null;

      switch (filter) {
        case 'paid':
          return isPaid; // Solo pagate
        case 'pending':
          return !isPaid; // Solo aperte
        case 'overdue':
          return (
            !isPaid &&
            due instanceof Date &&
            !isNaN(due as any) &&
            due < now // Aperte e scadute
          );
        case 'all':
        default:
          return true; // Tutte
      }
    });
  }, [fines, filter]);

  const stats = useMemo(() => {
    const totalAmount = fines.reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0);
    const paidAmount = fines
      .filter((f: any) => !!f.is_paid)
      .reduce((sum: number, f: any) => sum + Number(f.amount || 0), 0);
    const activeFines = fines.filter((f: any) => !f.is_paid).length;
    const unpaidAmount = Math.max(totalAmount - paidAmount, 0);

    return {
      activeFines,
      totalAmount,
      paidAmount,
      unpaidAmount,
    };
  }, [fines]);

  const fmtEuro = (n: number) => `${n.toFixed(2)}€`;

  // Loading gate
  if (!enabled || loading) {
    return (
      <SafeAreaView style={[s.container, s.center]} edges={['top', 'right', 'bottom', 'left']}>
        <Text>Caricamento multe…</Text>
      </SafeAreaView>
    );
  }

  return (
    // SafeArea senza top (gestito da header)
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* Header con back e titolo */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={s.title} numberOfLines={1}>
          Multe giocatore
        </Text>

        {/* Spazio vuoto per centrare titolo */}
        <View style={{ width: 44 }} />
      </View>

      {/* Barra filtro compatta */}
      <View style={s.filterBar}>
        <Text style={s.filterText}>
          Filtro:{' '}
          {filter === 'all'
            ? 'tutte'
            : filter === 'pending'
            ? 'aperte'
            : filter === 'paid'
            ? 'pagate'
            : 'scadute'}
        </Text>
        <TouchableOpacity
          style={s.filterBtn}
          onPress={() => {
            setFilter(prev =>
              prev === 'all'
                ? 'pending'
                : prev === 'pending'
                ? 'overdue'
                : prev === 'overdue'
                ? 'paid'
                : 'all'
            );
          }}
        >
          <Filter size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Lista multe con pull-to-refresh */}
      <ScrollView
        style={s.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.statsGrid}>
          <DashboardCard
            title="Multe Attive"
            value={String(stats.activeFines)}
            icon="alert-circle"
            color="#ef4444"
          />
          <DashboardCard
            title="Totale Multe"
            value={fmtEuro(stats.totalAmount)}
            icon="euro"
            color="#f59e0b"
          />
          <DashboardCard
            title="Multe Pagate"
            value={fmtEuro(stats.paidAmount)}
            icon="check-circle"
            color="#22c55e"
          />
          <DashboardCard
            title="Multe da Pagare"
            value={fmtEuro(stats.unpaidAmount)}
            icon="alert-circle"
            color="#f97316"
          />
        </View>

        {filteredFines.length === 0 ? (
          <View style={[s.center, { paddingVertical: 48 }]}>
            <Text style={{ color: '#6b7280', textAlign: 'center' }}>
              Nessuna multa {filter !== 'all' ? `(${filter})` : ''}.
            </Text>
          </View>
        ) : (
          filteredFines.map((f: any) => (
            <FineCard
              key={String(f.id)}
              fine={{
                id: f.id,
                player_name: f.player_name ?? '',
                type: f.type,
                amount: f.amount,
                due_date: f.due_date,
                is_paid: !!f.is_paid,
                description: f.description,
              }}
              // Lato player: nessuna azione (no toggle/delete)
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Stili simili a mister per coerenza UI
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#c41919ff',
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

  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 8, android: 6, default: 8 }),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterText: { fontSize: 12, color: '#6b7280' },
  filterBtn: {
    backgroundColor: '#f3f4f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});