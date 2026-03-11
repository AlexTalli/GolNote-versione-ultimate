// app/(mister)/team/[teamId].tsx
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Plus, CalendarDays } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDatabase, usePlayers } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerCard } from '@/components/PlayerCard';
import { AddPlayerModal } from '@/components/AddPlayerModal';
import type { Player } from '@/database/database.supabase';

export default function TeamPlayersScreen() {
  const insets = useSafeAreaInsets();

  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const { isInitialized } = useDatabase();
  const { user } = useAuth();

  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister' && teamId > 0,
    [isInitialized, user?.role, teamId]
  );

  const {
    players,
    loading,
    addPlayer,
    deletePlayer,
    updatePlayer,
    refreshPlayers,
  } = usePlayers(teamId, { enabled });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'surname' | 'position'>('position');

  const handleAddPlayer = useCallback(
    async (playerData: { name?: string; surname?: string; position?: string; team_id?: number }) => {
      if (!playerData.name || !playerData.surname || !playerData.team_id) {
        return;
      }
      const ok = await addPlayer({
        name: playerData.name,
        surname: playerData.surname,
        position: playerData.position || 'Attaccante',
        team_id: playerData.team_id,
      });
      if (ok) setModalVisible(false);
    },
    [addPlayer]
  );

  const handleEditPlayer = useCallback(
    async (playerData: { name?: string; surname?: string; position?: string }) => {
      if (!editingPlayerId) return;
      const ok = await updatePlayer(editingPlayerId, playerData);
      if (ok) {
        setModalVisible(false);
        setEditingPlayerId(null);
      }
    },
    [editingPlayerId, updatePlayer]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPlayers();
    setRefreshing(false);
  }, [refreshPlayers]);

  const askDeletePlayer = useCallback(
    (id: number, name: string) => {
      Alert.alert(
        'Elimina giocatore',
        `Sei sicuro di voler eliminare "${name}"?`,
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'Elimina',
            style: 'destructive',
            onPress: async () => {
              const ok = await deletePlayer(id);
              if (!ok) {
                Alert.alert('Errore', 'Impossibile eliminare il giocatore.');
              }
            },
          },
        ]
      );
    },
    [deletePlayer]
  );

const POSITION_ORDER: Record<string, number> = {
  portiere: 0,
  difensore: 1,
  centrocampista: 2,
  attaccante: 3,
};

const sortedPlayers = useMemo(() => {
  return [...players].sort((a, b) => {
    if (sortBy === 'position') {
      // Ordine per ruolo, poi alfabetico per nome
      const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
      const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;
      if (posA !== posB) return posA - posB;
      return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
    } else {
      // Ordine alfabetico per cognome
      // Se surname esiste, usalo; altrimenti prova a estrarre l'ultima parola da name
      const surnameA = a.surname || a.name.split(' ').pop() || a.name;
      const surnameB = b.surname || b.name.split(' ').pop() || b.name;
      return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
    }
  });
}, [players, sortBy]);

  // gate
  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per gestire i giocatori.</Text>
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
      {/* HEADER — Back + Titolo + bottone Aggiungi */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          Giocatori
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Player List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sort buttons */}
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

        <TouchableOpacity
          style={styles.attendanceCta}
          onPress={() =>
            router.push({
              pathname: '/(mister)/attendance/[teamId]',
              params: {
                teamId: String(teamId),
                teamName: typeof teamName === 'string' ? teamName : undefined,
              },
            })
          }
        >
          <CalendarDays size={18} color="#1d4ed8" />
          <Text style={styles.attendanceCtaText}>
            Apri il calendario per segnare le presenze agli allenamenti
          </Text>
        </TouchableOpacity>

        {players.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>
              Nessun giocatore ancora. Aggiungine uno con “+”.
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
                    teamName: typeof teamName === 'string' ? teamName : undefined,
                  },
                })
              }
              onDelete={() => askDeletePlayer(player.id, player.name)}
              onEdit={() => {
                setEditingPlayerId(player.id);
                setModalVisible(true);
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Modal aggiunta/modifica giocatore */}
      <AddPlayerModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPlayerId(null);
        }}
        onSave={editingPlayerId === null ? handleAddPlayer : handleEditPlayer}
        presetTeamId={teamId}
        editPlayer={editingPlayerId !== null ? players.find(p => p.id === editingPlayerId) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

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

  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  
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
  
  attendanceCta: {
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendanceCtaText: {
    flex: 1,
    color: '#1e3a8a',
    fontWeight: '700',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});