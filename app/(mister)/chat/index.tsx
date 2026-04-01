import { useEffect, useState, useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTeams, usePlayers } from '@/hooks/useDatabase';

const POSITION_ORDER: Record<string, number> = {
  portiere: 0,
  difensore: 1,
  centrocampista: 2,
  attaccante: 3,
};

export default function ChatPlayerSelectScreen() {
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

  const { players, loading: playersLoading } = usePlayers(teamId);
  const [sortBy, setSortBy] = useState<'position' | 'surname'>('position');

  // Ordina giocatori per cognome o ruolo
  const sortedPlayers = useMemo(() => {
    if (!players) return [];
    return [...players].sort((a, b) => {
      if (sortBy === 'position') {
        const posA = POSITION_ORDER[a.position?.toLowerCase()] ?? 99;
        const posB = POSITION_ORDER[b.position?.toLowerCase()] ?? 99;
        if (posA !== posB) return posA - posB;
        
        const surnameA = a.surname || a.name.split(' ').pop() || a.name;
        const surnameB = b.surname || b.name.split(' ').pop() || b.name;
        return surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
      }

      const surnameA = a.surname || a.name.split(' ').pop() || a.name;
      const surnameB = b.surname || b.name.split(' ').pop() || b.name;
      
      const bySurname = surnameA.localeCompare(surnameB, 'it', { sensitivity: 'base' });
      if (bySurname !== 0) return bySurname;
      
      return a.name.localeCompare(b.name, 'it', { sensitivity: 'base' });
    });
  }, [players, sortBy]);

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  const handleSelectPlayer = (playerId: number, playerName: string) => {
    router.push({
      pathname: '/(mister)/chat/[playerId]',
      params: {
        teamId: String(teamId),
        teamName: safeTeamName,
        playerId: String(playerId),
        playerName: playerName.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {safeTeamName}
        </Text>

        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Scegli un giocatore per iniziare una chat:</Text>

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

        {playersLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2e70b7ff" />
          </View>
        ) : sortedPlayers && sortedPlayers.length > 0 ? (
          <FlatList
            data={sortedPlayers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.playerCard}
                activeOpacity={0.7}
                onPress={() =>
                  handleSelectPlayer(
                    item.id,
                    `${item.name} ${item.surname || ''}`.trim()
                  )
                }
              >
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {item.name} {item.surname || ''}
                  </Text>
                  <Text style={styles.playerNumber}>
                    #{index + 1} • {item.position}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nessun giocatore trovato</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
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
  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortBtnActive: {
    backgroundColor: '#2e70b7ff',
    borderColor: '#2e70b7ff',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortBtnTextActive: {
    color: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  playerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  playerNumber: {
    fontSize: 12,
    color: '#6b7280',
  },
});
