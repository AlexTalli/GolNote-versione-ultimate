import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, CircleAlert as AlertCircle, Euro, CircleCheck as CheckCircle, Shield, ChevronRight } from 'lucide-react-native';

// Interfaccia che definisce le props per il componente DashboardCard
interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

// Mappa dei nomi delle icone ai corrispondenti componenti icona di Lucide React Native
const iconMap = {
  users: Users,
  'alert-circle': AlertCircle,
  euro: Euro,
  'check-circle': CheckCircle,
  shield: Shield,
};

// Il componente DashboardCard rende una scheda che mostra un'icona, un titolo e un valore
export function DashboardCard({ title, value, icon, color, onPress }: DashboardCardProps) {
  // Ottieni il componente icona basato sulla prop icon
  const IconComponent = iconMap[icon as keyof typeof iconMap];

  return (
    <TouchableOpacity
      style={[styles.card, { width: '48%' }]}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.chevronWrap}>
        <ChevronRight size={16} color="#9ca3af" />
      </View>
      <View style={styles.header}>
        <IconComponent size={24} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  chevronWrap: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});