import React, { useEffect, useMemo, useState } from 'react';
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
} from 'react-native';
import { X } from 'lucide-react-native';
import { SPORT_POSITIONS, normalizeSport } from '@/utils/sports';

type TeamLite = { id: number; name: string; color?: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (playerData: { name?: string; surname?: string; position?: string; team_id?: number }) => void | Promise<void>;
  teamSport?: string;
  /** Se passi presetTeamId, la squadra è bloccata e non mostri la selezione */
  presetTeamId?: number;
  /** Se NON passi presetTeamId puoi passare una lista di squadre selezionabili */
  teams?: TeamLite[];
  /** Dati del giocatore per edit mode */
  editPlayer?: { id: number; name: string; surname: string; position: string };
};

export function AddPlayerModal({ visible, onClose, onSave, teamSport, presetTeamId, teams = [], editPlayer }: Props) {
  const normalizedSport = useMemo(() => normalizeSport(teamSport), [teamSport]);
  const positions = useMemo(() => SPORT_POSITIONS[normalizedSport], [normalizedSport]);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [selectedPosition, setSelectedPosition] = useState(() => positions[0]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Pre-fill form when editing
  useMemo(() => {
    if (visible && editPlayer) {
      setName(editPlayer.name);
      setSurname(editPlayer.surname);
      setSelectedPosition(editPlayer.position);
    }
  }, [visible, editPlayer]);

  useEffect(() => {
    if (!positions.includes(selectedPosition)) {
      setSelectedPosition(positions[0]);
    }
  }, [positions, selectedPosition]);

  const isPreset = typeof presetTeamId === 'number' && presetTeamId > 0;

  // Imposta la squadra selezionata in base al preset o alla prima disponibile
  useEffect(() => {
    if (isPreset) {
      setSelectedTeamId(presetTeamId!);
    } else if (teams.length > 0) {
      setSelectedTeamId((prev) => prev ?? teams[0].id);
    } else {
      setSelectedTeamId(null);
    }
  }, [isPreset, presetTeamId, teams]);

  const canSave = useMemo(
    () => Boolean(name.trim() && surname.trim() && selectedTeamId),
    [name, surname, selectedTeamId]
  );

  const reset = () => {
    setName('');
    setSurname('');
    setSelectedPosition(positions[0]);
    setErr(null);
    if (isPreset) {
      setSelectedTeamId(presetTeamId!);
    } else {
      setSelectedTeamId(teams[0]?.id ?? null);
    }
  };

  const handleSave = async () => {
    if (editPlayer) {
      // Edit mode: only name, surname, position required
      if (!name.trim() || !surname.trim()) {
        setErr('Compila nome e cognome');
        return;
      }
      await onSave({
        name: name.trim(),
        surname: surname.trim(),
        position: selectedPosition,
      });
      reset();
    } else {
      // Add mode: need team selection
      if (!canSave || !selectedTeamId) {
        setErr('Compila tutti i campi e seleziona una squadra');
        return;
      }
      await onSave({
        name: name.trim(),
        surname: surname.trim(),
        position: selectedPosition,
        team_id: selectedTeamId,
      });
      reset();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Messaggio se non c'è una squadra selezionabile e non c'è preset
  const noTeamsError = !isPreset && teams.length === 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{editPlayer ? 'Modifica Giocatore' : 'Aggiungi Giocatore'}</Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Inserisci nome"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cognome</Text>
              <TextInput
                style={styles.input}
                value={surname}
                onChangeText={setSurname}
                placeholder="Inserisci cognome"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ruolo</Text>
              <View style={styles.positionGrid}>
                {positions.map((position) => (
                  <TouchableOpacity
                    key={position}
                    style={[
                      styles.positionButton,
                      selectedPosition === position && styles.selectedPosition,
                    ]}
                    onPress={() => setSelectedPosition(position)}
                  >
                    <Text
                      style={[
                        styles.positionText,
                        selectedPosition === position && styles.selectedPositionText,
                      ]}
                    >
                      {position}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Squadra (only show in add mode) */}
            {!editPlayer && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Squadra</Text>

              {isPreset ? (
                <Text style={{ color: '#374151' }}>
                  Il giocatore verrà assegnato alla squadra corrente.
                </Text>
              ) : noTeamsError ? (
                <Text style={{ color: '#ef4444' }}>
                  Nessuna squadra disponibile: creane una nella tab “Squadre”.
                </Text>
              ) : (
                <View style={styles.teamListBox}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {teams.map((team) => {
                      const selected = selectedTeamId === team.id;
                      return (
                        <TouchableOpacity
                          key={String(team.id)}
                          style={[
                            styles.teamButton,
                            selected && styles.selectedTeam,
                            { borderColor: team.color ?? '#d1d5db' },
                          ]}
                          onPress={() => setSelectedTeamId(team.id)}
                        >
                          <View
                            style={[
                              styles.teamColorDot,
                              { backgroundColor: team.color ?? '#9ca3af' },
                            ]}
                          />
                          <Text style={[styles.teamText, selected && styles.selectedTeamText]}>
                            {team.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
            )}

            {err ? <Text style={styles.err}>{err}</Text> : null}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!canSave || (!isPreset && teams.length === 0)) && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!canSave || (!isPreset && teams.length === 0)}
            >
              <Text style={styles.saveText}>Salva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#ffffff', borderRadius: 16, width: '90%', maxWidth: 400, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9fafb' },
  positionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  positionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#ffffff' },
  selectedPosition: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  positionText: { fontSize: 14, color: '#6b7280' },
  selectedPositionText: { color: '#ffffff', fontWeight: '600' },
  teamListBox: { gap: 8, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 8, backgroundColor: '#fff' },
  teamButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, borderWidth: 2, backgroundColor: '#ffffff', gap: 8, marginBottom: 8 },
  selectedTeam: { backgroundColor: '#f0fdf4' },
  teamColorDot: { width: 12, height: 12, borderRadius: 6 },
  teamText: { fontSize: 16, color: '#6b7280' },
  selectedTeamText: { color: '#1f2937', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center' },
  cancelText: { fontSize: 16, color: '#6b7280' },
  saveButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#22c55e', alignItems: 'center' },
  disabledButton: { backgroundColor: '#9ca3af' },
  saveText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  err: { color: '#ef4444', marginTop: 6 },
});
