/* ========== IMPORTAZIONI ========== */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Users, CircleAlert as AlertCircle, Trash2 } from 'lucide-react-native';

/* ========== INTERFACCE ========== */

// Definizione dell'interfaccia per un team
interface Team {
  id: number;
  name: string;
  description: string;
  players_count: number; // Numero di giocatori nella squadra
  active_fines: number; // Numero di multe attive
  color: string; // Colore rappresentativo della squadra
}

// Props del componente TeamCard
interface TeamCardProps {
  team: Team;
  onPress: () => void; // Funzione chiamata quando si preme la card
  onDelete?: () => void; // Funzione opzionale per eliminare la squadra
}

/* ========== COMPONENTE ========== */

export function TeamCard({ team, onPress, onDelete }: TeamCardProps) {
  /* ========== RENDERING ========== */

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Barra colorata a sinistra per identificare la squadra */}
      <View style={[styles.colorBar, { backgroundColor: team.color }]} />

      <View style={styles.content}>
        {/* Header con nome squadra, cestino e freccia */}
        <View style={styles.header}>
          <Text style={styles.teamName}>{team.name}</Text>

          <View style={styles.headerButtons}>
            {/* Pulsante cestino per eliminare la squadra (se fornito) */}
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // evita apertura card, cosi l'utente non apre per sbaglio la card
                  onDelete();
                }}
                style={styles.trashBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 size={18} color="#ef4444" />
              </TouchableOpacity>
            )}

            <ChevronRight size={20} color="#9ca3af" />
          </View>
        </View>

        {/* Descrizione della squadra */}
        <Text style={styles.description} numberOfLines={2}>
          {team.description}
        </Text>

        {/* Statistiche: numero giocatori e multe attive */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Users size={16} color="#6b7280" />
            <Text style={styles.statText}>{team.players_count} giocatori</Text>
          </View>

          {team.active_fines > 0 && (
            <View style={styles.stat}>
              <AlertCircle size={16} color="#ef4444" />
              <Text style={[styles.statText, styles.finesText]}>
                {team.active_fines} multe attive
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ========== STILI ========== */

const styles = StyleSheet.create({
  // Stile principale della card: sfondo bianco, bordi arrotondati, ombra
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  // Barra colorata a sinistra per il colore della squadra
  colorBar: {
    width: 6,
  },

  // Contenuto principale della card
  content: {
    flex: 1,
    padding: 16,
  },

  // Header con nome e pulsanti
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trashBtn: {
    marginRight: 4,
  },

  // Testo del nome della squadra
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },

  // Testo della descrizione
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },

  // Contenitore delle statistiche
  stats: {
    flexDirection: 'row',
    gap: 16,
  },

  // Singola statistica con icona e testo
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Testo specifico per le multe attive (rosso)
  finesText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
