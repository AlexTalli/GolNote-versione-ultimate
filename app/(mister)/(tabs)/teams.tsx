import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react-native';
import { TeamCard } from '@/components/TeamCard';
import { AddTeamModal } from '@/components/AddTeamModal';
import { useDatabase, useTeams } from '@/hooks/useDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function Teams() {
  const { isInitialized } = useDatabase();
  const { user } = useAuth();

  // Carica squadre solo se DB è pronto e utente è mister
  const enabled = useMemo(
    () => isInitialized && user?.role === 'mister',
    [isInitialized, user?.role]
  );

  // Hook per gestire squadre: carica, aggiunge, elimina, refresh
  const {
    teams,
    loading,
    addTeam,
    deleteTeam,
    refreshTeams,
  } = useTeams({ enabled });

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Gestisce aggiunta squadra con controllo duplicati
  const handleAddTeam = useCallback(
    async (teamData: {
      name: string;
      description: string;
      color: string;
      password?: string;
    }) => {
      const ok = await addTeam(teamData); // ownerUserId gestito automaticamente dall'hook

      if (!ok) {
        Alert.alert(
          'Nome già utilizzato',
          'Esiste già una squadra con questo nome. Scegli un nome diverso.'
        );
        return;
      }

      setModalVisible(false);
    },
    [addTeam]
  );

  // Gestore pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTeams();
    setRefreshing(false);
  }, [refreshTeams]);

  // Chiede conferma prima di eliminare squadra (cascata su giocatori e multe)
  const askDeleteTeam = useCallback(
    (id: number, name: string) => {
      Alert.alert(
        'Elimina squadra',
        `Vuoi eliminare "${name}"?\nVerranno eliminati anche tutti i giocatori e le multe associate.`,
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'Elimina',
            style: 'destructive',
            onPress: async () => {
              const ok = await deleteTeam(id);
              if (!ok) {
                Alert.alert('Errore', 'Impossibile eliminare la squadra.');
              } else {
                await refreshTeams();
              }
            },
          },
        ]
      );
    },
    [deleteTeam, refreshTeams]
  );

  // Controllo accesso: solo mister può vedere questa schermata
  if (!user || user.role !== 'mister') {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Effettua l&#39;accesso come Mister per gestire le squadre.</Text>
      </View>
    );
  }

  // Mostra caricamento mentre carica squadre
  if (!isInitialized || loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Caricamento squadre...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con titolo e bottone aggiungi */}
      <View style={styles.header}>
        <Text style={styles.title}>Le tue Squadre</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Lista squadre o messaggio vuoto */}
      {teams.length === 0 ? (
        <View style={[styles.centered, { padding: 24 }]}>
          <Text style={{ color: '#6b7280' }}>
            Nessuna squadra ancora. Aggiungine una con “+”.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.teamsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
      >
      {teams.map((team: any) => (
        <TeamCard
          key={String(team.id)}
          team={team}
          onPress={() =>
            router.push({
              pathname: '/(mister)/team/[teamId]',
              params: {
                teamId: String(team.id),
                teamName: team.name, 
              },
            })
          }
          onDelete={() => askDeleteTeam(team.id, team.name)}
        />
      ))}
        </ScrollView>
      )}

      {/* Modal per aggiungere nuova squadra */}
      <AddTeamModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTeam}
      />
    </View>
  );
}

// Stili per la schermata squadre
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
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
  teamsList: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});