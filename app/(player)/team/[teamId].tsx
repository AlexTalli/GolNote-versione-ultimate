/* ========== IMPORTAZIONI ========== */

// Importazioni per componenti UI e navigazione
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState, useCallback } from 'react';

// Icona per il pulsante indietro
import { ArrowLeft, CalendarDays, Trash2, UserX } from 'lucide-react-native';

// Database per caricare i giocatori
import { playersDB, Player, usersDB } from '@/database/database.supabase';

// Componente per mostrare la card del giocatore
import { PlayerCard } from '@/components/PlayerCard';

// Auth per eliminare account
import { useAuth } from '@/contexts/AuthContext';

export default function PlayerTeamScreen() {
  /* ========== HOOKS E STATI ========== */

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

  const { teamId: teamIdParam } = useLocalSearchParams<{ teamId?: string }>();
  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'surname' | 'position'>('surname');

  /* ========== FUNZIONI DI CARICAMENTO ========== */

  const load = useCallback(async () => {
    if (!(teamId > 0)) return;
    setLoading(true);
    try {
      const ps = await playersDB.getByTeamPublic(teamId);
      setPlayers(ps);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Elimina account
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Elimina Account',
      'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await usersDB.deleteAccount(user.id);
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Errore', 'Impossibile eliminare l\'account.');
            }
          },
        },
      ]
    );
  }, [user, logout, router]);

  // Dissocia da questo giocatore
  const handleUnlinkPlayer = useCallback(() => {
    Alert.alert(
      'Dissocia Giocatore',
      'Vuoi dissociarti da questo giocatore? Potrai scegliere un altro giocatore dopo.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Dissocia',
          onPress: async () => {
            if (!user) return;
            try {
              await usersDB.unlinkPlayer(user.id);
              
              // Aggiorna la sessione
              const updatedUser = { ...user, playerId: null };
              const AsyncStorage = await import('@react-native-async-storage/async-storage');
              await AsyncStorage.default.setItem('@session:v1', JSON.stringify(updatedUser));
              
              // Naviga a join-team
              router.replace('/(player)/join-team');
            } catch (error) {
              console.error('Error unlinking player:', error);
              Alert.alert('Errore', 'Impossibile dissociare il giocatore.');
            }
          },
        },
      ]
    );
  }, [user, router]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // nome squadra se disponibile
  const teamName = players[0]?.team_name || 'Squadra';

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
      const surnameA = a.surname || a.name.split(' ').pop() || a.name;
      const surnameB = b.surname || b.name.split(' ').pop() || b.name;
      return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
    }
  });
}, [players, sortBy]);

  /* ========== RENDERING ========== */

  // Controllo se teamId è valido
  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  // Schermata di caricamento
  if (loading) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>Caricamento…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* Header con pulsante indietro e titolo */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        {/* Pulsante indietro */}
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        {/* Titolo con nome squadra */}
        <Text style={s.title} numberOfLines={1}>
          {teamName}
        </Text>

        {/* Icona dissocia giocatore */}
        <TouchableOpacity style={s.unlinkBtn} onPress={handleUnlinkPlayer}>
          <UserX size={20} color="#f59e0b" />
        </TouchableOpacity>

        {/* Icona cestino per eliminare account */}
        <TouchableOpacity style={s.deleteBtn} onPress={handleDeleteAccount}>
          <Trash2 size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Lista dei giocatori con scroll e refresh */}
      <ScrollView
        style={s.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sort buttons */}
        <View style={s.sortBar}>
          <Text style={s.sortLabel}>Ordina per:</Text>
          <View style={s.sortButtons}>
            <TouchableOpacity
              style={[s.sortBtn, sortBy === 'position' && s.sortBtnActive]}
              onPress={() => setSortBy('position')}
            >
              <Text style={[s.sortBtnText, sortBy === 'position' && s.sortBtnTextActive]}>
                Ruolo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.sortBtn, sortBy === 'surname' && s.sortBtnActive]}
              onPress={() => setSortBy('surname')}
            >
              <Text style={[s.sortBtnText, sortBy === 'surname' && s.sortBtnTextActive]}>
                Cognome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={s.attendanceCta}
          onPress={() =>
            router.push({
              pathname: '/(player)/attendance/[teamId]',
              params: {
                teamId: String(teamId),
                teamName,
              },
            })
          }
        >
          <CalendarDays size={18} color="#1d4ed8" />
          <Text style={s.attendanceCtaText}>
            Apri il calendario per vedere le presenze agli allenamenti
          </Text>
        </TouchableOpacity>

        <Text style={s.sectionTitle}>Giocatori</Text>

        {players.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Nessun giocatore.</Text>
          </View>
        ) : (
          sortedPlayers.map((p, index) => (
            <PlayerCard
              key={String(p.id)}
              player={p}
              index={index + 1}
              isCurrentPlayer={p.id === user?.playerId}
              onPress={() =>
                router.push({
                  pathname: '/(player)/[playerId]/fines',
                  params: { playerId: String(p.id) },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  /* ========== STILI ========== */

  // Contenitore principale con sfondo bianco
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header copiato dallo screen del mister (stesso stile blu)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#2e70b7ff', // stesso colore del mister
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  // Pulsante indietro
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

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
  
  
  // Pulsante dissocia giocatore
  unlinkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Pulsante elimina account
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Titolo centrato
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Lista dei giocatori
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
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

  // Titolo della sezione
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
});