import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useEffect, useRef, useState } from 'react';
import { finesDB, playersDB, usersDB } from '@/database/database.supabase';
import {
  scheduleFineAssignedNotification,
  scheduleFineDueNotification,
} from '@/utils/notifications';

// Layout per il ruolo "player" - controlla se ha già un'associazione
export default function PlayerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, setUser } = useAuth();
  const { setPlayerIdentity } = useRole();
  const [checked, setChecked] = useState(false);
  const hasBaselineFinesRef = useRef(false);
  const knownFineIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!user?.playerId) {
      setChecked(false);
      return;
    }

    // Se l'utente ha già un player_id associato, naviga direttamente alla squadra
    if (!checked) {
      setChecked(true);
      setPlayerIdentity({ playerId: user.playerId });
      
      // Solo se siamo nella schermata join-team, carica il giocatore e naviga alla squadra
      const inJoinTeam = (segments as unknown as string[]).includes('join-team');
      if (inJoinTeam) {
        // Carica il giocatore per ottenere il team_id
        playersDB.getById(user.playerId).then(async (player) => {
          if (player?.team_id) {
            router.replace({
              pathname: '/(player)/team/[teamId]',
              params: { teamId: String(player.team_id) },
            });
            return;
          }

          // Link stale (player eliminato/non trovato): pulizia collegamento
          if (user?.id) {
            await usersDB.unlinkPlayer(user.id);
            setUser({
              ...user,
              playerId: null,
            });
          }
          setPlayerIdentity({ playerId: null });
        }).catch(err => {
          console.error('Error loading player for redirect:', err);
        });
      }
    }
  }, [user?.id, user?.playerId, segments, checked, router, setPlayerIdentity, setUser]);

  // Notifiche player (parziale locale):
  // - nuova multa: notifica immediata quando compare una nuova multa
  // - scadenza: schedula D-1 ore 09:00 per multe aperte
  useEffect(() => {
    if (user?.role !== 'player' || !user?.playerId) return;

    let cancelled = false;

    const checkAndSchedule = async () => {
      try {
        const fines = await finesDB.getByPlayer(user.playerId!);
        if (cancelled) return;

        const currentIds = new Set<number>(
          fines
            .map((f: any) => Number(f?.id))
            .filter((id: number) => Number.isFinite(id) && id > 0)
        );

        const hasNewFine = hasBaselineFinesRef.current
          ? Array.from(currentIds).some((id) => !knownFineIdsRef.current.has(id))
          : false;

        knownFineIdsRef.current = currentIds;
        if (!hasBaselineFinesRef.current) hasBaselineFinesRef.current = true;

        if (hasNewFine) {
          console.log('[NOTIF-PLAYER] New fine detected! Sending notification...');
          await scheduleFineAssignedNotification();
        }

        for (const f of fines) {
          if (cancelled) return;

          const fineId = Number(f?.id);
          if (!Number.isFinite(fineId) || fineId <= 0) continue;
          if (!!f?.is_paid) continue;
          if (!f?.due_date || typeof f.due_date !== 'string') continue;

          await scheduleFineDueNotification(f.due_date, undefined, undefined, fineId);
        }
      } catch (err) {
        console.log('[NOTIF] player polling failed (ignored):', err);
      }
    };

    void checkAndSchedule();
    const interval = setInterval(() => {
      void checkAndSchedule();
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user?.role, user?.playerId]);

  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      {/* Schermata per unirsi a un team */}
      <Stack.Screen name="join-team" options={{ gestureEnabled: false }} />
      {/* Dettagli team */}
      <Stack.Screen name="team/[teamId]" options={{ gestureEnabled: false }} />
      {/* Rosa team */}
      <Stack.Screen name="team/[teamId]/roster" options={{ gestureEnabled: false }} />
      {/* Multe team */}
      <Stack.Screen name="team/[teamId]/fines" options={{ gestureEnabled: false }} />
      {/* Calendario presenze (sola lettura) */}
      <Stack.Screen name="attendance/[teamId]" options={{ gestureEnabled: false }} />
      {/* Dettaglio attandanza giocatore */}
      <Stack.Screen name="player-attendance/[teamId]/[playerId]" options={{ gestureEnabled: false }} />
      {/* Multe del giocatore */}
      <Stack.Screen name="[playerId]/fines" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
