import { useState, useCallback } from 'react';
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
  Alert,
  Image,
} from 'react-native';
import { Lock, Search, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useMisterTeamSearch, useCheckMisterPassword } from '@/hooks/usePlayerTeam';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { teamsDB } from '@/database/database.supabase';

// Schermata per mister delegati: cerca e accedi a una squadra
export default function MisterJoinTeamScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { query, setQuery, results, loading } = useMisterTeamSearch();
  const { verify } = useCheckMisterPassword();

  // Stati per modal password
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Squadra selezionata
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apre modal per inserire password
  const openPwd = async (team: any) => {
    try {
      if (user?.id) {
        const myTeams = await teamsDB.getAllByOwner(user.id);
        const alreadyInside = myTeams.some((t: any) => Number(t.id) === Number(team.id));

        if (alreadyInside) {
          Alert.alert('Sei già dentro questa squadra');
          return;
        }
      }
    } catch (e) {
      console.error('[MisterJoinTeamScreen] check already-inside error:', e);
    }

    setSelected({ id: team.id, name: team.name });
    setPwd('');
    setShowPwd(false);
    setError(null);
    setPwdModalVisible(true);
  };

  // Chiude modal password
  const closePwdModal = () => {
    setPwdModalVisible(false);
    setPwd('');
    setShowPwd(false);
    setError(null);
  };

  // Verifica password e accede alla squadra
  const submitPwd = async () => {
    if (!selected) return;
    setChecking(true);
    setError(null);
    const ok = await verify(selected.id, pwd);
    setChecking(false);
    if (ok) {
      closePwdModal();
      // Naviga alla squadra
      router.replace({
        pathname: '/(mister)/team/[teamId]',
        params: { teamId: String(selected.id), teamName: selected.name },
      });
    } else {
      setError('Password errata. Riprova.');
    }
  };

  // Torna indietro
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.titleRow}>
          <TouchableOpacity style={s.backBtn} onPress={handleBack}>
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>
          <Text style={s.title}>Accedi ad una Squadra</Text>
          <View style={{ width: 36 }} />
        </View>

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
          <Text style={s.emptyText}>
            {query.length < 2 ? 'Digita il nome della squadra' : 'Nessun risultato.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.teamRow} onPress={() => openPwd(item)}>
              {item.logo_uri ? (
                <Image
                  source={{ uri: item.logo_uri }}
                  style={s.teamLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={[s.colorDot, { backgroundColor: item.color }]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={s.teamName} numberOfLines={1}>
                  {item.name}
                </Text>

                {(item.season_year || item.category) && (
                  <Text style={s.teamMeta} numberOfLines={1}>
                    {[item.season_year, item.category].filter(Boolean).join(' • ')}
                  </Text>
                )}

                {/* Descrizione se presente */}
                {!!item.description && (
                  <Text style={s.teamDesc} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </View>
              {/* Icona lucchetto perché è protetta */}
              <Lock size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal per inserire password */}
      <Modal
        visible={pwdModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePwdModal}
      >
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Accedi a &#34;{selected?.name}&#34;</Text>
            <Text style={s.modalSubtitle}>Inserisci la password di delega</Text>

            {/* Input password */}
            <View style={s.pwdInputRow}>
              <TextInput
                style={s.pwdInput}
                value={pwd}
                onChangeText={setPwd}
                placeholder="Password"
                secureTextEntry={!showPwd}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!checking}
              />
              <TouchableOpacity onPress={() => setShowPwd((v) => !v)} disabled={checking}>
                {showPwd ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </TouchableOpacity>
            </View>

            {/* Messaggio errore */}
            {!!error && <Text style={s.errorText}>{error}</Text>}

            {/* Pulsanti */}
            <View style={s.pwdActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={closePwdModal} disabled={checking}>
                <Text style={s.cancelBtnText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.submitBtn, checking && s.submitBtnDisabled]}
                onPress={submitPwd}
                disabled={checking || pwd.length < 1}
              >
                {checking ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={s.submitBtnText}>Accedi</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ========== STILI ========== */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  searchWrapper: { gap: 8 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  teamLogo: { width: 48, height: 48, borderRadius: 4 },
  colorDot: { width: 48, height: 48, borderRadius: 4 },
  teamName: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  teamMeta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  teamDesc: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

  // Modal stili
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  modalSubtitle: { fontSize: 14, color: '#6b7280' },
  pwdInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  pwdInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  errorText: { color: '#ef4444', fontSize: 13, marginTop: -4 },
  pwdActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
});
