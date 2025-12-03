import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, CircleAlert as AlertCircle, Trash2 } from 'lucide-react-native';

type PlayerCardProps = {
  player: {
    id: number;
    name: string;
    number: string | number;
    position: string;
    active_fines?: number;
    total_unpaid?: number;
  };
  onPress: () => void;
  onDelete?: () => void; // 👈 nuova prop (opzionale)
};

export function PlayerCard({ player, onPress, onDelete }: PlayerCardProps) {
  const active = Number(player.active_fines ?? 0);
  const unpaid = Number(player.total_unpaid ?? 0);

  return (
    <View style={s.card}>
      {/* Sinistra tappabile: apre dettaglio */}
      <TouchableOpacity style={s.left} onPress={onPress} activeOpacity={0.9}>
        <View style={s.numberBadge}>
          <Text style={s.numberText}>{String(player.number)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.name} numberOfLines={1}>{player.name}</Text>
          <Text style={s.role} numberOfLines={1}>{player.position}</Text>
        </View>
      </TouchableOpacity>

      {/* Destra tappabile: apre dettaglio */}
      <TouchableOpacity style={s.right} onPress={onPress} activeOpacity={0.9}>
        {active > 0 && (
          <View style={s.badge}>
            <AlertCircle size={12} color="#ef4444" />
            <Text style={s.badgeText}>{active}</Text>
          </View>
        )}
        <Text style={s.amount}>{unpaid.toFixed(2)}€</Text>
        <ChevronRight size={18} color="#9ca3af" />
      </TouchableOpacity>

      {/* Cestino (se passato) */}
      {onDelete && (
        <TouchableOpacity style={s.trashBtn} onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,

    marginBottom: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  numberBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  numberText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  role: { fontSize: 13, color: '#6b7280' },

  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },
  amount: { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 64, textAlign: 'right' },

  trashBtn: { marginLeft: 8 }, // spazio a destra della card
});
