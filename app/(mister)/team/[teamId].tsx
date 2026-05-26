import { useMemo } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Users, CalendarDays, CircleDollarSign, ChevronRight, MessageCircle } from 'lucide-react-native';

export default function TeamActionsScreen() {
  const insets = useSafeAreaInsets();
  const { teamId: teamIdParam, teamName } = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();

  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);
  const safeTeamName = useMemo(
    () => (typeof teamName === 'string' ? teamName : 'Squadra'),
    [teamName]
  );

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
          {safeTeamName}
        </Text>

        <View style={{ width: 32 }} />
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#2e70b7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
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
});