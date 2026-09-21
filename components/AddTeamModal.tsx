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
  ActivityIndicator,
} from 'react-native';
import { X, Eye, EyeOff, Shield, Plus, ChevronDown } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { uploadTeamLogo } from '@/database/database.supabase';
import { SPORTS, SPORT_LABELS, normalizeSport, type SportName } from '@/utils/sports';

/* ========== INTERFACCE ========== */

// Interfaccia per le props del modal
interface AddTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (teamData: {
    name?: string;
    description?: string;
    sport?: SportName;
    season_year?: string;
    category?: string;
    color?: string;
    logo_uri?: string;
    password?: string;
    mister_password?: string;
  }) => Promise<void> | void;
  editTeam?: {
    id: number;
    name: string;
    description?: string | null;
    sport?: string | null;
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

/* ========== COMPONENTE ========== */

export function AddTeamModal({ visible, onClose, onSave, editTeam }: AddTeamModalProps) {
  /* ========== STATI ========== */

  // Stati per i campi del form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState<SportName>('calcio');
  const [seasonYear, setSeasonYear] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState(baseColors[4]); // default verde
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Password per giocatori
  const [playerPassword, setPlayerPassword] = useState('');
  const [playerPassword2, setPlayerPassword2] = useState('');
  const [showPlayerPwd, setShowPlayerPwd] = useState(false);
  const [showPlayerPwd2, setShowPlayerPwd2] = useState(false);

  // Password per mister delegati
  const [misterPassword, setMisterPassword] = useState('');
  const [misterPassword2, setMisterPassword2] = useState('');
  const [showMisterPwd, setShowMisterPwd] = useState(false);
  const [showMisterPwd2, setShowMisterPwd2] = useState(false);

  /* Stato per mostrare/nascondere palette colori estesa */
  const [customVisible, setCustomVisible] = useState(false);
  const [openSelect, setOpenSelect] = useState<'sport' | 'season' | null>(null);

  // Carica i dati della squadra quando il modal si apre con editTeam
  useEffect(() => {
    if (visible && editTeam) {
      setName(editTeam.name);
      setDescription(editTeam.description ?? '');
      setSport(normalizeSport(editTeam.sport));
      setSeasonYear(editTeam.season_year ?? '');
      setCategory(editTeam.category ?? '');
      setSelectedColor(editTeam.color);
      setLogoUri(null);
      setLogoUrl(editTeam.logo_uri ?? null);
      setPlayerPassword('');
      setPlayerPassword2('');
      setMisterPassword('');
      setMisterPassword2('');
      setUploading(false);
    } else if (visible) {
      setName('');
      setDescription('');
      setSport('calcio');
      setSeasonYear('');
      setCategory('');
      setSelectedColor(baseColors[4]);
      setLogoUri(null);
      setLogoUrl(null);
      setPlayerPassword('');
      setPlayerPassword2('');
      setMisterPassword('');
      setMisterPassword2('');
      setUploading(false);
    }
  }, [visible, editTeam]);

  /* ========== VALIDAZIONI ========== */

  // Validazioni password giocatori
  const playerPwdTooShort = playerPassword.length > 0 && playerPassword.length < 6;
  const playerPwdMismatch = playerPassword.length > 0 && playerPassword !== playerPassword2;

  // Validazioni password mister
  const misterPwdTooShort = misterPassword.length > 0 && misterPassword.length < 6;
  const misterPwdMismatch = misterPassword.length > 0 && misterPassword !== misterPassword2;

  // Controllo se il form è valido per salvare
  const canSave = useMemo(() => {
    if (!name.trim()) return false;
    if (!sport.trim()) return false;
    if (!seasonYear.trim()) return false;
    if (!category.trim()) return false;
    if (uploading) return false;
    if (logoUri && !logoUrl) return false;
    if (playerPwdTooShort || playerPwdMismatch) return false;
    if (misterPwdTooShort || misterPwdMismatch) return false;
    return true;
  }, [name, sport, seasonYear, category, uploading, logoUri, logoUrl, playerPwdTooShort, playerPwdMismatch, misterPwdTooShort, misterPwdMismatch]);

  /* ========== GESTORI EVENTI ========== */

  // Gestisce il salvataggio della squadra
  const handleSave = () => {
    if (!canSave) return;

    // Prepara i dati da salvare
    const payload: {
      name: string;
      description: string;
      sport: SportName;
      season_year: string;
      category: string;
      color: string;
      logo_uri?: string;
      password?: string;
      mister_password?: string;
    } = {
      name: name.trim(),
      description: description.trim(),
      sport,
      season_year: seasonYear.trim(),
      category: category.trim(),
      color: selectedColor,
    };

    // Use uploaded URL instead of local path
    if (logoUrl) payload.logo_uri = logoUrl;

    // Password per giocatori
    if (playerPassword.trim()) payload.password = playerPassword.trim();

    // Password per mister delegati
    if (misterPassword.trim()) payload.mister_password = misterPassword.trim();

    onSave(payload);
    resetForm();
  };

  // Resetta tutti i campi del form ai valori iniziali
  const resetForm = () => {
    setName('');
    setDescription('');
    setSport('calcio');
    setSeasonYear('');
    setCategory('');
    setSelectedColor(baseColors[4]);
    setLogoUri(null);
    setLogoUrl(null);
    setPlayerPassword('');
    setPlayerPassword2('');
    setShowPlayerPwd(false);
    setShowPlayerPwd2(false);
    setMisterPassword('');
    setMisterPassword2('');
    setShowMisterPwd(false);
    setShowMisterPwd2(false);
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
          setLogoUrl(null);
          setLogoUri(selected.uri);
          const normalized = await manipulateAsync(
            selected.uri,
            [{ resize: { width: 1080 } }],
            {
              compress: 0.8,
              format: SaveFormat.JPEG,
            }
          );

          // Upload immediately using normalized JPEG
          await uploadLogo(normalized.uri, 'image/jpeg');
        }
      }
    } catch (error) {
      console.error('Errore selezione logo:', error);
      Alert.alert('Errore', 'Impossibile selezionare il logo dalla galleria foto.');
    }
  };

  const uploadLogo = async (fileUri: string, contentType = 'image/jpeg') => {
    try {
      setUploading(true);
      // Generate a unique filename
      const timestamp = Date.now();
      const fileExtension = contentType.includes('png') ? 'png' : 'jpg';
      const fileName = `logo-${timestamp}.${fileExtension}`;
      
      // Use a temporary teamId (0) for new teams, actual teamId for edits
      const tempTeamId = editTeam?.id || 0;
      
      const publicUrl = await uploadTeamLogo(tempTeamId, fileUri, fileName, contentType);
      
      if (publicUrl) {
        setLogoUrl(publicUrl);
        Alert.alert('Successo', 'Logo caricato correttamente');
      } else {
        Alert.alert('Errore', 'Errore nel caricamento del logo');
      }
    } catch (error) {
      console.error('Errore upload logo:', error);
      Alert.alert('Errore', 'Errore nel caricamento del logo');
    } finally {
      setUploading(false);
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
                placeholder="Es. ASD SportNote"
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
              <Text style={styles.label}>Sport</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setOpenSelect((v) => (v === 'sport' ? null : 'sport'))}
                activeOpacity={0.8}
              >
                <View style={styles.selectRow}>
                  <Text style={styles.selectValue}>{SPORT_LABELS[sport]}</Text>
                  <ChevronDown
                    size={18}
                    color="#6b7280"
                    style={openSelect === 'sport' ? styles.chevronOpen : undefined}
                  />
                </View>
              </TouchableOpacity>

              {openSelect === 'sport' && (
                <View style={styles.optionsContainer}>
                  {SPORTS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.optionItem}
                      onPress={() => {
                        setSport(option);
                        setOpenSelect(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          sport === option && styles.optionTextSelected,
                        ]}
                      >
                        {SPORT_LABELS[option]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Anno Sportivo</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setOpenSelect((v) => (v === 'season' ? null : 'season'))}
                activeOpacity={0.8}
              >
                <View style={styles.selectRow}>
                  <Text style={seasonYear ? styles.selectValue : styles.selectPlaceholder}>
                    {seasonYear || 'Seleziona anno sportivo'}
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
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Es. Prima squadra, U16, Amatoriale"
                autoCapitalize="words"
              />
            </View>

            {/* Sezione Logo e Colore (mutualmente esclusivi) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Logo Squadra (opzionale)</Text>

              <View style={styles.logoRow}>
                <View style={styles.logoPreviewWrap}>
                  {(logoUri || logoUrl) ? (
                    <Image source={{ uri: (logoUri || logoUrl) as string }} style={styles.logoPreviewLarge} />
                  ) : (
                    <View style={styles.logoPreviewPlaceholder} />
                  )}
                  {uploading && (
                    <View style={[styles.logoPreviewLarge, { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }]}>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text style={{ color: '#ffffff', marginTop: 8 }}>Caricamento...</Text>
                    </View>
                  )}
                </View>

                <View style={styles.logoActions}>
                  <TouchableOpacity 
                    style={[styles.logoBtn, uploading && { opacity: 0.5 }]} 
                    onPress={handlePickLogo}
                    disabled={uploading}
                  >
                    <Text style={styles.logoBtnText}>
                      {uploading ? 'Caricamento...' : 'Scegli da galleria'}
                    </Text>
                  </TouchableOpacity>

                  {(logoUri || logoUrl) && !uploading && (
                    <TouchableOpacity
                      style={[styles.logoBtn, styles.logoBtnDanger]}
                      onPress={() => {
                        setLogoUri(null);
                        setLogoUrl(null);
                      }}
                    >
                      <Text style={[styles.logoBtnText, styles.logoBtnDangerText]}>Rimuovi logo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {!logoUri && !logoUrl && (
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

            {/* Campo password per giocatori (opzionale) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password Squadra (opzionale)</Text>
              </View>
              <View style={styles.pwdRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={playerPassword}
                  onChangeText={setPlayerPassword}
                  placeholder="Password per accesso giocatori"
                  secureTextEntry={!showPlayerPwd}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPlayerPwd((v) => !v)}>
                  {showPlayerPwd ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
              {playerPwdTooShort && (
                <Text style={styles.errorText}>La password deve avere almeno 6 caratteri.</Text>
              )}
            </View>

            {/* Conferma password giocatori */}
            {playerPassword.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Conferma password squadra</Text>
                <View style={styles.pwdRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={playerPassword2}
                    onChangeText={setPlayerPassword2}
                    placeholder="Ripeti password"
                    secureTextEntry={!showPlayerPwd2}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPlayerPwd2((v) => !v)}>
                    {showPlayerPwd2 ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {playerPwdMismatch && (
                  <Text style={styles.errorText}>Le password non coincidono.</Text>
                )}
              </View>
            )}

            {/* Campo password per mister delegati (opzionale) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password Mister (opzionale)</Text>
                
              </View>
              <View style={styles.pwdRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={misterPassword}
                  onChangeText={setMisterPassword}
                  placeholder="Password per mister delegati"
                  secureTextEntry={!showMisterPwd}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowMisterPwd((v) => !v)}>
                  {showMisterPwd ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              </View>
              {misterPwdTooShort && (
                <Text style={styles.errorText}>La password deve avere almeno 6 caratteri.</Text>
              )}
            </View>

            {/* Conferma password mister */}
            {misterPassword.length > 0 && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Conferma password delega</Text>
                <View style={styles.pwdRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={misterPassword2}
                    onChangeText={setMisterPassword2}
                    placeholder="Ripeti password"
                    secureTextEntry={!showMisterPwd2}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowMisterPwd2((v) => !v)}>
                    {showMisterPwd2 ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {misterPwdMismatch && (
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