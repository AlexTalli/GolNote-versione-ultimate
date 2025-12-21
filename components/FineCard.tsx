/* ========== IMPORTAZIONI ========== */

// components/FineCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  CircleCheck as CheckCircle,
  Clock,
  TriangleAlert as AlertTriangle,
  Trash2,
} from 'lucide-react-native';

/* ========== TIPI ========== */

// Tipo per rappresentare una multa (fine)
type FineLike = {
  id: number;
  player_name?: string | null; // Nome del giocatore (opzionale)
  type: string; // Tipo di multa
  amount: number | string; // Importo della multa
  due_date: string; // Data di scadenza in formato ISO (YYYY-MM-DD)
  is_paid: boolean | 0 | 1; // Stato pagamento (può arrivare 0/1 dal DB)
  description?: string | null; // Descrizione opzionale
};

// Props del componente FineCard
type FineCardProps = {
  fine: FineLike;
  onToggleStatus?: (id: number, nextPaid: boolean) => void; // Funzione opzionale per cambiare stato pagamento
  onDelete?: (id: number) => void; // Funzione opzionale per eliminare la multa
  showPlayerName?: boolean; // Se mostrare il nome del giocatore (default: true)
};

/* ========== COMPONENTE ========== */

export function FineCard({
  fine,
  onToggleStatus,
  onDelete,
  showPlayerName = true,
}: FineCardProps) {
  /* ========== LOGICA ========== */

  // Determina se la multa è pagata (converte 0/1 a boolean)
  const paid = !!fine.is_paid;
  const amountNum = Number(fine.amount) || 0;
  const playerName = fine.player_name ?? 'Giocatore';

  // Calcola date per determinare lo stato di scadenza
  const due = new Date(fine.due_date);
  const now = new Date();
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Stati di scadenza: scaduta, in scadenza entro 7 giorni, o normale
  const isOverdue = !paid && due < now;
  const isDueSoon = !paid && due <= in7days && !isOverdue;

  // Funzione per ottenere il colore dello stato
  const getStatusColor = () => {
    if (paid) return '#22c55e'; // Verde se pagata
    if (isOverdue) return '#ef4444'; // Rosso se scaduta
    if (isDueSoon) return '#f59e0b'; // Arancione se in scadenza
    return '#f59e0b'; // Default arancione
  };

  // Icona da mostrare in base allo stato
  const StatusIcon = paid ? CheckCircle : (isOverdue ? AlertTriangle : Clock);
  const canToggle = typeof onToggleStatus === 'function';
  const canDelete = typeof onDelete === 'function';

  /* ========== RENDERING ========== */

  return (
    <View style={[styles.card, isOverdue && styles.overdueCard]}>
    <View style={styles.header}>
  {/* BLOCCO SINISTRO: testi */}
  <View style={styles.titleColumn}>
    {showPlayerName && (
      <Text
        style={[styles.playerName, { marginBottom: 6 }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {playerName}
      </Text>
    )}

    <Text
      style={styles.fineType}
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {fine.type}
    </Text>

    {/* Descrizione della multa (se presente) */}
    {!!fine.description && (
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {fine.description}
      </Text>
    )}
  </View>

  {/* BLOCCO DESTRO: azioni */}
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

      <View style={styles.footer}>
        <Text style={styles.amount}>{amountNum.toFixed(2)}€</Text>
        <Text style={[styles.dueDate, isOverdue && styles.overdueText]}>
          Scadenza: {isNaN(due.getTime()) ? '-' : due.toLocaleDateString('it-IT')}
        </Text>
      </View>
    </View>
  );
}

/* ========== STILI ========== */
/*
const styles = StyleSheet.create({
  // Stile base della card: sfondo bianco, bordi arrotondati, ombra
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

  // Stile aggiuntivo per multe scadute: bordo rosso a sinistra
  overdueCard: { borderLeftWidth: 4, borderLeftColor: '#ef4444' },

  // Header con nome giocatore, tipo multa e pulsanti azioni
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10, // utile per staccare testi/azioni
  },

    // ✅ importantissimo: flex + minWidth 0
  titleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  // Testo del nome del giocatore
 playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    maxWidth: '45%', // opzionale: evita che il nome mangi tutto
  },

  // Testo del tipo di multa
    fineType: {
    flex: 1,       // prende lo spazio rimanente
    minWidth: 0,   // ✅ serve per ellipsize in row
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  // Riga dei pulsanti azioni (stato e cestino)
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // Stile base per pulsanti icona
  iconBtn: { padding: 6, borderRadius: 8, backgroundColor: '#f3f4f6' },

  // Stile specifico per pulsante cestino (sfondo rosso chiaro)
  trashBtn: { backgroundColor: '#fff0f0', borderWidth: 1, borderColor: '#fee2e2' },

  // Testo della descrizione (corsivo)
  description: { fontSize: 13, color: '#6b7280', fontStyle: 'italic' },

  // Footer con importo e data scadenza
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },

  // Importo della multa (verde, grassetto)
  amount: { fontSize: 18, fontWeight: 'bold', color: '#22c55e' },

  // Data di scadenza
  dueDate: { fontSize: 12, color: '#6b7280' },

  // Testo scadenza per multe scadute (rosso, grassetto)
  overdueText: { color: '#ef4444', fontWeight: '600' },
}); */

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

  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start', // ⬅️ importante: testi in alto, icone allineate bene
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },

  // ✅ colonna testi
  titleColumn: {
    flex: 1,
    minWidth: 0, // fondamentale per ellipsis
  },

  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },

  fineType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },

  trashBtn: {
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },

  description: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4, // leggero distacco dal titolo
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
  },

  dueDate: {
    fontSize: 12,
    color: '#6b7280',
  },

  overdueText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});


