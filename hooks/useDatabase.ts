// hooks/useDatabase.ts
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';

import {
  initDatabase,
  teamsDB,
  playersDB,
  finesDB,
  statsDB,
} from '@/database/database';

import { useAuth } from '@/contexts/AuthContext';

// -------------------- Core init --------------------
export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initDatabase();
        if (!cancelled) setIsInitialized(true);
      } catch (e) {
        console.error('Failed to initialize database:', e);
        if (!cancelled) setError(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isInitialized, error };
};

// ==================== TEAMS (Mister) ====================
type TeamInput = {
  name: string;
  description: string;
  color: string;
  password?: string; 
};

export const useTeams = (deps: { enabled?: boolean } = {}) => {
  const { user } = useAuth();
  const ownerUserId = user?.role === 'mister' ? user.id : null;

  const enabled = (deps.enabled ?? true) && !!ownerUserId;

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = useCallback(async () => {
    if (!enabled || !ownerUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await teamsDB.getAll(ownerUserId);
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ownerUserId]);

  const addTeam = useCallback(
    async (teamData: TeamInput): Promise<boolean> => {
      if (!ownerUserId) return false;

      const password_hash = teamData.password
        ? await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            teamData.password
          )
        : null;

      const { password, ...rest } = teamData;

      const id = await teamsDB.create(ownerUserId, {
        ...rest,
        password_hash,
      } as any);

      if (id) {
        await loadTeams();
        return true;
      }
      return false;
    },
    [ownerUserId, loadTeams]
  );

  const deleteTeam = useCallback(
    async (id: number): Promise<boolean> => {
      if (!ownerUserId) return false;
      const success = await teamsDB.delete(ownerUserId, id);
      if (success) await loadTeams();
      return success;
    },
    [ownerUserId, loadTeams]
  );

  useEffect(() => {
    if (enabled) loadTeams();
    else setLoading(false);
  }, [enabled, loadTeams]);

  return { teams, loading, addTeam, deleteTeam, refreshTeams: loadTeams };
};

// ==================== PLAYERS (Mister) ====================
type PlayerInput = {
  name: string;
  number: string;
  position: string;
  team_id: number;
};

