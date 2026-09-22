/* ========== IMPORTAZIONI ========== */

// Importazioni per componenti UI e navigazione
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState, useCallback } from 'react';

// Icona per il pulsante indietro
import {
  CalendarDays,
  CircleDollarSign,
  ChevronRight,
  Trash2,
  UserX,
  Users,
  MessageCircle,
  House,
} from 'lucide-react-native';

// Database per caricare i giocatori
import { playersDB, usersDB } from '@/database/database.supabase';

// Auth per eliminare account
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

export default function PlayerTeamScreen() {
  /* ========== HOOKS E STATI ========== */

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { setPlayerIdentity, setRole } = useRole();

  const { teamId: teamIdParam } = useLocalSearchParams<{ teamId?: string }>();
  const teamId = useMemo(() => Number(teamIdParam ?? -1), [teamIdParam]);

  const [teamName, setTeamName] = useState('Squadra');
  const [loading, setLoading] = useState(true);

  /* ========== FUNZIONI DI CARICAMENTO ========== */

  const loadTeamName = useCallback(async () => {
    if (!(teamId > 0)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const ps = await playersDB.getByTeamPublic(teamId);
      setTeamName(ps[0]?.team_name || 'Squadra');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Elimina account
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Elimina Account',
      'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              const ok = await usersDB.deleteAccount(user.id);
              if (!ok) {
                throw new Error('Delete account failed');
              }
              setUser(null);
              setRole(null);
              setPlayerIdentity({ playerId: null });
              router.dismissAll();
              router.replace('/');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Errore', 'Impossibile eliminare l\'account.');
            }
          },
        },
      ]
    );
  }, [user, setUser, setRole, setPlayerIdentity, router]);

  // Dissocia da questo giocatore
  const handleUnlinkPlayer = useCallback(() => {
    Alert.alert(
      'Dissocia Giocatore',
      'Vuoi dissociarti da questo giocatore? Potrai scegliere un altro giocatore dopo.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Dissocia',
          onPress: async () => {
            if (!user) return;
            try {
              await usersDB.unlinkPlayer(user.id);
              setUser({ ...user, playerId: null });
              setPlayerIdentity({ playerId: null });
              router.replace('/(player)/join-team');
            } catch (error) {
              console.error('Error unlinking player:', error);
              Alert.alert('Errore', 'Impossibile dissociare il giocatore.');
            }
          },
        },
      ]
    );
  }, [user, setUser, setPlayerIdentity, router]);

  // Torna alla home iniziale (selezione ruolo), come nelle impostazioni mister
  const handleGoHome = useCallback(() => {
    Alert.alert(
      'Vuoi tornare alla Home?',
      'Verrai riportato alla selezione ruolo.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sì',
          onPress: () => {
            setUser(null);
            setRole(null);
            setPlayerIdentity({ playerId: null });
            router.replace('/');
          },
        },
      ]
    );
  }, [setUser, setRole, setPlayerIdentity, router]);

  useEffect(() => {
    loadTeamName();
  }, [loadTeamName]);

  /* ========== RENDERING ========== */

  // Controllo se teamId è valido
  if (!(teamId > 0)) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>ID squadra non valido.</Text>
      </SafeAreaView>
    );
  }

  // Schermata di caricamento
  if (loading) {
    return (
      <SafeAreaView style={[s.container, s.center]}>
        <Text>Caricamento…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['left', 'right', 'bottom']}>
      {/* Header con pulsante indietro e titolo */}
      <View style={[s.header, { paddingTop: Math.max(insets.top, 8) }]}>
        {/* Titolo con nome squadra */}
        <Text style={s.title} numberOfLines={1}>
          Squadra · {teamName}
        </Text>

        {/* Icona home: torna alla selezione ruolo */}
        <TouchableOpacity style={s.homeBtn} onPress={handleGoHome}>
          <House size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Icona dissocia giocatore */}
        <TouchableOpacity style={s.unlinkBtn} onPress={handleUnlinkPlayer}>
          <UserX size={20} color="#f59e0b" />
        </TouchableOpacity>

        {/* Icona cestino per eliminare account */}
        <TouchableOpacity style={s.deleteBtn} onPress={handleDeleteAccount}>
          <Trash2 size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        <Text style={s.subtitle}>Scegli la sezione che vuoi vedere:</Text>

        <TouchableOpacity
          style={s.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(player)/team/[teamId]/roster',
              params: {
                teamId: String(teamId),
                teamName,
              },
            })
          }
        >
          <View style={[s.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
            <Users size={20} color="#15803d" />
          </View>
          <View style={s.actionTextWrap}>
            <Text style={s.actionTitle}>Vedi la tua Rosa</Text>
            <Text style={s.actionDescription}>Visualizza tutti i giocatori della tua squadra.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(player)/team/[teamId]/fines',
              params: {
                teamId: String(teamId),
                teamName,
              },
            })
          }
        >
          <View style={[s.actionIconWrap, { backgroundColor: '#fee2e2' }]}>
            <CircleDollarSign size={20} color="#b91c1c" />
          </View>
          <View style={s.actionTextWrap}>
            <Text style={s.actionTitle}>Vedi le multe</Text>
            <Text style={s.actionDescription}>Controlla le multe assegnate a te e ai tuoi compagni.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(player)/attendance/[teamId]',
              params: {
                teamId: String(teamId),
                teamName,
              },
            })
          }
        >
          <View style={[s.actionIconWrap, { backgroundColor: '#dbeafe' }]}>
            <CalendarDays size={20} color="#1d4ed8" />
          </View>
          <View style={s.actionTextWrap}>
            <Text style={s.actionTitle}>Vedi il calendario</Text>
            <Text style={s.actionDescription}>Consulta presenze e assenze agli allenamenti.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.actionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/(player)/chat',
              params: {
                teamId: String(teamId),
                teamName,
              },
            })
          }
        >
          <View style={[s.actionIconWrap, { backgroundColor: '#fce7f3' }]}>
            <MessageCircle size={20} color="#be185d" />
          </View>
          <View style={s.actionTextWrap}>
            <Text style={s.actionTitle}>Chat col Mister</Text>
            <Text style={s.actionDescription}>Avvia una conversazione con il tuo Mister per comunicargli qualcosa.</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  /* ========== STILI ========== */

  // Contenitore principale con sfondo bianco
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header copiato dallo screen del mister (stesso stile blu)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#2e70b7ff', // stesso colore del mister
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  // Pulsante home
  homeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Pulsante dissocia giocatore
  unlinkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Pulsante elimina account
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },

  // Titolo centrato
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
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