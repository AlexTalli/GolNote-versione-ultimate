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
  Image,
  Alert,
} from 'react-native';
import { X, Eye, EyeOff, Shield, Plus, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

/* ========== INTERFACCE ========== */

// Interfaccia per le props del modal
interface AddTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (teamData: {
    name?: string;
    description?: string;
    season_year?: string;
    category?: string;
    color?: string;
    logo_uri?: string;
    password?: string;
  }) => Promise<void> | void;
  editTeam?: {
    id: number;
    name: string;
    description?: string | null;
    season_year?: string | null;
    category?: string | null;
    color: string;
    logo_uri?: string | null;
  };
}

/* ========== PALETTE COLORI ========== */

/* Palette principale con colori base */
const baseColors = [
  '#000000', 
  '#ef4444', 
  '#eab308', 
  '#3b82f6', 
  '#22c55e', 
];

/* Palette estesa con più sfumature (accessibile dal pulsante +) */
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

const buildSeasonYearOptions = (fromYear: number, toYear: number) => {
  const years: string[] = [];
  for (let y = fromYear; y <= toYear; y += 1) {
    years.push(`${y}/${y + 1}`);
  }
  return years;
};

const seasonYearOptions = buildSeasonYearOptions(2020, new Date().getFullYear() + 6);

const categoryOptions = [
  'Prima squadra',
  'U19 (Juniores)',
  'U17 (Allievi 1° anno)',
  'U16 (Allievi 2° anno)',
  'U15 (Giovanissimi 2° anno)',
  'U14 (Giovanissimi 1° anno)',
  'Amatoriale',
];

/* ========== COMPONENTE ========== */

