// app/(player)/team/[teamId].tsx
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
import { ArrowLeft } from 'lucide-react-native';
import { playersDB, Player } from '@/database/database';
import { PlayerCard } from '@/components/PlayerCard';

export default function PlayerTeamScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { teamId: teamIdParam } = useLocalSearchParams<{ teamId?: string }>();
  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>Caricamento…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* 🔹 HEADER — identico a quello del mister (senza +) */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        {/* 🔙 BACK */}
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        {/* 🏷️ TITOLO (nome squadra) */}
        <Text style={s.title} numberOfLines={1}>
          {teamName}
        </Text>

        {/* Spazio vuoto per tenere il titolo centrato come nel mister */}
        <View style={{ width: 44 }} />
      </View>

      {/* LISTA GIOCATORI */}
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
          players.map((p) => (
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // 🔥 Header copiato dallo screen del mister (stesso stile)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#2e70b7ff', // stesso colore del mister
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

  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
});