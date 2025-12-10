// components/FineCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  CircleCheck as CheckCircle,
  Clock,
  TriangleAlert as AlertTriangle,
  Trash2,
} from 'lucide-react-native';

type FineLike = {
  id: number;
  player_name?: string | null;
  type: string;
  amount: number | string;
  due_date: string;              // ISO date string (YYYY-MM-DD)
  is_paid: boolean | 0 | 1;      // può arrivare 0/1 dal DB
  description?: string | null;
};

type FineCardProps = {
  fine: FineLike;
  onToggleStatus?: (id: number, nextPaid: boolean) => void; // opzionale
  onDelete?: (id: number) => void;                          // opzionale
  showPlayerName?: boolean;                                 // opzionale (default: true)
};

export function FineCard({
  fine,
  onToggleStatus,
  onDelete,
  showPlayerName = true,
}: FineCardProps) {
  const paid = !!fine.is_paid;
  const amountNum = Number(fine.amount) || 0;
  const playerName = fine.player_name ?? 'Giocatore';

  const due = new Date(fine.due_date);
  const now = new Date();
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const isOverdue = !paid && due < now;
  const isDueSoon = !paid && due <= in7days && !isOverdue;

  const getStatusColor = () => {
    if (paid) return '#22c55e';
    if (isOverdue) return '#ef4444';
    if (isDueSoon) return '#f59e0b';
    return '#f59e0b';
  };

  const StatusIcon = paid ? CheckCircle : (isOverdue ? AlertTriangle : Clock);
  const canToggle = typeof onToggleStatus === 'function';
  const canDelete = typeof onDelete === 'function';

  return (
    <View style={[styles.card, isOverdue && styles.overdueCard]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          {showPlayerName && <Text style={styles.playerName}>{playerName}</Text>}
          <Text style={styles.fineType}>{fine.type}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.iconBtn, !canToggle && { opacity: 0.5 }]}
            disabled={!canToggle}
            onPress={() => canToggle && onToggleStatus!(fine.id, !paid)}
          >
            <StatusIcon size={20} color={getStatusColor()} />
          </TouchableOpacity>

          {canDelete && (
            <TouchableOpacity
              style={[styles.iconBtn, styles.trashBtn]}
              onPress={() => onDelete!(fine.id)}
            >
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!!fine.description && <Text style={styles.description}>{fine.description}</Text>}

      <View style={styles.footer}>
        <Text style={styles.amount}>{amountNum.toFixed(2)}€</Text>
        <Text style={[styles.dueDate, isOverdue && styles.overdueText]}>
          Scadenza: {isNaN(due.getTime()) ? '-' : due.toLocaleDateString('it-IT')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueCard: { borderLeftWidth: 4, borderLeftColor: '#ef4444' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  playerName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  fineType: { fontSize: 14, fontWeight: '500', color: '#374151' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: '#f3f4f6' },
  trashBtn: { backgroundColor: '#fff0f0', borderWidth: 1, borderColor: '#fee2e2' },
  description: { fontSize: 13, color: '#6b7280', fontStyle: 'italic' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#22c55e' },
  dueDate: { fontSize: 12, color: '#6b7280' },
  overdueText: { color: '#ef4444', fontWeight: '600' },
});
