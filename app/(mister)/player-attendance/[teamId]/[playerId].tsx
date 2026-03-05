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
import { ArrowLeft } from 'lucide-react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import {
  useDatabase,
  usePlayerAttendanceHistory,
  usePlayerAttendanceSummary,
} from '@/hooks/useDatabase';
import type { AttendanceStatus } from '@/database/database';

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

const STATUS_COLOR: Record<string, string> = {
  present: '#16a34a',
  late: '#f59e0b',
  absent_justified: '#ea580c',
  absent_unjustified: '#dc2626',
  injured: '#ee57bc',
  sick: '#7c3aed',
};

const STATUS_LABELS: Record<string, string> = {
  present: 'Presente',
  late: 'Ritardo',
  absent_justified: 'Assenza Giustificata',
  absent_unjustified: 'Assenza Ingiustificata',
  injured: 'Infortunato',
  sick: 'Malattia',
};

export default function PlayerAttendanceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { isInitialized } = useDatabase();

  const { teamId: teamIdParam, playerId: playerIdParam, playerName } = useLocalSearchParams<{
    teamId?: string;
    playerId?: string;
    playerName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const playerId = useMemo(() => Number(playerIdParam ?? -1), [playerIdParam]);
  const [refreshing, setRefreshing] = useState(false);

  const enabled = isInitialized && teamId > 0 && playerId > 0;

  const { history, loading: historyLoading, refreshHistory } = usePlayerAttendanceHistory(
    teamId,
    playerId
  );

  const { summary, loading: summaryLoading } = usePlayerAttendanceSummary(teamId, playerId);

  // Build markedDates from history
  const markedDates = useMemo(() => {
    const marked: Record<
      string,
      {
        selected: boolean;
        selectedColor: string;
      }
    > = {};

    history.forEach((entry) => {
      if (entry.status) {
        marked[entry.date] = {
          selected: true,
          selectedColor: STATUS_COLOR[entry.status] || '#9ca3af',
        };
      }
    });

    return marked;
  }, [history]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshHistory();
    setRefreshing(false);
  }, [refreshHistory]);

  if (!(teamId > 0 && playerId > 0)) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text>Dati non validi.</Text>
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
          {typeof playerName === 'string' ? playerName : 'Giocatore'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {historyLoading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text>Caricamento calendario...</Text>
          </View>
        ) : (
          <>
            <Calendar
              markedDates={markedDates}
              theme={{
                todayTextColor: '#2563eb',
                arrowColor: '#2563eb',
                selectedDayTextColor: '#fff',
                textDayFontWeight: '600',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '700',
              }}
              firstDay={1}
            />

            <View style={styles.legendRow}>
              {Object.entries(STATUS_COLOR).map(([key, color]) => (
                <View key={key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={styles.legendText}>{STATUS_LABELS[key]}</Text>
                </View>
              ))}
            </View>

            {!summaryLoading && (
              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Riepilogo</Text>

                <Text style={styles.summarySubtitle}>
                  Totale allenamenti: <Text style={{ fontWeight: 'bold' }}>{summary.total_sessions}</Text>
                </Text>

                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Presenze</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.present }]}>
                      {summary.present}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Ritardi</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.late }]}>
                      {summary.late}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Assenze Giustificate</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.absent_justified }]}>
                      {summary.absent_justified}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Assenze Ingiustificate</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.absent_unjustified }]}>
                      {summary.absent_unjustified}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Infortuni</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.injured }]}>
                      {summary.injured}
                    </Text>
                  </View>

                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Malattie</Text>
                    <Text style={[styles.summaryValue, { color: STATUS_COLOR.sick }]}>
                      {summary.sick}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
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

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 12,
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

  summarySection: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
