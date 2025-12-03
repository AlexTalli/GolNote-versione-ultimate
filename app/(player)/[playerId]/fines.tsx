// app/(player)/[playerId]/fines.tsx
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

type FilterKind = 'all' | 'pending' | 'paid' | 'overdue';

export default function PlayerFinesScreen() {
  const insets = useSafeAreaInsets();

  const { playerId: pid } = useLocalSearchParams<{ playerId?: string }>();
  const playerId = useMemo(() => Number(pid ?? -1), [pid]);

  const { isInitialized } = useDatabase();

  const enabled = useMemo(
    () => isInitialized && playerId > 0,
    [isInitialized, playerId]
  );

  const {
    fines,
    loading,
    refreshFines,
  } = useFines(playerId, { enabled });

  const [filter, setFilter] = useState<FilterKind>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFines();
    setRefreshing(false);
  }, [refreshFines]);

  const filteredFines = useMemo(() => {
    const now = new Date();
    return fines.filter((f: any) => {
      const isPaid = !!f.is_paid;
      const due = f.due_date ? new Date(f.due_date) : null;

      switch (filter) {
        case 'paid':
          return isPaid;
        case 'pending':
          return !isPaid;
        case 'overdue':
          return (
            !isPaid &&
            due instanceof Date &&
            !isNaN(due as any) &&
            due < now
          );
        case 'all':
        default:
          return true;
      }
    });
  }, [fines, filter]);

  if (!enabled || loading) {
    return (
      <SafeAreaView style={[s.container, s.center]} edges={['top', 'right', 'bottom', 'left']}>
        <Text>Caricamento multe…</Text>
      </SafeAreaView>
    );
  }

  return (
    // ⬇️ il top lo gestiamo noi con paddingTop nell'header
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* 🔥 HEADER — stesso stile di mister team/fines */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        {/* BACK */}
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        {/* TITOLO */}
        <Text style={s.title} numberOfLines={1}>
          Multe giocatore
        </Text>

        {/* spazio vuoto per tenere il titolo centrato come nel mister */}
        <View style={{ width: 44 }} />
      </View>

      {/* Barra filtro compatta (come mister) */}
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

      {/* Lista */}
      <ScrollView
        style={s.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
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
              // 👇 lato player: NIENTE toggle / delete
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },

  // 🔥 Header uguale a mister (stesso colore, stessa “sensazione” di altezza)
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
});