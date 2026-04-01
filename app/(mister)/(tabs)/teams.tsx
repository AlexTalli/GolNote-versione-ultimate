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
import { Plus, Link2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
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

  // Hook per gestire squadre: carica, aggiunge, elimina, modifica, refresh
  const {
    teams,
    loading,
    addTeam,
    deleteTeam,
    leaveDelegatedTeam,
    updateTeam,
    refreshTeams,
  } = useTeams({ enabled });

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);

  // Gestisce aggiunta squadra con controllo duplicati
  const handleAddTeam = useCallback(
    async (teamData: {
      name?: string;
      description?: string;
      season_year?: string;
      category?: string;
      color?: string;
      logo_uri?: string;
      password?: string;
      mister_password?: string;
    }) => {
      if (!teamData.name) return;

      const ok = await addTeam({
        name: teamData.name,
        description: teamData.description || '',
        season_year: teamData.season_year || '',
        category: teamData.category || '',
        color: teamData.color || '#22c55e',
        logo_uri: teamData.logo_uri,
        password: teamData.password,
        mister_password: teamData.mister_password,
      });

      if (!ok) {
        Alert.alert(
          'Squadra già presente',
          'Esiste già una squadra con questa società, stagione e categoria. Modifica uno dei campi.'
        );
        return;
      }

      setModalVisible(false);
    },
    [addTeam]
  );

  // Gestisce modifica squadra
  const handleEditTeam = useCallback(
    async (teamData: {
      name?: string;
      description?: string;
      season_year?: string;
      category?: string;
      color?: string;
      logo_uri?: string;
      password?: string;
      mister_password?: string;
    }) => {
      if (editingTeamId === null) return;

      const ok = await updateTeam(editingTeamId, {
        name: teamData.name,
        description: teamData.description,
        season_year: teamData.season_year,
        category: teamData.category,
        color: teamData.color,
        logo_uri: teamData.logo_uri,
        password: teamData.password,
        mister_password: teamData.mister_password,
      });

      if (!ok) {
        Alert.alert(
          'Squadra già presente',
          'Esiste già una squadra con questa società, stagione e categoria. Modifica uno dei campi.'
        );
        return;
      }

      setModalVisible(false);
      setEditingTeamId(null);
    },
    [editingTeamId, updateTeam]
  );

  // Gestore pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTeams();
    setRefreshing(false);
  }, [refreshTeams]);

  // Ricarica quando la tab torna in focus (es. dopo accesso a squadra delegata)
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      refreshTeams();
    }, [enabled, refreshTeams])
  );

  // Chiede conferma prima di eliminare squadra (cascata su giocatori e multe)
  const askDeleteTeam = useCallback(
    (id: number, name: string, isDelegated?: boolean) => {
      if (isDelegated) {
        Alert.alert('Azione non consentita', 'Puoi eliminare solo le squadre di cui sei proprietario.');
        return;
      }

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

  const askLeaveDelegatedTeam = useCallback(
    (id: number, name: string) => {
      Alert.alert(
        'Esci da squadra delegata',
        `Vuoi uscire da "${name}"?\nNon vedrai più questa squadra tra le tue squadre e i tuoi messaggi in chat di questa squadra verranno rimossi.`,
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'Esci',
            style: 'destructive',
            onPress: async () => {
              const ok = await leaveDelegatedTeam(id);
              if (!ok) {
                Alert.alert('Errore', 'Impossibile uscire dalla squadra delegata.');
              } else {
                await refreshTeams();
              }
            },
          },
        ]
      );
    },
    [leaveDelegatedTeam, refreshTeams]
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
      {/* Header con titolo e bottoni azioni */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Le tue Squadre</Text>
        </View>
        <View style={styles.headerButtons}>
          {/* Bottone accedi a squadra delegata */}
          <TouchableOpacity 
            style={styles.delegateButton} 
            onPress={() => router.push('/(mister)/join-team')}
          >
            <Link2 size={14} color="#2563eb" />
            <Text style={styles.delegateButtonText}>Accedi</Text>
          </TouchableOpacity>
          {/* Bottone aggiungi squadra */}
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
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
          onEdit={team.is_delegated ? undefined : (() => {
            setEditingTeamId(team.id);
            setModalVisible(true);
          })}
          onDelete={team.is_delegated
            ? (() => askLeaveDelegatedTeam(team.id, team.name))
            : (() => askDeleteTeam(team.id, team.name, team.is_delegated))}
        />
      ))}
        </ScrollView>
      )}

      {/* Modal per aggiungere nuova squadra o modificare */}
      <AddTeamModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTeamId(null);
        }}
        onSave={editingTeamId === null ? handleAddTeam : handleEditTeam}
        editTeam={editingTeamId !== null ? teams.find(t => t.id === editingTeamId) : undefined}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  delegateButton: {
    backgroundColor: '#eff6ff',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  delegateButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
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
  teamsList: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});