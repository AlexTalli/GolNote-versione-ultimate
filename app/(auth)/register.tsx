import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

export default function Register() {
  // Leggi il ruolo dalla route (mister o player) o dal contesto se non presente
  const { role: roleParam } = useLocalSearchParams<{ role?: 'mister' | 'player' }>();
  const { role: roleCtx, setRole, setPlayerIdentity } = useRole();
  const { register, loading } = useAuth();

  // Determina il ruolo finale: prima dalla route, poi dal contesto
  const role = useMemo(() => roleParam ?? roleCtx ?? null, [roleParam, roleCtx]);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);

    if (role !== 'mister' && role !== 'player') {
      router.replace('/');
      return;
    }

    if (!nickname.trim() || !password) {
      setErr('Compila tutti i campi');
      return;
    }

    const e = await register(nickname.trim(), password, role);
    if (e) {
      setErr(e);
      return;
    }

    if (roleCtx !== role) setRole(role);
    if (role === 'player') setPlayerIdentity({ playerId: null });

    router.replace(role === 'mister' ? '/(mister)/(tabs)' : '/(player)/join-team');
  };

  // Se ruolo non valido, mostra messaggio e bottone per tornare indietro
  if (role !== 'mister' && role !== 'player') {
    return (
      <View style={rStyles.container}>
        <Text style={rStyles.title}>Ruolo non selezionato</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={rStyles.backText}>← Torna alla selezione ruolo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={rStyles.container}>
      <Text style={rStyles.title}>Registrati</Text>

      {/* Nickname */}
      <View style={rStyles.inputRow}>
        <TextInput
          style={rStyles.inputField}
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={rStyles.inputRow}>
        <TextInput
          style={rStyles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPwd}
          autoCapitalize="none"
        />
        <TouchableOpacity style={rStyles.eyeBtn} onPress={() => setShowPwd((v) => !v)}>
          {showPwd ? <EyeOff size={22} color="#6b7280" /> : <Eye size={22} color="#6b7280" />}
        </TouchableOpacity>
      </View>

      {err ? <Text style={rStyles.err}>{err}</Text> : null}

      <TouchableOpacity
        style={[rStyles.btn, loading && rStyles.btnDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={rStyles.btnText}>{loading ? '...' : 'Crea account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={rStyles.backText}>← Torna alla selezione ruolo</Text>
      </TouchableOpacity>
    </View>
  );
}

const rStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111827',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  eyeBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 16 },

  err: { color: '#ef4444', marginTop: 4, marginBottom: 4, textAlign: 'center' },

  backText: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});