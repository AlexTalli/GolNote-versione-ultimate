// app/(mister)/(tabs)/settings.tsx
import { scheduleWeeklyFinesReminder } from '@/utils/notifications';
import { scheduleFineDueNotificationDemo } from '@/utils/notifications';
import React, { useState, useMemo, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView as RNScrollView,
  RefreshControl,
} from 'react-native';
import { Download, Bell, Trash2, Info, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

// DB helpers
import {
  buildCsvForMister,
  clearAllDataForMister,
  deleteMisterAccount,
} from '@/database/database';

// hook per caricare le squadre del mister
import { useTeams } from '@/hooks/useDatabase';

// filesystem legacy + sharing
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function MisterSettings() {
  const { logout, user } = useAuth();
  const { setRole, setPlayerIdentity } = useRole();
  const [enablingWeekly, setEnablingWeekly] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [exportPickerVisible, setExportPickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleEnableWeeklyReminder = async () => {
  try {
    setEnablingWeekly(true);

    const ok = await scheduleWeeklyFinesReminder();
    if (!ok) {
      Alert.alert(
        'Notifiche disattivate',
        'Per ricevere il promemoria settimanale devi abilitare le notifiche nelle impostazioni del dispositivo.'
      );
      return;
    }

    Alert.alert(
      'Promemoria attivato',
      'Ogni lunedì riceverai un promemoria delle multe che ancora devono essere saldate.'
    );
  } catch (e) {
    console.error('Errore attivazione promemoria settimanale:', e);
    Alert.alert('Errore', 'Non è stato possibile attivare il promemoria.');
  } finally {
    setEnablingWeekly(false);
  }
};

  // carico le squadre del mister per il picker
  const { teams, refreshTeams } = useTeams({
    enabled: user?.role === 'mister' && !!user?.id,
  });
  const hasTeams = useMemo(() => (teams ?? []).length > 0, [teams]);

  // pull-to-refresh alla "Teams"
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

  /* ============= EXPORT CSV (apre il picker) ============= */
  const handleExportData = () => {
    if (!user?.id) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }
    if (!hasTeams) {
      Alert.alert(
        'Nessuna squadra',
        'Crea almeno una squadra prima di esportare le multe.'
      );
      return;
    }
    setExportPickerVisible(true);
  };

  /* ============= ESECUZIONE EXPORT (dopo scelta squadra) ============= */
  const doExport = async (teamId?: number, teamName?: string) => {
    if (!user?.id || !user?.nickname) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }

    console.log('➡️ doExport CALLED', { teamId, teamName });

    setExportPickerVisible(false);
    setExporting(true);

    try {
      // 1) Genera CSV dal DB (tutte o una squadra sola)
      const csv = await buildCsvForMister(user.id, teamId);
      console.log('📄 CSV generated, length:', csv.length);

      // 2) Nome file: Mister-Nickname-gg-mm-aaaa_hh-mm_[Team].csv
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const datePart = `${pad(now.getDate())}-${pad(
        now.getMonth() + 1
      )}-${now.getFullYear()}`;
      const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
      const safeNick = user.nickname.replace(/[^a-zA-Z0-9_-]+/g, '_');

      const teamSuffix = teamId
        ? `_${(teamName ?? 'Squadra')
            .replace(/[^a-zA-Z0-9_-]+/g, '_')
            .substring(0, 20)}`
        : '_TutteLeSquadre';

      const fileName = `Mister-${safeNick}-${datePart}_${timePart}${teamSuffix}.csv`;

      const baseDir =
        FileSystem.cacheDirectory ?? FileSystem.documentDirectory ?? '';
      const fileUri = baseDir + fileName;

      console.log('📝 Writing file at:', fileUri);

      // 3) Scrive il file
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log('✅ File scritto, controllo Sharing…');

      // 4) Condivisione
      const canShare = await Sharing.isAvailableAsync();
      console.log('📤 Sharing available?', canShare);

      if (!canShare) {
        Alert.alert(
          'CSV pronto',
          `Il file è stato creato ma la condivisione non è disponibile.\n\nPercorso:\n${fileUri}`
        );
        return;
      }

      // 👉 facciamo partire shareAsync da un nuovo tap (bottone dell'alert)
      Alert.alert('CSV pronto', 'Vuoi condividere il file CSV adesso?', [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Condividi',
          onPress: async () => {
            try {
              console.log('🚀 Avvio shareAsync da Alert…');
              await Sharing.shareAsync(fileUri, {
                mimeType: 'text/csv',
                dialogTitle: 'Esporta multe in CSV',
              });
              console.log('📨 Share sheet aperto (da Alert)');
            } catch (err) {
              console.error('❌ Errore in shareAsync:', err);
              Alert.alert(
                'Errore',
                'Si è verificato un errore durante la condivisione del file.'
              );
            }
          },
        },
      ]);
    } catch (e) {
      console.error('❌ Errore export CSV:', e);
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante l’esportazione del CSV.'
      );
    } finally {
      setExporting(false);
    }
  };

  /* ============= CLEAR DATA (solo dati) ============= */
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
      'Questa azione eliminerà il tuo account MISTER e TUTTE le tue squadre, giocatori e multe. Non potrai più recuperare nulla.\n\nVuoi davvero continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Sì, elimina account',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingAccount(true);

              await deleteMisterAccount(user.id);

              try {
                await logout?.();
              } catch (e) {
                console.log('Errore in logout dopo delete account:', e);
              }
              setRole(null);
              setPlayerIdentity({ playerId: null });

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
    try {
      await logout?.();
    } catch (e) {
      console.log('Errore in logout:', e);
    }

    setRole(null);
    setPlayerIdentity({ playerId: null });
    router.replace('/');
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Esportazione */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esportazione Dati</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={handleExportData}
            disabled={exporting || !hasTeams}
          >
            <Download size={20} color="#22c55e" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                {exporting ? 'Esportazione in corso…' : 'Esporta in CSV'}
              </Text>
              <Text style={styles.optionDescription}>
                {hasTeams
                  ? 'Scegli una squadra (o tutte) e scarica le multe in CSV'
                  : 'Crea almeno una squadra per poter esportare i dati'}
              </Text>
            </View>
            {exporting && <ActivityIndicator size="small" color="#22c55e" />}
          </TouchableOpacity>
        </View>