export const usePlayers = (teamId?: number, deps: { enabled?: boolean } = {}) => {
  const { user } = useAuth();
  const ownerUserId = user?.role === 'mister' ? user.id : null;

  const enabled = (deps.enabled ?? true) && !!ownerUserId;

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlayers = useCallback(async () => {
    if (!enabled || !ownerUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const hasTeam = typeof teamId === 'number' && teamId > 0;

      const data = hasTeam
        ? await playersDB.getByTeam(teamId!, ownerUserId)
        : await playersDB.getAll(ownerUserId);

      setPlayers(data);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, teamId, ownerUserId]);

  const addPlayer = useCallback(
    async (playerData: PlayerInput): Promise<boolean> => {
      if (!ownerUserId) return false;
      const id = await playersDB.create(ownerUserId, playerData);
      if (id) {
        await loadPlayers();
        return true;
      }
      return false;
    },
    [ownerUserId, loadPlayers]
  );

  const deletePlayer = useCallback(
    async (id: number): Promise<boolean> => {
      if (!ownerUserId) return false;
      const success = await playersDB.delete(ownerUserId, id);
      if (success) await loadPlayers();
      return success;
    },
    [ownerUserId, loadPlayers]
  );

  useEffect(() => {
    if (enabled) loadPlayers();
    else setLoading(false);
  }, [enabled, loadPlayers]);

  return { players, loading, addPlayer, deletePlayer, refreshPlayers: loadPlayers };
};

// ==================== FINES (Mister + Player) ====================
type FineInput = {
  player_id: number;
  type: string;
  amount: number;
  description?: string;
  due_date: string; // YYYY-MM-DD
};

/**
 * Se passi `playerId` > 0 => modalità GIOCATORE (solo lettura delle proprie multe).
 * Se NON passi `playerId` => modalità MISTER (CRUD sulle multe dei suoi team).
 */
export const useFines = (playerId?: number, deps: { enabled?: boolean } = {}) => {
  const { user } = useAuth();
  const ownerUserId = user?.role === 'mister' ? user.id : null;

  const readByPlayer = typeof playerId === 'number' && playerId > 0;
  const canMutate = user?.role === 'mister';

  const enabled = useMemo(() => {
    if (readByPlayer) return (deps.enabled ?? true) && playerId! > 0;
    return (deps.enabled ?? true) && !!ownerUserId;
  }, [deps.enabled, readByPlayer, playerId, ownerUserId]);

  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFines = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = readByPlayer
        ? await finesDB.getByPlayer(playerId!)
        : await finesDB.getAll(ownerUserId!);

      setFines(data);
    } catch (error) {
      console.error('Error loading fines:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, readByPlayer, playerId, ownerUserId]);

  /**
   * CREA multa - ritorna fineId (serve poi per salvare notification_id).
   */
  const addFine = useCallback(
    async (fineData: FineInput): Promise<number | null> => {
      if (!canMutate || !ownerUserId) return null;

      const id = await finesDB.create(ownerUserId, fineData);
      if (id) {
        await loadFines();
        return id;
      }
      return null;
    },
    [canMutate, ownerUserId, loadFines]
  );

  const toggleFinePayment = useCallback(
    async (id: number, isPaid: boolean): Promise<boolean> => {
      if (!canMutate || !ownerUserId) return false;

      const ok = await finesDB.updatePaymentStatus(ownerUserId, id, isPaid);
      if (ok) await loadFines();
      return ok;
    },
    [canMutate, ownerUserId, loadFines]
  );

  /**
   * DELETE multa:
   * 1) recupera notification_id
   * 2) cancella notifica schedulata
   * 3) pulisce notification_id (opzionale ma utile)
   * 4) elimina multa dal DB
   */
  const deleteFine = useCallback(
    async (fineId: number): Promise<boolean> => {
      if (!canMutate || !ownerUserId) return false;

      try {
        const notifId = await finesDB.getNotificationId(ownerUserId, fineId);

        if (notifId) {
          try {
            await Notifications.cancelScheduledNotificationAsync(notifId);
          } catch (e) {
            console.log('[NOTIF] cancel fine notif failed (ignored):', e);
          }

          // pulizia DB (così non rimane sporcizia inutilizzata)
          await finesDB.setNotificationId(ownerUserId, fineId, null);
        }

        const ok = await finesDB.delete(ownerUserId, fineId);
        if (ok) await loadFines();
        return ok;
      } catch (e) {
        console.error('Error deleting fine (with notif cleanup):', e);
        return false;
      }
    },
    [canMutate, ownerUserId, loadFines]
  );

  useEffect(() => {
    if (enabled) loadFines();
    else setLoading(false);
  }, [enabled, loadFines]);

  return { fines, loading, addFine, toggleFinePayment, deleteFine, refreshFines: loadFines };
};

// ==================== DASHBOARD STATS ====================
type DashboardStats = {
  total_teams: number;
  total_players: number;
  active_fines: number;
  total_amount: number;
  paid_amount: number;
  unpaid_amount: number;
};

export const useDashboardStats = (deps: { enabled?: boolean } = {}) => {
  const { user } = useAuth();
  const ownerUserId = user?.role === 'mister' ? user.id : null;

  const enabled = deps.enabled ?? true;

  const [stats, setStats] = useState<DashboardStats>({
    total_teams: 0,
    total_players: 0,
    active_fines: 0,
    total_amount: 0,
    paid_amount: 0,
    unpaid_amount: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const raw: Partial<Record<string, unknown>> = await statsDB.getDashboardStats(
        ownerUserId ?? undefined
      );

      const total_amount = Number(raw?.total_amount ?? 0);
      const paid_amount = Number(raw?.paid_amount ?? 0);
      const unpaid_amount = Math.max(0, total_amount - paid_amount);

      setStats({
        total_teams: Number(raw?.total_teams ?? 0),
        total_players: Number(raw?.total_players ?? 0),
        active_fines: Number(raw?.active_fines ?? 0),
        total_amount,
        paid_amount,
        unpaid_amount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ownerUserId]);

  useEffect(() => {
    enabled ? loadStats() : setLoading(false);
  }, [enabled, loadStats]);

  return { stats, loading, refreshStats: loadStats };
};