import {
  scheduleWeeklyFinesReminder,
  disableWeeklyFinesReminder,
  isWeeklyFinesReminderEnabled,
  scheduleFineDueNotificationDemo,
} from '@/utils/notifications';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Switch,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Bell, Trash2, Info, LogOut, Edit } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

// DB helpers
import {
  clearAllDataForMister,
  deleteMisterAccount,
  usersDB,
} from '@/database/database.supabase';

// hook per caricare le squadre del mister
import { useTeams } from '@/hooks/useDatabase';

/* ========== COMPONENTE ========== */

export default function MisterSettings() {
  /* ========== HOOKS E STATI ========== */

  const { logout, user, setUser } = useAuth();
  const { setRole, setPlayerIdentity } = useRole();

  // Stati per le operazioni asincrone
  const [enablingWeekly, setEnablingWeekly] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [newDisplayNickname, setNewDisplayNickname] = useState('');
  const [savingNickname, setSavingNickname] = useState(false);

  // Stati per le notifiche settimanali
  const [weeklyEnabled, setWeeklyEnabled] = useState(false);
  const [loadingWeeklyState, setLoadingWeeklyState] = useState(true);

  /* ========== EFFETTI ========== */

  // Carica lo stato iniziale del promemoria settimanale
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const enabled = await isWeeklyFinesReminderEnabled();
        if (mounted) setWeeklyEnabled(enabled);
      } finally {
        if (mounted) setLoadingWeeklyState(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ========== GESTORI EVENTI ========== */

  // Gestisce il toggle del promemoria settimanale
  const handleToggleWeeklyReminder = useCallback(async (next: boolean) => {
    // ottimistico: muove subito il toggle, ma se fallisce torna indietro
    setWeeklyEnabled(next);

    try {
      setEnablingWeekly(true);

      if (next) {
        const ok = await scheduleWeeklyFinesReminder();
        if (!ok) {
          setWeeklyEnabled(false);
          Alert.alert(
            'Notifiche disattivate',
            'Per ricevere il promemoria settimanale devi abilitare le notifiche nelle impostazioni del dispositivo.'
          );
          return;
        }
      } else {
        await disableWeeklyFinesReminder();
      }
    } catch (e) {
      console.error('Errore toggle promemoria settimanale:', e);
      setWeeklyEnabled(!next);
      Alert.alert('Errore', 'Non è stato possibile aggiornare il promemoria.');
    } finally {
      setEnablingWeekly(false);
    }
  }, []);

  // Hook per caricare le squadre del mister
  const { teams, refreshTeams } = useTeams({
    enabled: user?.role === 'mister' && !!user?.id,
  });
  const hasTeams = useMemo(() => (teams ?? []).length > 0, [teams]);

  // Pull-to-refresh per aggiornare le squadre
  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      await refreshTeams();
    } catch (e) {
      console.log('Errore nel refresh teams da settings:', e);
    } finally {
      setRefreshing(false);
    }
  }, [refreshTeams, user?.id]);

  /* ============= CLEAR DATA (dati) ============= */
  const handleClearData = () => {
    if (!user?.id) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }

    Alert.alert(
      'Conferma cancellazione',
      'Questa azione eliminerà TUTTE le tue squadre, i giocatori e le multe. L’operazione è irreversibile. Vuoi continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Sì, cancella tutto',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);
              await clearAllDataForMister(user.id);
              await refreshTeams();
              Alert.alert('Completato', 'Tutti i dati sono stati cancellati.');
            } catch (e) {
              console.error('Errore cancellazione dati:', e);
              Alert.alert(
                'Errore',
                'Non è stato possibile cancellare tutti i dati. Riprova.'
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  /* ============= DELETE ACCOUNT (dati + utente) ============= */
  const handleDeleteAccount = () => {
    if (!user?.id) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }

    Alert.alert(
      'Elimina account',
      'Questa azione eliminerà il tuo account MISTER e TUTTI i dati associati. Non potrai più recuperare nulla.\n\nVuoi davvero continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Sì, elimina account',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingAccount(true);

              const ok = await deleteMisterAccount(user.id);
              if (!ok) {
                throw new Error('Delete account failed');
              }
              setUser(null);
              setRole(null);
              setPlayerIdentity({ playerId: null });
              router.dismissAll();
              router.replace('/');
            } catch (e) {
              console.error('Errore eliminazione account:', e);
              Alert.alert(
                'Errore',
                'Non è stato possibile eliminare l’account. Riprova.'
              );
            } finally {
              setDeletingAccount(false);
            }
          },
        },
      ]
    );
  };

  /* ============= CAMBIA RUOLO ============= */
  const handleChangeRole = async () => {
    setUser(null);
    setRole(null);
    setPlayerIdentity({ playerId: null });
    router.dismissAll();
    router.replace('/');
  };

  const openNicknameModal = useCallback(() => {
    const current = user?.displayNickname || user?.nickname || '';
    setNewDisplayNickname(current);
    setNicknameModalVisible(true);
  }, [user?.displayNickname, user?.nickname]);

  const handleSaveDisplayNickname = useCallback(async () => {
    if (!user?.id) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }

    const next = newDisplayNickname.trim();
    if (!next) {
      Alert.alert('Errore', 'Il nickname visualizzato non può essere vuoto.');
      return;
    }

    try {
      setSavingNickname(true);
      const ok = await usersDB.updateDisplayNickname(user.id, next);
      if (!ok) {
        Alert.alert('Errore', 'Impossibile aggiornare il nickname.');
        return;
      }

      await setUser({
        ...user,
        displayNickname: next,
      });

      setNicknameModalVisible(false);
      Alert.alert('Completato', 'Nickname aggiornato con successo.');
    } catch (e) {
      console.error('Errore aggiornamento nickname visualizzato:', e);
      Alert.alert('Errore', 'Non è stato possibile aggiornare il nickname.');
    } finally {
      setSavingNickname(false);
    }
  }, [newDisplayNickname, setUser, user]);

  /* ========== RENDERING ========== */

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ============= NOTIFICHE ============= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifiche</Text>

          <View style={styles.option}>
            <Bell size={20} color="#3b82f6" />

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                Promemoria multe settimanale
              </Text>
              <Text style={styles.optionDescription}>
                Ricevi un promemoria ogni lunedì alle 09:00 per controllare eventuali multe.
              </Text>
            </View>

            {loadingWeeklyState ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Switch
                value={weeklyEnabled}
                onValueChange={handleToggleWeeklyReminder}
                disabled={enablingWeekly}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={weeklyEnabled ? '#3b82f6' : '#9ca3af'}
              />
            )}
          </View>

          {/* Test notifica (solo in dev) - COMMENTATO PER DISABILITARE */}
          {/* {__DEV__ && (
            <TouchableOpacity
              style={styles.option}
              onPress={scheduleFineDueNotificationDemo}
            >
              <Bell size={20} color="#f08215ff" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Test notifica (10s)</Text>
                <Text style={styles.optionDescription}>
                  Invia una notifica di prova dopo circa 10 secondi.
                </Text>
              </View>
            </TouchableOpacity>
          )} */}
        </View>

        {/* ============= DATI APPLICAZIONE ============= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dati Applicazione</Text>
          <TouchableOpacity
            style={[styles.option, styles.dangerOption]}
            onPress={handleClearData}
            disabled={clearing}
          >
            <Trash2 size={20} color="#ef4444" />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, styles.dangerText]}>
                {clearing ? 'Cancellazione in corso…' : 'Cancella Tutti i Dati'}
              </Text>
              <Text style={styles.optionDescription}>
                Rimuovi tutte le squadre, i giocatori e le multe (azione
                irreversibile)
              </Text>
            </View>
            {clearing && <ActivityIndicator size="small" color="#ef4444" />}
          </TouchableOpacity>
        </View>

        {/* ============= ACCOUNT ============= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={openNicknameModal}
            disabled={savingNickname}
          >
            <Edit size={20} color="#daa520" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Modifica Nickname</Text>
              <Text style={styles.optionDescription}>
                Attuale: {user?.displayNickname ?? user?.nickname ?? 'Mister'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleChangeRole}>
            <LogOut size={20} color="#6b7280" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Torna alla Home</Text>
              <Text style={styles.optionDescription}>
                Torna alla schermata Home di selezione ruolo
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionWrapped, styles.dangerOption]}
            onPress={handleDeleteAccount}
            disabled={deletingAccount}
          >
            <Trash2 size={20} color="#ef4444" />
            <View style={styles.optionContentWrapped}>
              <Text style={[styles.optionTitle, styles.dangerText]}>
                {deletingAccount ? 'Eliminazione account…' : 'Elimina Account'}
              </Text>
              <Text style={styles.optionDescription}>
                Cancella definitivamente l'account Mister
              </Text>
            </View>
            {deletingAccount && (
              <ActivityIndicator size="small" color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        {/* ============= INFO ============= */}
        <View style={[styles.section, { marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>Informazioni</Text>
          <TouchableOpacity style={styles.option}>
            <Info size={20} color="#6b7280" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>GolNote – Cosa posso fare?</Text>
              <Text style={styles.optionDescription}>
                • Crea e gestisci le tue squadre{"\n"}
                • Aggiungi i giocatori e assegna le multe{"\n"}
                • Tieni traccia delle multe assegnate (pagata / non pagata){"\n"}
                • Aggiorna il calendario delle presenze agli allenamenti{"\n"}
                • Esporta in Excel per condividere il calendario o il resoconto delle multe{"\n"}
                • Attiva promemoria settimanali{"\n"}
                • Notifiche sulle scadenze multe (il giorno prima della scadenza) {"\n"}
                • Chatta con i tuoi giocatori
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={nicknameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNicknameModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Modifica nickname</Text>
            <Text style={styles.modalSubtitle}>
              Questo cambia solo il nome visualizzato di benvenuto. Le credenziali di accesso restano uguali.
            </Text>

            <TextInput
              style={styles.nicknameInput}
              value={newDisplayNickname}
              onChangeText={setNewDisplayNickname}
              placeholder="Inserisci nuovo nickname"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              editable={!savingNickname}
            />

            <View style={styles.modalActionsBetween}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setNicknameModalVisible(false)}
                disabled={savingNickname}
              >
                <Text style={styles.modalCancelText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSave, savingNickname && styles.modalSaveDisabled]}
                onPress={handleSaveDisplayNickname}
                disabled={savingNickname}
              >
                {savingNickname ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>Salva</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </>
  );
}

/* ========== STILI ========== */

const styles = StyleSheet.create({
  // Contenitore principale con sfondo chiaro
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Sezione con sfondo bianco, bordi arrotondati e ombra
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Titolo della sezione
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    padding: 16,
    paddingBottom: 8,
  },

  // Opzione cliccabile con icona e contenuto
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  // Contenuto dell'opzione (titolo e descrizione)
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },

  optionContentWrapped: {
    marginLeft: 12,
    flex: 1,
    flexWrap: 'wrap',
  },

  optionWrapped: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },

  // Titolo dell'opzione
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },

  // Descrizione dell'opzione
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Stile per opzioni pericolose (sfondo rosso chiaro)
  dangerOption: {
    backgroundColor: '#fef2f2',
  },

  dangerOptionStrong: {
    borderTopColor: '#fecaca',
    borderTopWidth: 1,
  },

  // Testo per opzioni pericolose (rosso)
  dangerText: {
    color: '#ef4444',
  },

  dangerTextStrong: {
    color: '#b91c1c',
    fontWeight: '700',
  },

  dangerDescription: {
    color: '#991b1b',
  },

  // Overlay scuro per il modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Contenitore del modal
  modal: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },

  // Titolo del modal
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  // Sottotitolo del modal
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  exportSortWrap: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  exportSortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  exportSortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exportSortBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  exportSortBtnActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  exportSortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  exportSortBtnTextActive: {
    color: '#1d4ed8',
  },

  // Opzione squadra nel modal
  teamOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  teamOptionAll: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  teamOptionLeft: {
    marginRight: 10,
  },
  teamOptionLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  teamOptionLogoFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  teamOptionContent: {
    flex: 1,
  },
  teamOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  teamOptionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
  },

  // Azioni del modal (pulsante annulla)
  modalActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  modalActionsBetween: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Pulsante annulla del modal
  modalCancel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },

  // Testo del pulsante annulla
  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  nicknameInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },

  modalSave: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    minWidth: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalSaveDisabled: {
    opacity: 0.7,
  },

  modalSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});