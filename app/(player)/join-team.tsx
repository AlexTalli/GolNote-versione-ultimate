import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Lock, Search, Eye, EyeOff } from 'lucide-react-native';
import { useTeamSearch, useCheckTeamPassword } from '@/hooks/usePlayerTeam';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext'; 

// Schermata per giocatori: cerca e unisciti a una squadra
export default function JoinTeamScreen() {
  const router = useRouter();
  const { user } = useAuth(); // nickname 
  const { query, setQuery, results, loading } = useTeamSearch(); // Hook per ricerca squadre
  const { verify } = useCheckTeamPassword(); // Hook per verifica password

  // Stati per modal password
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Squadra selezionata per join
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
    hasPassword: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(false); // Loading verifica password
  const [error, setError] = useState<string | null>(null);

  // Naviga ai dettagli squadra
  const goToTeam = (teamId: number) => {
    router.push({ pathname: '/team/[teamId]', params: { teamId: String(teamId) } });
  };

  // Apre modal password o entra direttamente se non protetta
  const openPwd = (team: any) => {
    const hasPassword = !!team.password_hash;
    setSelected({ id: team.id, name: team.name, hasPassword });
    if (!hasPassword) {
      return goToTeam(team.id); // Entra senza password
    }
    setPwd('');
    setShowPwd(false);
    setError(null);
    setPwdModalVisible(true);
  };

  // Chiude modal e reset
  const closePwdModal = () => {
    setPwdModalVisible(false);
    setPwd('');
    setShowPwd(false);
    setError(null);
  };

  // Invia password per verifica
  const submitPwd = async () => {
    if (!selected) return;
    setChecking(true);
    setError(null);
    const ok = await verify(selected.id, pwd, selected.hasPassword); // Verifica password
    setChecking(false);
    if (ok) {
      closePwdModal();
      goToTeam(selected.id); // Entra se ok
    } else {
      setError('Password errata. Riprova.');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        
        {/* Saluto personalizzato con nickname */}
        {user?.nickname && (
          <Text style={s.greeting}>Ciao, {user.nickname} !</Text>
        )}

        <Text style={s.title}>Cerca la tua Squadra</Text>

        {/* Campo ricerca squadre */}
        <View style={s.searchWrapper}>
          <View style={s.searchRow}>
            <Search size={18} color="#555960ff" />
            <TextInput
              style={s.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Digita il nome della squadra…"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
      </View>

      {/* Risultati ricerca */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator />
        </View>
      ) : results.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>Nessun risultato.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.teamRow} onPress={() => openPwd(item)}>
              {/* Punto colore squadra */}
              <View style={[s.colorDot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.teamName} numberOfLines={1}>
                  {item.name}
                </Text>
                {/* Descrizione se presente */}
                {!!item.description && (
                  <Text style={s.teamDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </View>
              {/* Icona lucchetto se protetta */}
              {!!item.password_hash && <Lock size={18} color="#6b7280" />}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Pulsante back alla selezione ruolo */}
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={s.backText}>← Torna alla selezione ruolo</Text>
      </TouchableOpacity>

      {/* Modal per inserire password */}
      <Modal
        visible={pwdModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePwdModal}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Entra in &#34;{selected?.name}&#34;</Text>

            {/* Campo password con toggle visibilità */}
            <View style={s.pwdRow}>
              <TextInput
                style={s.pwdInput}
                value={pwd}
                onChangeText={setPwd}
                placeholder="Password squadra"
                secureTextEntry={!showPwd}
              />
              <TouchableOpacity
                style={s.pwdToggle}
                onPress={() => setShowPwd((v) => !v)}
              >
                {showPwd ? (
                  <EyeOff size={18} color="#6b7280" />
                ) : (
                  <Eye size={18} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>

            {/* Messaggio errore */}
            {!!error && <Text style={s.error}>{error}</Text>}

            {/* Pulsanti azione */}
            <View style={s.actions}>
              <TouchableOpacity style={s.btnGhost} onPress={closePwdModal}>
                <Text style={s.btnGhostText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, (!pwd || checking) && s.btnDisabled]}
                onPress={submitPwd}
                disabled={!pwd || checking}
              >
                {checking ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.btnText}>Entra</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Stili 
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  greeting: {
  fontSize: 30,
  fontWeight: '700',
  color: '#111827',
  marginBottom: 12,
  textAlign: 'center',
},
  searchWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: '#6b7280' },

  // Riga squadra
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  colorDot: { width: 16, height: 16, borderRadius: 8 },
  teamName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  teamDesc: { fontSize: 12, color: '#6b7280' },

  // Modal overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  // Riga password
  pwdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#f9fafb',
  },
  pwdInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  pwdToggle: {
    padding: 6,
  },

  error: { color: '#ef4444', marginTop: 8 },

  // Azioni modal
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    justifyContent: 'flex-end',
  },
  btn: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnDisabled: { backgroundColor: '#9ca3af' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  btnGhostText: { color: '#111827', fontWeight: '600' },

  backText: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});