{/* Notifiche */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifiche</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={handleEnableWeeklyReminder}
            disabled={enablingWeekly}
          >
            <Bell size={20} color="#3b82f6" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                {enablingWeekly ? 'Attivazione promemoria…' : 'Promemoria Multe Settimanale'}
              </Text>
              <Text style={styles.optionDescription}>
                Ricevi ogni lunedì un promemoria delle multe che ancora devono essere saldate.
              </Text>
            </View>
            {enablingWeekly && <ActivityIndicator size="small" color="#3b82f6" />}
          </TouchableOpacity>

          {/* Solo in sviluppo: bottone test notifica a 10s */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.option}
              onPress={scheduleFineDueNotificationDemo}
            >
              <Bell size={20} color="#22c55e" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Test notifica (10s)</Text>
                <Text style={styles.optionDescription}>
                  Invia una notifica di prova dopo circa 10 secondi.
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Dati applicazione */}
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

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.option} onPress={handleChangeRole}>
            <LogOut size={20} color="#6b7280" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Cambia Ruolo</Text>
              <Text style={styles.optionDescription}>
                Torna alla schermata di selezione ruolo
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.dangerOption]}
            onPress={handleDeleteAccount}
            disabled={deletingAccount}
          >
            <Trash2 size={20} color="#ef4444" />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, styles.dangerText]}>
                {deletingAccount
                  ? 'Eliminazione account…'
                  : 'Elimina Account'}
              </Text>
              <Text style={styles.optionDescription}>
                Cancella definitivamente l’account Mister e tutti i dati
                associati
              </Text>
            </View>
            {deletingAccount && (
              <ActivityIndicator size="small" color="#ef4444" />
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni</Text>
          <TouchableOpacity style={styles.option}>
            <Info size={20} color="#6b7280" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>App Gestione Multe</Text>
              <Text style={styles.optionDescription}>
                Versione 1.0.0 - Modalità Mister
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL SCELTA SQUADRA */}
      <Modal
        visible={exportPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExportPickerVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Esporta multe in CSV</Text>
            <Text style={styles.modalSubtitle}>
              Seleziona una squadra oppure tutte le squadre.
            </Text>

            <RNScrollView
              style={{ maxHeight: 260, marginTop: 12 }}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <TouchableOpacity
                style={styles.teamOption}
                onPress={() => {
                  console.log('⚡ TAPPED ALL TEAMS');
                  doExport(undefined, undefined);
                }}
              >
                <Text style={styles.teamOptionText}>Tutte le squadre</Text>
              </TouchableOpacity>

              {(teams ?? []).map((t: any) => (
                <TouchableOpacity
                  key={String(t.id)}
                  style={styles.teamOption}
                  onPress={() => {
                    console.log('⚡ TAPPED TEAM', t.id, t.name);
                    doExport(t.id, t.name);
                  }}
                >
                  <Text style={styles.teamOptionText}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </RNScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setExportPickerVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annulla</Text>
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    padding: 16,
    paddingBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  dangerOption: {
    backgroundColor: '#fef2f2',
  },
  dangerText: {
    color: '#ef4444',
  },

  // modal export
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  teamOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  teamOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  modalActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});