export function AddTeamModal({ visible, onClose, onSave, editTeam }: AddTeamModalProps) {
  /* ========== STATI ========== */

  // Stati per i campi del form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seasonYear, setSeasonYear] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState(baseColors[4]); // default verde
  const [logoUri, setLogoUri] = useState<string | null>(null);

  // Stati per password opzionale
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  /* Stato per mostrare/nascondere palette colori estesa */
  const [customVisible, setCustomVisible] = useState(false);
  const [openSelect, setOpenSelect] = useState<'season' | 'category' | null>(null);

  // Carica i dati della squadra quando il modal si apre con editTeam
  useEffect(() => {
    if (visible && editTeam) {
      setName(editTeam.name);
      setDescription(editTeam.description ?? '');
      setSeasonYear(editTeam.season_year ?? '');
      setCategory(editTeam.category ?? '');
      setSelectedColor(editTeam.color);
      setLogoUri(editTeam.logo_uri ?? null);
      setPassword('');
      setPassword2('');
    } else if (visible) {
      setName('');
      setDescription('');
      setSeasonYear('');
      setCategory('');
      setSelectedColor(baseColors[4]);
      setLogoUri(null);
      setPassword('');
      setPassword2('');
    }
  }, [visible, editTeam]);

  /* ========== VALIDAZIONI ========== */

  // Validazioni password
  const pwdTooShort = password.length > 0 && password.length < 6;
  const pwdMismatch = password.length > 0 && password !== password2;

  // Controllo se il form è valido per salvare
  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (!seasonYear.trim()) return false;
    if (!category.trim()) return false;
    if (pwdTooShort || pwdMismatch) return false;
    return true;
  }, [name, seasonYear, category, pwdTooShort, pwdMismatch]);

  /* ========== GESTORI EVENTI ========== */

  // Gestisce il salvataggio della squadra
  const handleSave = () => {
    if (!canSave) return;

    // Prepara i dati da salvare
    const payload: {
      name: string;
      description: string;
      season_year: string;
      category: string;
      color: string;
      logo_uri?: string;
      password?: string;
    } = {
      name: name.trim(),
      description: description.trim(),
      season_year: seasonYear.trim(),
      category: category.trim(),
      color: selectedColor,
    };

    if (logoUri) payload.logo_uri = logoUri;

    if (password.trim()) payload.password = password.trim();

    onSave(payload);
    resetForm();
  };

  // Resetta tutti i campi del form ai valori iniziali
  const resetForm = () => {
    setName('');
    setDescription('');
    setSeasonYear('');
    setCategory('');
    setSelectedColor(baseColors[4]);
    setLogoUri(null);
    setPassword('');
    setPassword2('');
    setShowPwd(false);
    setShowPwd2(false);
    setCustomVisible(false);
    setOpenSelect(null);
  };

  const handlePickLogo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permesso richiesto',
          'Per scegliere il logo devi consentire l’accesso alle foto.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selected = result.assets?.[0];
        if (selected?.uri) {
          setLogoUri(selected.uri);
        }
      }
    } catch (error) {
      console.error('Errore selezione logo:', error);
      Alert.alert('Errore', 'Impossibile selezionare il logo dalla galleria foto.');
    }
  };

  // Gestisce la chiusura del modal (resetta form prima di chiudere)
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /* ========== RENDERING ========== */

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header con titolo e bottone chiusura */}
            <View style={styles.header}>
              <View style={styles.titleWrap}>
                <Shield size={18} color="#1f2937" />
                <Text style={styles.title}>{editTeam ? 'Modifica Squadra' : 'Aggiungi Squadra'}</Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Form con tutti i campi */}
            <View style={styles.form}>
            {/* Campo nome squadra */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Società</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Es. ASD GolNote"
                autoCapitalize="words"
              />
            </View>

            {/* Campo descrizione opzionale */}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Anno calcistico</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setOpenSelect((v) => (v === 'season' ? null : 'season'))}
                activeOpacity={0.8}
              >
                <View style={styles.selectRow}>
                  <Text style={seasonYear ? styles.selectValue : styles.selectPlaceholder}>
                    {seasonYear || 'Seleziona anno calcistico'}
                  </Text>
                  <ChevronDown
                    size={18}
                    color="#6b7280"
                    style={openSelect === 'season' ? styles.chevronOpen : undefined}
                  />
                </View>
              </TouchableOpacity>

              {openSelect === 'season' && (
                <View style={styles.optionsContainer}>
                  <ScrollView style={styles.optionsScroll} nestedScrollEnabled>
                    {seasonYearOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionItem}
                        onPress={() => {
                          setSeasonYear(option);
                          setOpenSelect(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            seasonYear === option && styles.optionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setOpenSelect((v) => (v === 'category' ? null : 'category'))}
                activeOpacity={0.8}
              >
                <View style={styles.selectRow}>
                  <Text style={category ? styles.selectValue : styles.selectPlaceholder}>
                    {category || 'Seleziona categoria'}
                  </Text>
                  <ChevronDown
                    size={18}
                    color="#6b7280"
                    style={openSelect === 'category' ? styles.chevronOpen : undefined}
                  />
                </View>
              </TouchableOpacity>

              {openSelect === 'category' && (
                <View style={styles.optionsContainer}>
                  {categoryOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionItem}
                      onPress={() => {
                        setCategory(option);
                        setOpenSelect(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          category === option && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Sezione Logo e Colore (mutualmente esclusivi) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Logo Squadra (opzionale)</Text>

              <View style={styles.logoRow}>
                <View style={styles.logoPreviewWrap}>
                  {logoUri ? (
                    <Image source={{ uri: logoUri }} style={styles.logoPreviewLarge} />
                  ) : (
                    <View style={styles.logoPreviewPlaceholder} />
                  )}
                </View>

                <View style={styles.logoActions}>
                  <TouchableOpacity style={styles.logoBtn} onPress={handlePickLogo}>
                    <Text style={styles.logoBtnText}>Scegli da galleria</Text>
                  </TouchableOpacity>

                  {logoUri && (
                    <TouchableOpacity
                      style={[styles.logoBtn, styles.logoBtnDanger]}
                      onPress={() => setLogoUri(null)}
                    >
                      <Text style={[styles.logoBtnText, styles.logoBtnDangerText]}>Rimuovi logo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {!logoUri && (
                <>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Colore Squadra</Text>
                    <View
                      style={[
                        styles.selectedPreview,
                        { backgroundColor: selectedColor },
                      ]}
                    />
                  </View>

                  {/* Griglia colori base */}
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

                    {/* Bottone per espandere palette estesa */}
                    <TouchableOpacity
                      style={styles.colorButtonCustom}
                      onPress={() => setCustomVisible(!customVisible)}
                    >
                      <Plus size={20} color="#1f2937" />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Palette colori estesa (se visibile) */}
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

            {/* Campo password opzionale */}
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
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd((v) => !v)}>
                  {showPwd ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
              {pwdTooShort && (
                <Text style={styles.errorText}>La password deve avere almeno 6 caratteri.</Text>
              )}
            </View>

            {/* Campo conferma password (solo se password inserita) */}
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
                    autoCorrect={false}
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

            {/* Bottoni azioni: annulla e salva */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !canSave && styles.disabledButton]}
                onPress={handleSave}
                disabled={!canSave}
              >
                <Text style={styles.saveText}>{editTeam ? 'Salva' : 'Crea Squadra'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ========== STILI ========== */

// Stili per overlay, modal e header
const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  modalScroll: {
    width: '100%',
  },
  modalScrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },

  // Stili per il form
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', color: '#374151' },
  hint: { fontSize: 12, color: '#9ca3af' },
  input: {
    borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#f9fafb',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  selectValue: {
    fontSize: 16,
    color: '#111827',
  },
  optionsContainer: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  optionsScroll: {
    maxHeight: 180,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#111827',
    fontWeight: '700',
  },

  // Anteprima colore selezionato
  selectedPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginLeft: 8,
  },

  // Griglia colori base
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorButton: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: 'transparent',
  },
  selectedColor: { borderColor: '#1f2937' },

  // Bottone per palette estesa
  colorButtonCustom: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  // Contenitore palette estesa
  customBox: {
    marginTop: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 10,
  },
  customLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoPreviewWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  logoPreviewLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  logoPreviewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  logoActions: {
    flex: 1,
    gap: 8,
  },
  logoBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  logoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  logoBtnDanger: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  logoBtnDangerText: {
    color: '#b91c1c',
  },

  // Bottoni colori piccoli nella palette estesa
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

  // Riga password con bottone mostra/nascondi
  pwdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff',
  },
  errorText: { color: '#ef4444', fontSize: 12 },

  // Bottoni azioni (annulla/salva)
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