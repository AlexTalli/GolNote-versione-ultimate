import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';

import { useDatabase, useTeamAttendancePublic, useMonthAttendanceStatus } from '@/hooks/useDatabase';
import type { AttendanceStatus } from '@/database/database.supabase';

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

const STATUS_BY_VALUE = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s])) as Record<
  AttendanceStatus,
  (typeof STATUS_OPTIONS)[number]
>;

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

export default function PlayerAttendanceCalendarScreen() {
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
  const [sortBy, setSortBy] = useState<'position' | 'name' | 'surname'>('position');

  const enabled = isInitialized && teamId > 0;

  const { rows, loading, refreshAttendance } = useTeamAttendancePublic(teamId, selectedDate, {
    enabled,
  });

  // Carica lo stato del calendario per il mese
  const { markedDates: monthMarkedDates, refreshMonthStatus } = useMonthAttendanceStatus(
    teamId,
    displayYear,
    displayMonth,
    { enabled }
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAttendance();
    await refreshMonthStatus();
    setRefreshing(false);
  }, [refreshAttendance, refreshMonthStatus]);

  const handleMonthChange = useCallback((month: { year: number; month: number }) => {
    setDisplayYear(month.year);
    setDisplayMonth(month.month);
  }, []);

  const POSITION_ORDER: Record<string, number> = {
    portiere: 0,
    difensore: 1,
    centrocampista: 2,
    attaccante: 3,
  };

  const getSurnameKey = useCallback((row: (typeof rows)[number]) => {
    const explicitSurname = row.player_surname?.trim();
    if (explicitSurname) return explicitSurname;

    const rawName = (row.player_first_name || row.player_name || '').trim();
    const parts = rawName.split(' ').filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : rawName;
  }, []);

  const getNameKey = useCallback((row: (typeof rows)[number]) => {
    const rawName = (row.player_first_name || row.player_name || '').trim();
    const parts = rawName.split(' ').filter(Boolean);
    return parts.length > 1 ? parts[0] : rawName;
  }, []);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (sortBy === 'position') {
        const posA = POSITION_ORDER[a.player_position?.toLowerCase()] ?? 99;
        const posB = POSITION_ORDER[b.player_position?.toLowerCase()] ?? 99;
        if (posA !== posB) return posA - posB;
        return getSurnameKey(a).localeCompare(getSurnameKey(b), 'it', { sensitivity: 'base' });
      }

      return getSurnameKey(a).localeCompare(getSurnameKey(b), 'it', { sensitivity: 'base' });
    });
  }, [rows, sortBy, getSurnameKey]);

  // Costruisci markedDates combinando la data selezionata e lo stato del calendario
  const calendarMarkedDates = useMemo(() => {
    const marked: Record<
      string,
      {
        customStyles?: {
          container?: Record<string, unknown>;
          text?: Record<string, unknown>;
        };
      }
    > = {
      [selectedDate]: {
        customStyles: {
          container: {
            backgroundColor: '#2563eb',
            borderRadius: 16,
          },
          text: {
            color: '#ffffff',
            fontWeight: '700',
          },
        },
      },
    };

    // Aggiungi i marker per le date con presenze
    Object.entries(monthMarkedDates).forEach(([date, status]) => {
      if (!marked[date]) {
        marked[date] = {};
      }
      // Colore per presenze complete: blu scuro
      // Colore per presenze parziali: blu chiaro
      const borderColor = status.isComplete
        ? '#2563eb' // Blu scuro (complete)
        : '#93c5fd'; // Blu chiaro (partial)

      const isSelected = date === selectedDate;
      marked[date] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor,
            borderRadius: 16,
            backgroundColor: isSelected ? '#2563eb' : 'transparent',
          },
          text: {
            color: isSelected ? '#ffffff' : '#1f2937',
            fontWeight: '700',
          },
        },
      };
    });

    return marked;
  }, [selectedDate, monthMarkedDates]);

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
          <ArrowLeft size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          Calendario · {typeof teamName === 'string' ? teamName : 'Squadra'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Calendar
          markingType="custom"
          onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
          onMonthChange={handleMonthChange}
          markedDates={calendarMarkedDates}
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
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
            <Text style={styles.legendText}>Data completa (a tutti i giocatori è segnata la presenza)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#93c5fd' }]} />
            <Text style={styles.legendText}>Data parziale (mancano presenze di alcuni giocatori)</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          {STATUS_OPTIONS.map((s) => (
            <View key={s.value} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.shortLabel} = {s.fullLabel}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>Ordina per:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'position' && styles.sortBtnActive]}
              onPress={() => setSortBy('position')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'position' && styles.sortBtnTextActive]}>
                Ruolo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortBtn, sortBy === 'surname' && styles.sortBtnActive]}
              onPress={() => setSortBy('surname')}
            >
              <Text style={[styles.sortBtnText, sortBy === 'surname' && styles.sortBtnTextActive]}>
                Cognome
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text>Caricamento giocatori...</Text>
          </View>
        ) : sortedRows.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280' }}>Nessun giocatore in questa squadra.</Text>
          </View>
        ) : (
          sortedRows.map((row, index) => {
            const current = row.attendance_status ? STATUS_BY_VALUE[row.attendance_status] : null;

            return (
              <TouchableOpacity
                key={String(row.player_id)}
                style={styles.playerRow}
                onPress={() => {
                  router.push({
                    pathname: '/(player)/player-attendance/[teamId]/[playerId]',
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
                  <Text style={styles.playerSub}>#{index + 1} · {row.player_position}</Text>
                </View>

                <View
                  style={[
                    styles.readOnlyBadge,
                    current
                      ? { borderColor: current.color, backgroundColor: `${current.color}22` }
                      : { borderColor: '#d1d5db', backgroundColor: '#f3f4f6' },
                  ]}
                >
                  <Text
                    style={[
                      styles.readOnlyBadgeText,
                      current ? { color: current.color } : { color: '#6b7280' },
                    ]}
                  >
                    {current ? current.shortLabel : '-'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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

  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  sortBtnActive: {
    backgroundColor: '#2e70b7ff',
    borderColor: '#2e70b7ff',
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortBtnTextActive: {
    color: '#ffffff',
  },

  playerRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  playerMeta: {
    flex: 1,
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
  readOnlyBadge: {
    minWidth: 42,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  readOnlyBadgeText: {
    fontWeight: '800',
    fontSize: 13,
  },
});
