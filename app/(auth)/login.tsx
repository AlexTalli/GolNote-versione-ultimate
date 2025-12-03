import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Eye, EyeOff } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

export default function Login() {
  const { role: roleParam } = useLocalSearchParams<{ role?: 'mister' | 'player' }>();
  const { role: roleCtx, setRole, setPlayerIdentity } = useRole();
  const { login, loading } = useAuth();

  const role = useMemo(() => roleParam ?? roleCtx ?? null, [roleParam, roleCtx]);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // lock portrait
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
  }, []);

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

    const e = await login(nickname.trim(), password, role);
    if (e) {
      setErr(e);
      return;
    }

    if (roleCtx !== role) setRole(role);
    if (role === 'player') setPlayerIdentity({ playerId: null });

    router.replace(role === 'mister' ? '/(mister)/(tabs)' : '/(player)/join-team');
  };

  if (role !== 'mister' && role !== 'player') {
    return (
      <View style={s.container}>
        <Text style={s.title}>Ruolo non selezionato</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={s.backText}>← Torna alla selezione ruolo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Accedi</Text>

      {/* Nickname */}
      <View style={s.inputRow}>
        <TextInput
          style={s.inputField}
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
        />
      </View>

      {/* Password + occhio */}
      <View style={s.inputRow}>
        <TextInput
          style={s.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPwd}
          autoCapitalize="none"
        />
        <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPwd((v) => !v)}>
          {showPwd ? <EyeOff size={22} color="#6b7280" /> : <Eye size={22} color="#6b7280" />}
        </TouchableOpacity>
      </View>

      {err ? <Text style={s.err}>{err}</Text> : null}

      <TouchableOpacity
        style={[s.btn, loading && s.btnDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        <Text style={s.btnText}>{loading ? '...' : 'Entra'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={s.backText}>← Torna alla selezione ruolo</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
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

  // wrapper per input + icona (stessa altezza, allineati)
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
    backgroundColor: '#22c55e',
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


