import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { X } from 'lucide-react-native';
import type { PlayerAttendanceSummary } from '@/database/database';

type PlayerAttendanceSummaryModalProps = {
  visible: boolean;
  onClose: () => void;
  playerName: string;
  summary: PlayerAttendanceSummary;
};

export const PlayerAttendanceSummaryModal = ({
  visible,
  onClose,
  playerName,
  summary,
}: PlayerAttendanceSummaryModalProps) => {
  const summaryItems = [
    { label: 'Presenze', value: summary.present, color: '#16a34a' },
    { label: 'Infortuni', value: summary.injured, color: '#ee57bc' },
    { label: 'Assenze Giustificate', value: summary.absent_justified, color: '#ea580c' },
    { label: 'Assenze Ingiustificate', value: summary.absent_unjustified, color: '#dc2626' },
    { label: 'Malattie', value: summary.sick, color: '#7c3aed' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{playerName}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 16 }}>
            <Text style={styles.subtitle}>
              Totale allenamenti: <Text style={{ fontWeight: 'bold' }}>{summary.total_sessions}</Text>
            </Text>

            {summaryItems.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.label}>{item.label}</Text>
                <Text style={[styles.value, { color: item.color, fontWeight: 'bold' }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  body: {
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    minWidth: 30,
    textAlign: 'right',
  },
});
