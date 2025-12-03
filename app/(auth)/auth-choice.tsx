import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function AuthChoice() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const r = role === 'mister' ? 'mister' : 'player';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sei un {r === 'mister' ? 'Mister' : 'Giocatore'}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          router.push({ pathname: '/(auth)/login', params: { role: r } })
        }>
        <Text style={styles.btnText}>Accedi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.secondary]}
        onPress={() =>
          router.push({ pathname: '/(auth)/register', params: { role: r } })
        }>
        <Text style={styles.btnText}>Registrati</Text>
      </TouchableOpacity>

      {/* 🔙 Bottone per tornare alla selezione ruolo */}
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.backText}>← Torna alla selezione ruolo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  btn: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondary: { backgroundColor: '#3b82f6' },
  btnText: { color: '#fff', fontWeight: '600' },
  backText: {
    color: '#6b7280',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
