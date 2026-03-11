import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Users, UserCheck } from 'lucide-react-native';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

// Schermata iniziale: selezione ruolo (mister o player)
export default function RoleSelection() {
  const { setRole } = useRole();
  const { user, loading } = useAuth();

  // Se l'utente ha già una sessione attiva, reindirizza direttamente
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'mister') {
        router.replace('/(mister)/(tabs)');
      } else {
        router.replace('/(player)/join-team');
      }
    }
  }, [user, loading]);

  // Gestisce selezione ruolo e navigazione
  const selectRole = (role: 'mister' | 'player') => {
    // Memorizza ruolo
    setRole(role);

    // Naviga a scelta auth (login/register) passando ruolo come param
    router.push({ pathname: '/(auth)/auth-choice', params: { role } });
  };

  return (
    <View style={styles.container}>
      {/* Header con titolo app */}
      <View style={styles.header}>
        <Text style={styles.title}>GolNote</Text>
        <Text style={styles.subtitle}>Gestionale Squadre Sportive</Text>
      </View>

      {/* Container selezione ruolo */}
      <View style={styles.roleContainer}>
        <Text style={styles.roleTitle}>Seleziona il tuo Ruolo:</Text>

        {/* Pulsante Mister */}
        <TouchableOpacity
          style={[styles.roleButton, styles.misterButton]}
          onPress={() => selectRole('mister')}
        >
          <UserCheck size={32} color="#ffffff" /> 
          <Text style={styles.roleButtonText}>Sono il Mister</Text>
          <Text style={styles.roleDescription}>
            Gestisci giocatori, squadre, multe e allenamenti della tua squadra
          </Text>
        </TouchableOpacity>

        {/* Pulsante Player */}
        <TouchableOpacity
          style={[styles.roleButton, styles.playerButton]}
          onPress={() => selectRole('player')}
        >
          <Users size={32} color="#ffffff" /> 
          <Text style={styles.roleButtonText}>Sono un Giocatore</Text>
          <Text style={styles.roleDescription}>
            Visualizza le multe, pagamenti e presenze agli allenamenti della tua squadra
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer descrittivo */}
      <Text style={styles.footer}>
        Sviluppato per la gestione delle squadre sportive, con focus su semplicità e funzionalità per mister e giocatori
      </Text>
    </View>
  );
}
// Stili della schermata
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#c55022', fontWeight: '600' },
  roleContainer: { gap: 20 },
  roleTitle: { fontSize: 20, fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: 20 },
  roleButton: {
    borderRadius: 16, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, 
  },
  misterButton: { backgroundColor: '#22c55e' }, 
  playerButton: { backgroundColor: '#3b82f6' }, 
  roleButtonText: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 12, marginBottom: 8 },
  roleDescription: { fontSize: 14, color: '#ffffff', textAlign: 'center', opacity: 0.9 },
  footer: { textAlign: 'center', color: '#9ca3af', fontSize: 12, marginTop: 40 },
});
