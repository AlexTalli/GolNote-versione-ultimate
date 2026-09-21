import { useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { ArrowLeft, Users, CalendarDays, CircleDollarSign, ChevronRight, MessageCircle, Download } from 'lucide-react-native';

import { useAuth } from '@/contexts/AuthContext';
import { exportMisterFinesXLSX } from '@/utils/exportToXlsx';
import type { MisterFinesExportSort } from '@/utils/exportToXlsx';

export default function TeamActionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportSortBy, setExportSortBy] = useState<MisterFinesExportSort>('surname');
  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const safeTeamName = useMemo(
    () => (typeof teamName === 'string' ? teamName : 'Squadra'),
    [teamName]
  );

  const handleExportTeamFines = async () => {
    if (!user?.id) {
      Alert.alert('Errore', 'Utente non valido.');
      return;
    }

    setExporting(true);
    try {
      await exportMisterFinesXLSX(user.id, teamId, safeTeamName, exportSortBy);
    } catch (error) {
      console.error('Error exporting team fines:', error);
      Alert.alert('Errore', 'Impossibile esportare il file Excel.');
    } finally {
      setExporting(false);
      setExportModalVisible(false);
    }
  };

  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {safeTeamName}
        </Text>

        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Scegli cosa vuoi fare con questa squadra:</Text>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(mister)/team/[teamId]/roster',
              params: {
                teamId: String(teamId),
                teamName: safeTeamName,
              },
            })
          }
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
            <Users size={20} color="#15803d" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>La tua rosa</Text>
            <Text style={styles.actionDescription}>Aggiungi, modifica e gestisci i tuoi giocatori.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(mister)/team/[teamId]/fines',
              params: {
                teamId: String(teamId),
                teamName: safeTeamName,
              },
            })
          }
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#fee2e2' }]}>
            <CircleDollarSign size={20} color="#b91c1c" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Assegna le multe</Text>
            <Text style={styles.actionDescription}>Scegli un giocatore e registra le sue multe.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.9}
          onPress={() => setExportModalVisible(true)}
          disabled={exporting}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#f9e0be' }]}> 
            <Download size={20} color="#e5b545" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Esporta multe in Excel</Text>
            <Text style={styles.actionDescription}>Scarica il riepilogo delle multe di questa squadra.</Text>
          </View>
          {exporting ? <ActivityIndicator size="small" color="#15803d" /> : <ChevronRight size={20} color="#9ca3af" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(mister)/attendance/[teamId]',
              params: {
                teamId: String(teamId),
                teamName: safeTeamName,
              },
            })
          }
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#dbeafe' }]}>
            <CalendarDays size={20} color="#1d4ed8" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Gestisci il calendario</Text>
            <Text style={styles.actionDescription}>Apri il calendario e segna le presenze agli allenamenti.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(mister)/chat',
              params: {
                teamId: String(teamId),
                teamName: safeTeamName,
              },
            })
          }
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#fce7f3' }]}>
            <MessageCircle size={20} color="#be185d" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Chat con uno dei tuoi giocatori</Text>
            <Text style={styles.actionDescription}>Avvia una conversazione con uno dei tuoi giocatori per comunicargli qualcosa.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

      </View>

      <Modal
        visible={exportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Esporta multe in Excel</Text>
            <Text style={styles.modalSubtitle}>
              Seleziona l’ordine di visualizzazione dei dati della squadra.
            </Text>

            <View style={styles.exportSortWrap}>
              <Text style={styles.exportSortLabel}>Ordina export per:</Text>
              <View style={styles.exportSortButtons}>
                <TouchableOpacity
                  style={[styles.exportSortBtn, exportSortBy === 'surname' && styles.exportSortBtnActive]}
                  onPress={() => setExportSortBy('surname')}
                >
                  <Text style={[styles.exportSortBtnText, exportSortBy === 'surname' && styles.exportSortBtnTextActive]}>
                    Cognome giocatore
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportSortBtn, exportSortBy === 'payment_status' && styles.exportSortBtnActive]}
                  onPress={() => setExportSortBy('payment_status')}
                >
                  <Text style={[styles.exportSortBtnText, exportSortBy === 'payment_status' && styles.exportSortBtnTextActive]}>
                    Non pagate → pagate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setExportModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annulla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSave, exporting && styles.modalSaveDisabled]}
                onPress={handleExportTeamFines}
                disabled={exporting}
              >
                {exporting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.modalSaveText}>Esporta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#2e70b7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    width: 32,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 32,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    paddingHorizontal: 8,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
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
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
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
  modalSave: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    minWidth: 88,
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