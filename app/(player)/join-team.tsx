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
import { useAuth } from '@/contexts/AuthContext';  // 👈 IMPORT

export default function JoinTeamScreen() {
  const router = useRouter();
  const { user } = useAuth(); // 👈 nickname disponibile
  const { query, setQuery, results, loading } = useTeamSearch();
  const { verify } = useCheckTeamPassword();

  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [selected, setSelected] = useState<{
    id: number;
    name: string;
    hasPassword: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToTeam = (teamId: number) => {
    router.push({ pathname: '/team/[teamId]', params: { teamId: String(teamId) } });
  };

  const openPwd = (team: any) => {
    const hasPassword = !!team.password_hash;
    setSelected({ id: team.id, name: team.name, hasPassword });
    if (!hasPassword) {
      return goToTeam(team.id);
    }
    setPwd('');
    setShowPwd(false);
    setError(null);
    setPwdModalVisible(true);
  };

  const closePwdModal = () => {
    setPwdModalVisible(false);
    setPwd('');
    setShowPwd(false);
    setError(null);
  };

  const submitPwd = async () => {
    if (!selected) return;
    setChecking(true);
    setError(null);
    const ok = await verify(selected.id, pwd, selected.hasPassword);
    setChecking(false);
    if (ok) {
      closePwdModal();
      goToTeam(selected.id);
    } else {
      setError('Password errata. Riprova.');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* HEADER CENTRATO */}
      <View style={s.header}>
        
        {/* 👇 NUOVO TESTO */}
        {user?.nickname && (
          <Text style={s.greeting}>Ciao, {user.nickname} !</Text>
        )}

        <Text style={s.title}>Cerca la tua Squadra</Text>

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

      {/* RISULTATI / STATO */}
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
              <View style={[s.colorDot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.teamName} numberOfLines={1}>
                  {item.name}
                </Text>
                {!!item.description && (
                  <Text style={s.teamDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </View>
              {!!item.password_hash && <Lock size={18} color="#6b7280" />}
            </TouchableOpacity>
          )}
        />
      )}

      {/* 🔙 Pulsante per tornare alla selezione ruolo */}
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={s.backText}>← Torna alla selezione ruolo</Text>
      </TouchableOpacity>

      {/* Modal password */}
      <Modal
        visible={pwdModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePwdModal}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Entra in "{selected?.name}"</Text>

            {/* Campo password con occhio */}
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

            {!!error && <Text style={s.error}>{error}</Text>}

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

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },

  // 🔹 BLOCCO TITOLO + SEARCH CENTRATI
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

  // password + occhio
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