import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, ChevronRight, Download } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';

import { useDatabase, useTeamAttendance, useMonthAttendanceExport } from '@/hooks/useDatabase';
import type { AttendanceStatus } from '@/database/database';
import { exportMonthAttendanceXLSX } from '@/utils/exportToXlsx';

LocaleConfig.locales.it = {
  monthNames: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],
  monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
  dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
};
LocaleConfig.defaultLocale = 'it';

const STATUS_OPTIONS: Array<{
  value: AttendanceStatus;
  shortLabel: string;
  fullLabel: string;
  color: string;
}> = [
  { value: 'present', shortLabel: 'P', fullLabel: 'Presente', color: '#16a34a' },
  { value: 'late', shortLabel: 'R', fullLabel: 'Ritardo', color: '#f59e0b' },
  { value: 'absent_justified', shortLabel: 'AG', fullLabel: 'Assenza Giustificata', color: '#ea580c' },
  { value: 'absent_unjustified', shortLabel: 'AI', fullLabel: 'Assenza Ingiustificata', color: '#dc2626' },
  { value: 'injured', shortLabel: 'I', fullLabel: 'Infortunato', color: '#ee57bc' },
  { value: 'sick', shortLabel: 'M', fullLabel: 'Malattia', color: '#7c3aed' },
];

const toYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const toItalianDate = (ymd: string) => {
  const [y, m, d] = ymd.split('-');
  if (!y || !m || !d) return ymd;
  return `${d}-${m}-${y}`;
};

export default function AttendanceCalendarScreen() {
  const insets = useSafeAreaInsets();
  const { isInitialized } = useDatabase();

  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const [selectedDate, setSelectedDate] = useState(() => toYmd(new Date()));
  const [displayYear, setDisplayYear] = useState(() => new Date().getFullYear());
  const [displayMonth, setDisplayMonth] = useState(() => new Date().getMonth() + 1);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const enabled = isInitialized && teamId > 0;

  // Extract year and month from selectedDate
  const currentYear = useMemo(() => parseInt(selectedDate.split('-')[0], 10), [selectedDate]);
  const currentMonth = useMemo(() => parseInt(selectedDate.split('-')[1], 10), [selectedDate]);

  const { rows, loading, setPlayerAttendance, refreshAttendance } = useTeamAttendance(
    teamId,
    selectedDate,
    { enabled }
  );

  const { loadMonthData } = useMonthAttendanceExport(teamId, displayYear, displayMonth);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAttendance();
    setRefreshing(false);
  }, [refreshAttendance]);

  const handleSetStatus = useCallback(
    async (playerId: number, status: AttendanceStatus) => {
      await setPlayerAttendance(playerId, status);
    },
    [setPlayerAttendance]
  );

  const handleMonthChange = useCallback((month: { year: number; month: number }) => {
    setDisplayYear(month.year);
    setDisplayMonth(month.month);
  }, []);

  const handleExportCSV = useCallback(async () => {
    if (exporting) return;

    setExporting(true);
    try {
      const data = await loadMonthData();
      if (!data || data.players.length === 0) {
        Alert.alert('Nessun dato', 'Non ci sono dati da esportare per questo mese.');
        return;
      }

      await exportMonthAttendanceXLSX(
        typeof teamName === 'string' ? teamName : 'Squadra',
        displayYear,
        displayMonth,
        data.players,
        data.attendances
      );
    } catch (error) {
      console.error('Error exporting XLSX:', error);
      Alert.alert('Errore', 'Impossibile esportare il file Excel.');
    } finally {
      setExporting(false);
    }
  }, [exporting, loadMonthData, teamName, displayYear, displayMonth]);

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
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          Calendario · {typeof teamName === 'string' ? teamName : 'Squadra'}
        </Text>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExportCSV}
          disabled={exporting}
        >
          <Download size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Calendar
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          onMonthChange={handleMonthChange}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: '#2563eb',
            },
          }}
          theme={{
            todayTextColor: '#2563eb',
            arrowColor: '#2563eb',
            selectedDayTextColor: '#ffffff',
            textDayFontWeight: '600',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '700',
          }}
          firstDay={1}
        />

        <Text style={styles.selectedDateLabel}>Data selezionata: {toItalianDate(selectedDate)}</Text>

        <View style={styles.legendRow}>
          {STATUS_OPTIONS.map((s) => (
            <View key={s.value} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.shortLabel} = {s.fullLabel}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text>Caricamento giocatori...</Text>
          </View>
        ) : rows.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Nessun giocatore in questa squadra.</Text>
          </View>
        ) : (
          rows.map((row) => (
            <TouchableOpacity
              key={String(row.player_id)}
              style={styles.playerRow}
              onPress={() => {
                router.push({
                  pathname: '/(mister)/player-attendance/[teamId]/[playerId]',
                  params: {
                    teamId: String(teamId),
                    playerId: String(row.player_id),
                    playerName: row.player_name,
                  },
                });
              }}
            >
              <View style={styles.playerMeta}>
                <View style={styles.playerTopRow}>
                  <Text style={styles.playerName}>{row.player_name}</Text>
                  <ChevronRight size={16} color="#9ca3af" />
                </View>
                <Text style={styles.playerSub}>#{row.player_number} · {row.player_position}</Text>
              </View>

              <View style={styles.statusActions}>
                {STATUS_OPTIONS.map((status) => {
                  const active = row.attendance_status === status.value;

                  return (
                    <TouchableOpacity
                      key={status.value}
                      style={[
                        styles.statusBtn,
                        { borderColor: status.color },
                        active && { backgroundColor: status.color },
                      ]}
                      onPress={() => handleSetStatus(row.player_id, status.value)}
                    >
                      <Text style={[styles.statusBtnText, active && { color: '#fff' }]}>{status.shortLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#2e70b7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  exportBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  selectedDateLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '700',
  },

  playerRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  playerMeta: {
    marginBottom: 10,
  },
  playerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  playerSub: {
    marginTop: 2,
    color: '#6b7280',
    fontSize: 12,
  },
  statusActions: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    minWidth: 38,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  statusBtnText: {
    fontWeight: '800',
    color: '#111827',
    fontSize: 12,
  },
});
