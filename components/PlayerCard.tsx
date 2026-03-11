import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, CircleAlert as AlertCircle, Trash2, Edit } from 'lucide-react-native';

/* ========== TIPI ========== */

// Definizione delle props del componente PlayerCard
type PlayerCardProps = {
  player: {
    id: number;
    name: string;
    surname?: string;
    number: string | number;
    position: string;
    active_fines?: number; // Numero di multe attive (opzionale)
    total_unpaid?: number; // Totale non pagato (opzionale)
  };
  index: number; // Posizione nella lista (1-based)
  onPress: () => void; // Funzione chiamata quando si preme la card
  onDelete?: () => void; // prop (opzionale) per eliminare il giocatore
  onEdit?: () => void; // prop (opzionale) per modificare il giocatore
  isCurrentPlayer?: boolean; // Se è il giocatore loggato (per evidenziarlo)
};

/* ========== COMPONENTE ========== */

export function PlayerCard({ player, index, onPress, onDelete, onEdit, isCurrentPlayer }: PlayerCardProps) {
  // Conversione sicura dei valori delle multe (default a 0 se undefined)
  const active = Number(player.active_fines ?? 0);
  const unpaid = Number(player.total_unpaid ?? 0);

  // Costruisci il nome completo (Cognome Nome)
  const fullName = player.surname ? `${player.surname} ${player.name}` : player.name;

  /* ========== RENDERING ========== */

  return (
    <View style={[s.card, isCurrentPlayer && s.cardCurrent]}>
      {/* Parte sinistra tappabile: mostra numero, nome e ruolo, apre dettaglio giocatore */}
      <TouchableOpacity style={s.left} onPress={onPress} activeOpacity={0.9}>
        <View style={s.numberBadge}>
          <Text style={s.numberText}>#{index}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.name} numberOfLines={1}>{fullName}</Text>
          <Text style={s.role} numberOfLines={1}>{player.position}</Text>
        </View>
      </TouchableOpacity>

      {/* Parte destra tappabile: mostra badge multe attive, totale non pagato e freccia, apre dettaglio */}
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

      {/* Pulsante matita per modificare il giocatore (solo se onEdit è fornito) */}
      {onEdit && (
        <TouchableOpacity style={s.editBtn} onPress={(e) => { e.stopPropagation(); onEdit(); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Edit size={18} color="#daa520" />
        </TouchableOpacity>
      )}

      {/* Pulsante cestino per eliminare il giocatore (solo se onDelete è fornito) */}
      {onDelete && (
        <TouchableOpacity style={s.trashBtn} onPress={(e) => { e.stopPropagation(); onDelete(); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ========== STILI ========== */

const s = StyleSheet.create({
  // Stile principale della card: sfondo bianco, bordi arrotondati, ombra per effetto elevato
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

  // Stile per evidenziare il giocatore corrente
  cardCurrent: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#2563eb',
  },

  // Parte sinistra: numero, nome e ruolo
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },

  // Badge circolare per il numero del giocatore
  numberBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  numberText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Testo del nome e ruolo
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  role: { fontSize: 13, color: '#6b7280' },

  // Parte destra: badge multe, importo e freccia
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  // Badge per multe attive: sfondo rosso chiaro con icona e numero
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 14,
  },
  badgeText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },

  // Importo totale non pagato
  amount: { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 64, textAlign: 'right' },

  // Pulsante matita per modificare
  editBtn: { marginLeft: 8 },

  // Pulsante cestino per eliminare
  trashBtn: { marginLeft: 8 }, // spazio a destra della card
});
