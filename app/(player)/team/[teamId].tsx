/* ========== IMPORTAZIONI ========== */

// Importazioni per componenti UI e navigazione
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState, useCallback } from 'react';

// Icona per il pulsante indietro
import { ArrowLeft } from 'lucide-react-native';

// Database per caricare i giocatori
import { playersDB, Player } from '@/database/database';

// Componente per mostrare la card del giocatore
import { PlayerCard } from '@/components/PlayerCard';

export default function PlayerTeamScreen() {
  /* ========== HOOKS E STATI ========== */

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { teamId: teamIdParam } = useLocalSearchParams<{ teamId?: string }>();
  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
    const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;

    // 1️⃣ Ordine per ruolo
    if (posA !== posB) {
      return posA - posB;
    }

    // 2️⃣ Stesso ruolo → ordine alfabetico
    return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
  });
}, [players]);

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

        {/* Spazio vuoto per centrare il titolo */}
        <View style={{ width: 44 }} />
      </View>

      {/* Lista dei giocatori con scroll e refresh */}
      <ScrollView
        style={s.list}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={s.sectionTitle}>Giocatori</Text>

        {players.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Nessun giocatore.</Text>
          </View>
        ) : (
          sortedPlayers.map((p) => (
            <PlayerCard
              key={String(p.id)}
              player={p}
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

  // Titolo centrato
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Lista dei giocatori
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Titolo della sezione
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
});