import { useEffect, useState, useCallback, useMemo } from 'react';
import * as Crypto from 'expo-crypto';

import {
  initDatabase,
  teamsDB,
  playersDB,
  finesDB,
  trainingDB,
  statsDB,
} from '@/database/database.supabase';
import type { AttendanceStatus, TeamAttendanceRow, PlayerAttendanceSummary, PlayerAttendanceHistory } from '@/database/database.supabase';

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
  const ownerUserId = useMemo(() => {
    if (user?.role !== 'mister') return null;
    const rawId = (user.id ?? '').trim();
    if (!rawId || rawId.toLowerCase() === 'null' || rawId.toLowerCase() === 'undefined') {
      return null;
    }
    return rawId;
  }, [user?.id, user?.role]);

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
      const data = await teamsDB.getAllByOwner(ownerUserId);
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

      const id = await teamsDB.create({
        ...rest,
          owner_user_id: ownerUserId,
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
      const success = await teamsDB.delete(id);
      if (success) await loadTeams();
      return success;
    },
    [ownerUserId, loadTeams]
  );

  const updateTeam = useCallback(
    async (teamId: number, teamData: Partial<TeamInput>): Promise<boolean> => {
      if (!ownerUserId) return false;

      const updateData: any = { ...teamData };

      // Se c'è una password, hashificare
      if (teamData.password !== undefined) {
        if (teamData.password) {
          updateData.password_hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            teamData.password
          );
        } else {
          updateData.password_hash = null;
        }
        delete updateData.password;
      }

      const success = await teamsDB.update(teamId, updateData);
      if (success) await loadTeams();
      return success;
    },
    [ownerUserId, loadTeams]
  );

  useEffect(() => {
    if (enabled) loadTeams();
    else setLoading(false);
  }, [enabled, loadTeams]);

  return { teams, loading, addTeam, deleteTeam, updateTeam, refreshTeams: loadTeams };
};

// ==================== PLAYERS (Mister) ====================
type PlayerInput = {
  name: string;
  surname: string;
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
        ? await playersDB.getByTeam(teamId!)
        : await playersDB.getAll();

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
      const id = await playersDB.create(playerData);
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
      const success = await playersDB.delete(id);
      if (success) await loadPlayers();
      return success;
    },
    [ownerUserId, loadPlayers]
  );

  const updatePlayer = useCallback(
    async (playerId: number, playerData: Partial<{ name: string; surname: string; position: string }>): Promise<boolean> => {
      if (!ownerUserId) return false;
      const success = await playersDB.update(playerId, playerData);
      if (success) await loadPlayers();
      return success;
    },
    [ownerUserId, loadPlayers]
  );

  useEffect(() => {
    if (enabled) loadPlayers();
    else setLoading(false);
  }, [enabled, loadPlayers]);

  return { players, loading, addPlayer, deletePlayer, updatePlayer, refreshPlayers: loadPlayers };
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
        : await finesDB.getAll();

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

      const id = await finesDB.create(fineData);
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

      const ok = await finesDB.update(id, { is_paid: isPaid, paid_at: isPaid ? new Date().toISOString() : null });
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
        const ok = await finesDB.delete(fineId);
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

// ==================== ATTENDANCE (Mister) ====================
export const useTeamAttendance = (
  teamId?: number,
  sessionDate?: string,
  deps: { enabled?: boolean } = {}
) => {
  const { user } = useAuth();
  const ownerUserId = user?.role === 'mister' ? user.id : null;

  const enabled =
    (deps.enabled ?? true) &&
    !!ownerUserId &&
    typeof teamId === 'number' &&
    teamId > 0 &&
    !!sessionDate;

  const [rows, setRows] = useState<TeamAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = useCallback(async () => {
    if (!enabled || !ownerUserId || !teamId || !sessionDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await trainingDB.getTeamAttendanceForSession(teamId, sessionDate);
      setRows(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, ownerUserId, teamId, sessionDate]);

  const setPlayerAttendance = useCallback(
    async (playerId: number, status: AttendanceStatus): Promise<boolean> => {
      if (!enabled || !ownerUserId || !teamId || !sessionDate) return false;

      const ok = await trainingDB.setPlayerAttendance({
        team_id: teamId,
        session_date: sessionDate,
        player_id: playerId,
        status,
        created_by: ownerUserId,
      });

      if (ok) await loadAttendance();
      return ok;
    },
    [enabled, ownerUserId, teamId, sessionDate, loadAttendance]
  );

  useEffect(() => {
    if (enabled) loadAttendance();
    else setLoading(false);
  }, [enabled, loadAttendance]);

  return { rows, loading, setPlayerAttendance, refreshAttendance: loadAttendance };
};

export const useTeamAttendancePublic = (
  teamId?: number,
  sessionDate?: string,
  deps: { enabled?: boolean } = {}
) => {
  const enabled =
    (deps.enabled ?? true) &&
    typeof teamId === 'number' &&
    teamId > 0 &&
    !!sessionDate;

  const [rows, setRows] = useState<TeamAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = useCallback(async () => {
    if (!enabled || !teamId || !sessionDate) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await trainingDB.getTeamAttendanceForSession(teamId, sessionDate);
      setRows(data);
    } catch (error) {
      console.error('Error loading public attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [enabled, teamId, sessionDate]);

  useEffect(() => {
    if (enabled) loadAttendance();
    else setLoading(false);
  }, [enabled, loadAttendance]);

  return { rows, loading, refreshAttendance: loadAttendance };
};

export const usePlayerAttendanceSummary = (teamId?: number, playerId?: number) => {
  const [summary, setSummary] = useState<PlayerAttendanceSummary>({
    present: 0,
    injured: 0,
    absent_justified: 0,
    absent_unjustified: 0,
    sick: 0,
    total_sessions: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!teamId || teamId <= 0 || !playerId || playerId <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await trainingDB.getPlayerAttendanceSummary(teamId, playerId);
      setSummary(data);
    } catch (error) {
      console.error('Error loading player attendance summary:', error);
    } finally {
      setLoading(false);
    }
  }, [teamId, playerId]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return { summary, loading, refreshSummary: loadSummary };
};

export const usePlayerAttendanceHistory = (teamId?: number, playerId?: number) => {
  const [history, setHistory] = useState<PlayerAttendanceHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!teamId || teamId <= 0 || !playerId || playerId <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await trainingDB.getPlayerAttendanceHistory(playerId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading player attendance history:', error);
    } finally {
      setLoading(false);
    }
  }, [teamId, playerId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { history, loading, refreshHistory: loadHistory };
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
      const raw: Partial<Record<string, unknown>> = await statsDB.getDashboardStats(ownerUserId!);

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

export const useMonthAttendanceExport = (teamId: number, year: number, month: number) => {
  const { isInitialized } = useDatabase();
  const enabled = isInitialized && teamId > 0;

  const loadMonthData = useCallback(async () => {
    if (!enabled) return null;
    const data = await trainingDB.getMonthAttendance(teamId, year, month);
    return data;
  }, [enabled, teamId, year, month]);

  return { loadMonthData };
};
