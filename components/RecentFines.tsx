import { View, Text, StyleSheet } from 'react-native';

export function RecentFines() {
  return (
    <View style={styles.container}>
      <Text style={styles.emptyText}>Nessuna multa recente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
});