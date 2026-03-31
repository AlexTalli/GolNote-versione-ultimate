import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronRight, Users, CircleAlert as AlertCircle, Trash2, Edit } from 'lucide-react-native';

/* ========== INTERFACCE ========== */

// Definizione dell'interfaccia per un team
interface Team {
  id: number;
  name: string;
  description: string;
  season_year?: string | null;
  category?: string | null;
  players_count: number; // Numero di giocatori nella squadra
  active_fines: number; // Numero di multe attive
  color: string; // Colore rappresentativo della squadra
  logo_uri?: string | null; // Logo opzionale della squadra
}

// Props del componente TeamCard
interface TeamCardProps {
  team: Team;
  onPress: () => void; // Funzione chiamata quando si preme la card
  onEdit?: () => void; // Funzione opzionale per modificare la squadra
  onDelete?: () => void; // Funzione opzionale per eliminare la squadra
}

/* ========== COMPONENTE ========== */

export function TeamCard({ team, onPress, onEdit, onDelete }: TeamCardProps) {
  /* ========== RENDERING ========== */

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Sezione logo/colore a sinistra (grande porzione) */}
      <View style={[styles.logoSection, team.logo_uri ? {} : { backgroundColor: team.color }]}>
        {team.logo_uri && (
          <Image source={{ uri: team.logo_uri }} style={styles.logoImage} resizeMode="cover" />
        )}
      </View>

      <View style={styles.content}>
        {/* Header con nome squadra, pulsanti edit/delete e freccia */}
        <View style={styles.header}>
          <View style={styles.nameWrap}>
            <Text style={styles.teamName} numberOfLines={2}>
              {team.name}
            </Text>
          </View>

          <View style={styles.headerButtons}>
            {/* Pulsante matita per modificare la squadra */}
            {onEdit && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={styles.editBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Edit size={18} color="#daa520" />
              </TouchableOpacity>
            )}

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

        {(team.season_year || team.category) && (
          <Text style={styles.metaInfo} numberOfLines={2}>
            {[team.season_year, team.category].filter(Boolean).join(' • ')}
          </Text>
        )}

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

  // Sezione logo/colore grande a sinistra
  logoSection: {
    width: 120,
    height: 120,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },

  // Contenuto principale della card
  content: {
    flex: 1,
    padding: 14,
  },

  // Header con nome e pulsanti
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameWrap: {
    flex: 1,
    marginRight: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editBtn: {
    marginRight: 4,
  },
  trashBtn: {
    marginRight: 4,
  },

  // Testo del nome della squadra
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 20,
  },

  // Testo della descrizione
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  metaInfo: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 10,
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
