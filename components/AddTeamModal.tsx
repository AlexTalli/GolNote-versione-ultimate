// components/AddTeamModal.tsx
import { useState, useMemo } from 'react';
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
import { X, Eye, EyeOff, Shield, Plus } from 'lucide-react-native';

interface AddTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (teamData: {
    name: string;
    description: string;
    color: string;
    password?: string;
  }) => void;
}

/* Palette principale */
const baseColors = [
  '#000000', 
  '#ef4444', 
  '#eab308', 
  '#3b82f6', 
  '#22c55e', 
];

/* Palette estesa ( nel + ) */
const extendedPalette = [
  '#fee2e2', '#fecaca', '#fca5a5', '#ef4444', '#b91c1c',
  '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#c2410c',
  '#fef9c3', '#fef08a', '#fde047', '#eab308', '#a16207',
  '#dcfce7', '#bbf7d0', '#4ade80', '#22c55e', '#15803d',
  '#dbeafe', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8',
  '#e0e7ff', '#c7d2fe', '#818cf8', '#6366f1', '#4f46e5',
  '#fce7f3', '#f9a8d4', '#f472b6', '#ec4899', '#be185d',
  '#e5e7eb', '#9ca3af', '#6b7280', '#1f2937', '#111827',
];

export function AddTeamModal({ visible, onClose, onSave }: AddTeamModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(baseColors[4]); // default verde

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  /* 🔥 palette custom */
  const [customVisible, setCustomVisible] = useState(false);

  const pwdTooShort = password.length > 0 && password.length < 6;
  const pwdMismatch = password.length > 0 && password !== password2;

  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (pwdTooShort || pwdMismatch) return false;
    return true;
  }, [name, pwdTooShort, pwdMismatch]);

  const handleSave = () => {
    if (!canSave) return;

    const payload: {
      name: string;
      description: string;
      color: string;
      password?: string;
    } = {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    };

    if (password.trim()) payload.password = password.trim();

    onSave(payload);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedColor(baseColors[4]);
    setPassword('');
    setPassword2('');
    setShowPwd(false);
    setShowPwd2(false);
    setCustomVisible(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Shield size={18} color="#1f2937" />
              <Text style={styles.title}>Aggiungi Squadra</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Squadra</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Es. Titolari, Riserve..."
                autoCapitalize="words"
              />
            </View>

            {/* Descrizione */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrizione (opzionale)</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Breve descrizione della squadra"
                autoCapitalize="sentences"
              />
            </View>

            {/* Colore */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Colore Squadra</Text>
                <View
                  style={[
                    styles.selectedPreview,
                    { backgroundColor: selectedColor },
                  ]}
                />
              </View>

              <View style={styles.colorGrid}>
                {baseColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => {
                      setSelectedColor(color);
                      setCustomVisible(false);
                    }}
                  />
                ))}

                {/* Pallino + */}
                <TouchableOpacity
                  style={styles.colorButtonCustom}
                  onPress={() => setCustomVisible(!customVisible)}
                >
                  <Plus size={20} color="#1f2937" />
                </TouchableOpacity>
              </View>

              {/* 🎨 Palette custom */}
              {customVisible && (
                <View style={styles.customBox}>
                  <Text style={styles.customLabel}>Sfumature disponibili</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                  >
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      {extendedPalette.map((c) => (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.colorButtonSmall,
                            { backgroundColor: c },
                            selectedColor === c && styles.selectedColorSmall,
                          ]}
                          onPress={() => {
                            setSelectedColor(c);
                            setCustomVisible(false);
                          }}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password di accesso (opzionale)</Text>
                <Text style={styles.hint}>min 6 caratteri</Text>
              </View>
              <View style={styles.pwdRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Imposta password squadra"
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd((v) => !v)}>
                  {showPwd ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
              {pwdTooShort && (
                <Text style={styles.errorText}>La password deve avere almeno 6 caratteri.</Text>
              )}
            </View>

            {/* Conferma password */}
            {password.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Conferma password</Text>
                <View style={styles.pwdRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={password2}
                    onChangeText={setPassword2}
                    placeholder="Ripeti password"
                    secureTextEntry={!showPwd2}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd2((v) => !v)}>
                    {showPwd2 ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {pwdMismatch && (
                  <Text style={styles.errorText}>Le password non coincidono.</Text>
                )}
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.disabledButton]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>Crea Squadra</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ========== STILI ========== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16, width: '90%', maxWidth: 400, padding: 20,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },

  form: { gap: 16 },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', color: '#374151' },
  hint: { fontSize: 12, color: '#9ca3af' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#f9fafb',
  },

  selectedPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginLeft: 8,
  },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorButton: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: 'transparent',
  },
  selectedColor: { borderColor: '#1f2937' },

  colorButtonCustom: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  customBox: {
    marginTop: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 10,
  },
  customLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },

  colorButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorSmall: {
    borderColor: '#111827',
  },

  pwdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff',
  },
  errorText: { color: '#ef4444', fontSize: 12 },

  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelButton: {
    flex: 1, paddingVertical: 12, borderRadius: 8,
    borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#6b7280' },

  saveButton: {
    flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#22c55e', alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#9ca3af' },
  saveText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
});