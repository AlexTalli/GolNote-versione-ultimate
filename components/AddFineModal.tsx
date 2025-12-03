// components/AddFineModal.tsx
import { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useDatabase, usePlayers } from '@/hooks/useDatabase';

// Helpers per conversione data europea
const toEuropeanDate = (isoDate: string) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
};
const toISODate = (euroDate: string) => {
  const v = euroDate.trim();
  if (!/^\d{2}-\d{2}-\d{4}$/.test(v)) return '';
  const [d, m, y] = v.split('-');
  return `${y}-${m}-${d}`;
};

interface AddFineModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (fineData: {
    player_id: number;
    type: string;
    amount: number;
    description?: string;
    due_date: string; // YYYY-MM-DD
  }) => Promise<boolean> | boolean;
  /** Se valorizzato, il modal non mostra il picker e usa direttamente questo player */
  presetPlayerId?: number;
}

const fineTypes = [
  'Linguaggio inappropriato',
  'Ammonizione',
  'Espulsione',
  'Ritardo',
  'Assenza non giustificata',
  'Comportamento scorretto',
  'Altro',
];

export function AddFineModal({ visible, onClose, onSave, presetPlayerId }: AddFineModalProps) {
  const { isInitialized } = useDatabase();

  // Carica i giocatori solo se NON ho un player preimpostato
  const playersEnabled = isInitialized && !presetPlayerId;
  const { players, loading } = usePlayers(undefined, { enabled: playersEnabled });

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(presetPlayerId ?? null);
  const [selectedType, setSelectedType] = useState(fineTypes[0]);
  const [customType, setCustomType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); // DD-MM-YYYY
  const [saving, setSaving] = useState(false);

  // Autoseleziona il primo giocatore quando non c'è preset e la lista è pronta
  useEffect(() => {
    if (!presetPlayerId && playersEnabled && !loading && players.length > 0) {
      setSelectedPlayerId(prev => prev ?? players[0].id);
    }
  }, [presetPlayerId, playersEnabled, loading, players]);

  const canSave = useMemo(() => {
    const a = parseFloat(amount.replace(',', '.'));
    const dateOk = /^\d{2}-\d{2}-\d{4}$/.test(dueDate.trim()); // ✅ DD-MM-YYYY
    const hasType = selectedType !== 'Altro' ? true : customType.trim().length > 0;
    return !!selectedPlayerId && !Number.isNaN(a) && a > 0 && dateOk && hasType;
  }, [selectedPlayerId, amount, dueDate, selectedType, customType]);

  const resetForm = () => {
    setSelectedPlayerId(presetPlayerId ?? null);
    setSelectedType(fineTypes[0]);
    setCustomType('');
    setAmount('');
    setDescription('');
    setDueDate('');
    setSaving(false);
  };

  const setDueDateInDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const iso = d.toISOString().split('T')[0]; // YYYY-MM-DD
    setDueDate(toEuropeanDate(iso));           // ✅ DD-MM-YYYY
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);

    const a = parseFloat(amount.replace(',', '.'));
    const isoDate = toISODate(dueDate); // ✅ converti a ISO per il DB

    const payload = {
      player_id: selectedPlayerId as number,
      type: selectedType === 'Altro' ? customType.trim() : selectedType,
      amount: a,
      description: description.trim(),
      due_date: isoDate, // ✅ YYYY-MM-DD
    };

    try {
      const ok = await onSave(payload);
      if (ok !== false) {
        resetForm();
      } else {
        setSaving(false);
      }
    } catch {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Aggiungi Multa</Text>
            <TouchableOpacity onPress={handleClose} disabled={saving}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Se non ho un player preimpostato, mostro il picker */}
          {!presetPlayerId && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seleziona Giocatore</Text>
              {loading ? (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <ActivityIndicator />
                </View>
              ) : players.length === 0 ? (
                <Text style={{ color: '#6b7280' }}>Nessun giocatore disponibile.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playersScroll}>
                  {players.map((p: any) => (
                    <TouchableOpacity
                      key={String(p.id)}
                      style={[styles.playerButton, selectedPlayerId === p.id && styles.selectedPlayer]}
                      onPress={() => setSelectedPlayerId(p.id)}
                      disabled={saving}
                    >
                      <Text style={styles.playerNumber}>#{p.number}</Text>
                      <Text style={[styles.playerName, selectedPlayerId === p.id && styles.selectedPlayerText]}>
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Tipo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo Multa</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {fineTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeButton, selectedType === type && styles.selectedType]}
                    onPress={() => setSelectedType(type)}
                    disabled={saving}
                  >
                    <Text style={[styles.typeText, selectedType === type && styles.selectedTypeText]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedType === 'Altro' && (
                <TextInput
                  style={[styles.input, styles.customTypeInput]}
                  value={customType}
                  onChangeText={setCustomType}
                  placeholder="Specifica il tipo di multa"
                  editable={!saving}
                />
              )}
            </View>

            {/* Importo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Importo (€)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0,00"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'decimal-pad'}
                editable={!saving}
              />
            </View>

            {/* Descrizione */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrizione (opzionale)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Aggiungi dettagli…"
                multiline
                numberOfLines={3}
                editable={!saving}
              />
            </View>

            {/* Scadenza */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data Scadenza</Text>
              <View style={styles.dueDateContainer}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="DD-MM-YYYY"
                  editable={!saving}
                />
                <View style={styles.quickDateButtons}>
                  <TouchableOpacity style={styles.quickDateButton} onPress={() => setDueDateInDays(7)} disabled={saving}>
                    <Text style={styles.quickDateText}>7g</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickDateButton} onPress={() => setDueDateInDays(14)} disabled={saving}>
                    <Text style={styles.quickDateText}>14g</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickDateButton} onPress={() => setDueDateInDays(30)} disabled={saving}>
                    <Text style={styles.quickDateText}>30g</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Azioni */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose} disabled={saving}>
              <Text style={styles.cancelText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, (!canSave || saving) && styles.disabledButton]}
              onPress={handleSave}
              disabled={!canSave || saving}
            >
              <Text style={styles.saveText}>{saving ? 'Salvataggio…' : 'Salva Multa'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 16, width: '90%', maxWidth: 400, maxHeight: '85%', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  form: { maxHeight: 420 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9fafb' },
  textArea: { height: 80, textAlignVertical: 'top' },
  typeScroll: { flexDirection: 'row' },
  typeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff', marginRight: 8 },
  selectedType: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  typeText: { fontSize: 14, color: '#6b7280' },
  selectedTypeText: { color: '#fff', fontWeight: '600' },
  customTypeInput: { marginTop: 8 },
  playersScroll: { flexDirection: 'row' },
  playerButton: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff', marginRight: 8, minWidth: 90 },
  selectedPlayer: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  playerNumber: { fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 2 },
  playerName: { fontSize: 10, color: '#6b7280', textAlign: 'center' },
  selectedPlayerText: { color: '#fff' },
  dueDateContainer: { gap: 8 },
  dateInput: { flex: 1 },
  quickDateButtons: { flexDirection: 'row', gap: 8 },
  quickDateButton: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  quickDateText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center' },
  cancelText: { fontSize: 16, color: '#6b7280' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#22c55e', alignItems: 'center' },
  disabledButton: { backgroundColor: '#9ca3af' },
  saveText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
