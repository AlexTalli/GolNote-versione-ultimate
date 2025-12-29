import { View, Text, StyleSheet } from 'react-native';
import { Users, CircleAlert as AlertCircle, Euro, CircleCheck as CheckCircle, Shield } from 'lucide-react-native';

// Interfaccia che definisce le props per il componente DashboardCard
interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
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
export function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  // Ottieni il componente icona basato sulla prop icon
  const IconComponent = iconMap[icon as keyof typeof iconMap];

  return (
    <View style={[styles.card, { width: '48%' }]}>
      <View style={styles.header}>
        <IconComponent size={24} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
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