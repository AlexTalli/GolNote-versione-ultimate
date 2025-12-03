import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Users, CircleAlert as AlertCircle, Trash2 } from 'lucide-react-native';

interface Team {
  id: number;
  name: string;
  description: string;
  players_count: number;
  active_fines: number;
  color: string;
}

interface TeamCardProps {
  team: Team;
  onPress: () => void;
  onDelete?: () => void; // 👈 aggiunto
}

export function TeamCard({ team, onPress, onDelete }: TeamCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Colore a sinistra */}
      <View style={[styles.colorBar, { backgroundColor: team.color }]} />

      <View style={styles.content}>
        {/* Header con nome + cestino + freccia */}
        <View style={styles.header}>
          <Text style={styles.teamName}>{team.name}</Text>

          <View style={styles.headerButtons}>
            {/* Cestino come nel PlayerCard */}
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // evita apertura card
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

        {/* Descrizione */}
        <Text style={styles.description} numberOfLines={2}>
          {team.description}
        </Text>

        {/* Stats */}
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

const styles = StyleSheet.create({
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
  colorBar: {
    width: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },

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

  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },

  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  finesText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
