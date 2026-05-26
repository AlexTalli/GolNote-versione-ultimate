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
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { useDatabase, usePlayers } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerCard } from '@/components/PlayerCard';
import { AddPlayerModal } from '@/components/AddPlayerModal';
import { teamsDB, type Player } from '@/database/database.supabase';
import { normalizeSport, SPORT_POSITIONS } from '@/utils/sports';

export default function TeamRosterScreen() {
  const insets = useSafeAreaInsets();

  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const safeTeamName = useMemo(
    () => (typeof teamName === 'string' ? teamName : 'Squadra'),
    [teamName]
  );

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
  const [teamSport, setTeamSport] = useState<string>('calcio');

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!(teamId > 0)) return;
      const team = await teamsDB.getById(teamId);
      if (!mounted) return;
      setTeamSport(normalizeSport(team?.sport));
    })();

    return () => {
      mounted = false;
    };
  }, [teamId]);

  const handleAddPlayer = useCallback(
    async (playerData: { name?: string; surname?: string; position?: string; team_id?: number }) => {
      if (!playerData.name || !playerData.surname || !playerData.team_id) return;

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

  const sortedPlayers = useMemo(() => {
    const positions = SPORT_POSITIONS[normalizeSport(teamSport)];
    const positionOrder = positions.reduce<Record<string, number>>((acc, position, index) => {
      acc[position.toLowerCase()] = index;
      return acc;
    }, {});

    return [...players].sort((a, b) => {
      if (sortBy === 'position') {
        const posA = positionOrder[a.position?.toLowerCase()] ?? 99;
        const posB = positionOrder[b.position?.toLowerCase()] ?? 99;
        if (posA !== posB) return posA - posB;
        return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
      }

      const surnameA = a.surname || a.name.split(' ').pop() || a.name;
      const surnameB = b.surname || b.name.split(' ').pop() || b.name;
      return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
    });
  }, [players, sortBy, teamSport]);

  if (!user || user.role !== 'mister') {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Effettua l’accesso come Mister per gestire i giocatori.</Text>
      </SafeAreaView>
    );
  }

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>ID squadra non valido.</Text>
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
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          Rosa · {safeTeamName}
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
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
              showFinesInfo={false}
              onDelete={() => askDeletePlayer(player.id, player.name)}
              onEdit={() => {
                setEditingPlayerId(player.id);
                setModalVisible(true);
              }}
            />
          ))
        )}
      </ScrollView>

      <AddPlayerModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingPlayerId(null);
        }}
        onSave={editingPlayerId === null ? handleAddPlayer : handleEditPlayer}
        teamSport={teamSport}
        presetTeamId={teamId}
        editPlayer={editingPlayerId !== null ? players.find(p => p.id === editingPlayerId) : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
});
