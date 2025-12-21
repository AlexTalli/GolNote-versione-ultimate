// app/(mister)/player/[playerId]/fines.tsx

import { useLocalSearchParams, router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { ArrowLeft, Plus, Filter } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDatabase, useFines } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { FineCard } from '@/components/FineCard';
import { AddFineModal } from '@/components/AddFineModal';

import {scheduleFineDueNotification,cancelFineDueNotificationByFineId,} from '@/utils/notifications';

type FilterKind = 'all' | 'pending' | 'paid' | 'overdue';

export default function PlayerFinesScreen() {
  const insets = useSafeAreaInsets();

  // Parametri route
  const { playerId: pid, playerName, teamName } = useLocalSearchParams<{
    playerId?: string;
    playerName?: string;
    teamName?: string;
  }>();

  const playerId = useMemo(() => Number(pid ?? -1), [pid]);

  // Parametri safe (expo-router può restituire anche array)
  const safePlayerName = useMemo(
    () => (typeof playerName === 'string' ? playerName : undefined),
    [playerName]
  );
  const safeTeamName = useMemo(
    () => (typeof teamName === 'string' ? teamName : undefined),
    [teamName]
  );

  const { isInitialized } = useDatabase();
  const { user } = useAuth();
  const isMister = user?.role === 'mister';

  const enabled = useMemo(
    () => isInitialized && playerId > 0,
    [isInitialized, playerId]
  );

  const {
    fines,
    loading,
    addFine,
    toggleFinePayment,
    deleteFine,
    refreshFines,
  } = useFines(playerId, { enabled });

  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<FilterKind>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshFines();
    setRefreshing(false);
  }, [refreshFines]);

  /**
   * Aggiunta multa:
   * 1) inserisce nel DB
   * 2) chiude modal
   * 3) schedula notifica “giorno prima alle 09:00”
   * 4) salva mapping fineId ↔ notificationId (in utils/notifications)
   */
  const handleAddFine = useCallback(
    async (fineData: {
      player_id: number;
      type: string;
      amount: number;
      description?: string;
      due_date: string;
    }) => {
      if (!isMister) return false;

      // 1) crea multa e ottieni id
      const fineId = await addFine(fineData);
      if (!fineId) return false;

      // 2) chiudi subito modal
      setModalVisible(false);

      // 3) schedula in async (non blocca UI)
      (async () => {
        try {
          await scheduleFineDueNotification(
            fineData.due_date,
            safePlayerName,
            safeTeamName,
            fineId 
          );
        } catch (e) {
          console.log('Errore scheduleFineDueNotification:', e);
        }
      })();

      return true;
    },
    [isMister, addFine, safePlayerName, safeTeamName]
  );

  // Toggle pagata/non pagata
  const handleToggleFineStatus = useCallback(
    async (fineId: number, currentStatus: boolean) => {
      if (!isMister) return;
      await toggleFinePayment(fineId, !currentStatus);
    },
    [isMister, toggleFinePayment]
  );

  /**
   * Elimina multa:
   * prima cancello la notifica associata (se presente),
   * poi cancello la multa dal DB.
   */
  const handleDeleteFine = useCallback(
    (fineId: number) => {
      if (!isMister) return;

      Alert.alert(
        'Elimina multa',
        'Sei sicuro di voler eliminare questa multa?',
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'Elimina',
            style: 'destructive',
            onPress: async () => {
              try {
                // 1) cancella notifica associata (se esiste)
                await cancelFineDueNotificationByFineId(fineId);

                // 2) cancella multa
                const ok = await deleteFine(fineId);
                if (ok) await refreshFines();
              } catch (e) {
                console.log('Errore deleteFine/cancelNotif:', e);
              }
            },
          },
        ],
        { cancelable: true }
      );
    },
    [isMister, deleteFine, refreshFines]
  );

  // Filtro multe
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

  // Loading gate
  if (!enabled || loading) {
    return (
      <SafeAreaView
        style={[s.container, s.center]}
        edges={['top', 'right', 'bottom', 'left']}
      >
        <Text>Caricamento multe…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* HEADER */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={s.title} numberOfLines={1}>
          Multe giocatore
        </Text>

        {isMister ? (
          <TouchableOpacity
            style={s.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={22} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* FILTER BAR */}
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
            setFilter((prev) => {
              if (prev === 'all') return 'pending';
              if (prev === 'pending') return 'overdue';
              if (prev === 'overdue') return 'paid';
              return 'all';
            });
          }}
        >
          <Filter size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <ScrollView
        style={s.list}
        contentContainerStyle={{ paddingBottom: 16 + Math.max(insets.bottom, 8) }}
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
              onToggleStatus={() => handleToggleFineStatus(f.id, !!f.is_paid)}
              onDelete={isMister ? () => handleDeleteFine(f.id) : undefined}
            />
          ))
        )}
      </ScrollView>

      {/* MODAL */}
      <AddFineModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddFine}
        presetPlayerId={playerId > 0 ? playerId : undefined}
      />
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  title: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', flex: 1 },

  addButton: {
    backgroundColor: '#22c55e',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 8, android: 6 }),
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