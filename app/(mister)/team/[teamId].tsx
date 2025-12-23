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
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDatabase, usePlayers } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerCard } from '@/components/PlayerCard';
import { AddPlayerModal } from '@/components/AddPlayerModal';
import type { Player } from '@/database/database';

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
    refreshPlayers,
  } = usePlayers(teamId, { enabled });

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddPlayer = useCallback(
    async (playerData: { name: string; number: string; position: string; team_id: number }) => {
      const ok = await addPlayer(playerData);
      if (ok) setModalVisible(false);
    },
    [addPlayer]
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
    const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
    const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;

    // 1️⃣ Ordine per ruolo
    if (posA !== posB) {
      return posA - posB;
    }

    // 2️⃣ Stesso ruolo → ordine alfabetico per nome
    return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
  });
}, [players]);

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
      {/* 🔹 HEADER — Back + Titolo + bottone Aggiungi */}
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

      {/* LISTA GIOCATORI */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {players.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>
              Nessun giocatore ancora. Aggiungine uno con “+”.
            </Text>
          </View>
        ) : (
          sortedPlayers.map((player: Player) => (
            <PlayerCard
              key={String(player.id)}
              player={player}
              onPress={() =>
                router.push({
                  pathname: '/(mister)/player/[playerId]/fines',
                  params: {
                    playerId: String(player.id),
                    playerName: player.name,                                    
                    teamName: typeof teamName === 'string' ? teamName : undefined,
                  },
                })
              }
              onDelete={() => askDeletePlayer(player.id, player.name)}
            />
          ))
        )}
      </ScrollView>

      {/* MODAL AGGIUNTA GIOCATORE */}
      <AddPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddPlayer}
        presetTeamId={teamId}
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});