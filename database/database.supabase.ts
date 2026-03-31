import { supabase } from '@/lib/supabase';
import { cancelFineDueNotificationByFineId } from '@/utils/notifications';

/* =========================
 *        TIPI
 * ========================= */

// User ora ha id UUID da Supabase Auth
export type User = {
  id: string; // UUID
  role: 'mister' | 'player';
  nickname: string;
  display_nickname?: string | null;
  player_id?: number | null;
  created_at: string;
};

export type Team = {
  id: number;
  name: string;
  description?: string | null;
  season_year?: string | null;
  category?: string | null;
  color: string;
  logo_uri?: string | null;
  owner_user_id: string; // UUID del profilo
  created_at: string;
  password_hash?: string | null;
};

export type Player = {
  id: number;
  name: string;
  surname?: string;
  number: string;
  position: string;
  team_id?: number | null;
  team_name?: string | null;
  team_color?: string | null;
  created_at: string;
  active_fines?: number;
  total_unpaid?: number;
  is_taken?: number;
};

export type Fine = {
  id: number;
  player_id: number;
  type: string;
  amount: number;
  description?: string | null;
  due_date: string;
  is_paid: boolean;
  paid_at?: string | null;
  created_at: string;
  player_name?: string;
  player_number?: string;
  team_name?: string;
  team_color?: string;
};

export type PlayerAttendanceSummary = {
  present: number;
  late: number;
  injured: number;
  absent_justified: number;
  absent_unjustified: number;
  sick: number;
  total_sessions: number;
};

export type PlayerAttendanceHistory = {
  date: string;
  status: AttendanceStatus;
};

export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'injured'
  | 'absent_justified'
  | 'absent_unjustified'
  | 'sick'
  | 'riposo';

export type TeamAttendanceRow = {
  player_id: number;
  player_name: string;
  player_first_name?: string;
  player_surname?: string;
  player_number: string;
  player_position: string;
  attendance_status: AttendanceStatus | null;
};

/* =========================
 *   INIZIALIZZAZIONE (NO-OP per Supabase)
 * ========================= */

let initialized = false;

export const initDatabase = async () => {
  if (initialized) return;
  console.log('[DB] Supabase client ready');
  initialized = true;
};

export const getDb = () => null; // Legacy compatibility
export const getDatabaseInstance = async () => null;

/* =========================
 *   USERS / PROFILES DB
 * ========================= */

export const usersDB = {
  async findByNickname(nickname: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', nickname)
      .single();
    
    if (error) {
      console.error('[usersDB] findByNickname error:', error);
      return null;
    }
    
    return data as User;
  },

  async create(user: Omit<User, 'id' | 'created_at'>): Promise<string | null> {
    // La creazione è gestita da AuthContext con supabase.auth.signUp
    console.warn('[usersDB] create() should not be called directly with Supabase');
    return null;
  },

  async updateDisplayNickname(userId: string, displayNickname: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ display_nickname: displayNickname })
      .eq('id', userId);
    
    if (error) {
      console.error('[usersDB] updateDisplayNickname error:', error);
      return false;
    }
    
    return true;
  },

  async linkPlayer(userId: string, playerId: number): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ player_id: playerId })
      .eq('id', userId);
    
    if (error) {
      console.error('[usersDB] linkPlayer error:', error);
      return false;
    }
    
    return true;
  },

  async unlinkPlayer(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ player_id: null })
      .eq('id', userId);
    
    if (error) {
      console.error('[usersDB] unlinkPlayer error:', error);
      return false;
    }
    
    return true;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('delete_my_account');

    if (error || data !== true) {
      console.error('[usersDB] deleteUser error:', error ?? 'RPC returned false');
      return false;
    }

    await supabase.auth.signOut();
    return true;
  },

  async deleteAccount(userId: string): Promise<boolean> {
    return this.deleteUser(userId);
  },
};

/* =========================
 *      TEAMS DB
 * ========================= */

export const teamsDB = {
  isValidOwnerId(ownerId: string | null | undefined): ownerId is string {
    if (!ownerId) return false;
    const trimmed = ownerId.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
      return false;
    }
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed);
  },

  async getAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('[teamsDB] getAll error:', error);
      return [];
    }
    
    return data as Team[];
  },

  async getAllByOwner(ownerId: string): Promise<Team[]> {
    if (!this.isValidOwnerId(ownerId)) {
      return [];
    }

    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players(
          id,
          fines(id, is_paid)
        )
      `)
      .eq('owner_user_id', ownerId)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('[teamsDB] getAllByOwner error:', error);
      return [];
    }

    // Trasforma i dati aggregati in players_count e active_fines
    return (data || []).map((team: any) => {
      const playersCount = (team.players || []).length;
      
      // Conta tutte le multe non pagate di tutti i giocatori del team
      const activeFines = (team.players || [])
        .flatMap((player: any) => player.fines || [])
        .filter((fine: any) => !fine.is_paid)
        .length;
      
      // Rimuovi i campi aggregati e aggiungi i conteggi
      const { players, ...rest } = team;
      
      return {
        ...rest,
        players_count: playersCount,
        active_fines: activeFines,
      };
    }) as Team[];
  },

  async getById(teamId: number): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    
    if (error) {
      console.error('[teamsDB] getById error:', error);
      return null;
    }
    
    return data as Team;
  },

  async search(query: string): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('[teamsDB] search error:', error);
      return [];
    }

    return (data || []) as Team[];
  },

  async checkPassword(teamId: number, hash: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('teams')
      .select('password_hash')
      .eq('id', teamId)
      .single();

    if (error || !data) return false;
    return (data as any).password_hash === hash;
  },

  async teamNameExists(
    ownerId: string,
    name: string,
    seasonYear?: string,
    category?: string,
    excludeTeamId?: number
  ): Promise<boolean> {
    let query = supabase
      .from('teams')
      .select('id')
      .eq('owner_user_id', ownerId)
      .ilike('name', name.trim());

    if (seasonYear?.trim()) {
      query = query.eq('season_year', seasonYear.trim());
    }

    if (category?.trim()) {
      query = query.eq('category', category.trim());
    }

    if (typeof excludeTeamId === 'number') {
      query = query.neq('id', excludeTeamId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      console.error('[teamsDB] teamNameExists error:', error);
      return false;
    }

    return (data || []).length > 0;
  },

  async create(team: Omit<Team, 'id' | 'created_at'>): Promise<number | null> {
    // Controlla duplicati per mister + società + stagione + categoria
    const nameExists = await this.teamNameExists(
      team.owner_user_id,
      team.name,
      team.season_year ?? undefined,
      team.category ?? undefined
    );
    if (nameExists) {
      // Identità squadra già esistente - validazione attesa, non errore di sistema
      return null;
    }

    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select('id')
      .single();
    
    if (error) {
      console.error('[teamsDB] create error:', error);
      return null;
    }
    
    return data.id;
  },

  async update(teamId: number, updates: Partial<Team>): Promise<boolean> {
    const { error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId);
    
    if (error) {
      console.error('[teamsDB] update error:', error);
      return false;
    }
    
    return true;
  },

  async delete(teamId: number): Promise<boolean> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    if (error) {
      console.error('[teamsDB] delete error:', error);
      return false;
    }
    
    return true;
  },
};

/* =========================
 *     PLAYERS DB
 * ========================= */

export const playersDB = {
  async getAll(): Promise<Player[]> {
    const { data: players, error } = await supabase
      .from('players')
      .select(`
        *,
        team:teams(name, color)
      `)
      .order('surname', { ascending: true });
    
    if (error) {
      console.error('[playersDB] getAll error:', error);
      return [];
    }
    
    // Calcola multe attive e totale non pagato
    const enriched = await Promise.all(
      players.map(async (p: any) => {
        const fines = await finesDB.getByPlayer(p.id);
        const unpaid = fines.filter((f) => !f.is_paid);
        return {
          ...p,
          team_name: p.team?.name,
          team_color: p.team?.color,
          active_fines: unpaid.length,
          total_unpaid: unpaid.reduce((sum, f) => sum + f.amount, 0),
        };
      })
    );
    
    return enriched as Player[];
  },

  async getByTeam(teamId: number): Promise<Player[]> {
    const { data: players, error } = await supabase
      .from('players')
      .select(`
        *,
        team:teams(name, color)
      `)
      .eq('team_id', teamId)
      .order('surname', { ascending: true });
    
    if (error) {
      console.error('[playersDB] getByTeam error:', error);
      return [];
    }
    
    // Calcola multe
    const enriched = await Promise.all(
      players.map(async (p: any) => {
        const fines = await finesDB.getByPlayer(p.id);
        const unpaid = fines.filter((f) => !f.is_paid);
        return {
          ...p,
          team_name: p.team?.name,
          team_color: p.team?.color,
          active_fines: unpaid.length,
          total_unpaid: unpaid.reduce((sum, f) => sum + f.amount, 0),
        };
      })
    );
    
    return enriched as Player[];
  },

  async getByTeamPublic(teamId: number): Promise<Player[]> {
    const { data, error } = await supabase.rpc('get_joinable_team_players', {
      p_team_id: teamId,
    });

    if (error) {
      console.error('[playersDB] getByTeamPublic error:', error);
      return [];
    }

    return (data || []).map((player: any) => ({
      ...player,
      active_fines: Number(player.active_fines ?? 0),
      total_unpaid: Number(player.total_unpaid ?? 0),
      is_taken: Number(player.is_taken ?? 0),
    })) as Player[];
  },

  async getById(playerId: number): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select(`
        *,
        team:teams(name, color)
      `)
      .eq('id', playerId)
      .maybeSingle();
    
    if (error) {
      console.error('[playersDB] getById error:', error);
      return null;
    }

    if (!data) {
      return null;
    }
    
    const fines = await finesDB.getByPlayer(playerId);
    const unpaid = fines.filter((f) => !f.is_paid);
    
    return {
      ...data,
      team_name: data.team?.name,
      team_color: data.team?.color,
      active_fines: unpaid.length,
      total_unpaid: unpaid.reduce((sum, f) => sum + f.amount, 0),
    } as Player;
  },

  async create(player: Omit<Player, 'id' | 'created_at'>): Promise<number | null> {
    const { data, error } = await supabase
      .from('players')
      .insert({
        name: player.name,
        surname: player.surname,
        number: player.number ?? '0',
        position: player.position,
        team_id: player.team_id,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('[playersDB] create error:', error);
      return null;
    }
    
    return data.id;
  },

  async update(playerId: number, updates: Partial<Player>): Promise<boolean> {
    const { error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', playerId);
    
    if (error) {
      console.error('[playersDB] update error:', error);
      return false;
    }
    
    return true;
  },

  async delete(playerId: number): Promise<boolean> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);
    
    if (error) {
      console.error('[playersDB] delete error:', error);
      return false;
    }
    
    return true;
  },
};

/* =========================
 *       FINES DB
 * ========================= */

export const finesDB = {
  async getAll(): Promise<Fine[]> {
    const { data, error } = await supabase
      .from('fines')
      .select(`
        *,
        player:players(name, surname, number, team:teams(name, color))
      `)
      .order('due_date', { ascending: false });
    
    if (error) {
      console.error('[finesDB] getAll error:', error);
      return [];
    }
    
    return data.map((f: any) => ({
      ...f,
      player_name: f.player?.surname
        ? `${f.player.surname} ${f.player.name}`
        : f.player?.name,
      player_number: f.player?.number,
      team_name: f.player?.team?.name,
      team_color: f.player?.team?.color,
    })) as Fine[];
  },

  async getByPlayer(playerId: number): Promise<Fine[]> {
    const { data, error } = await supabase
      .from('fines')
      .select(`
        *,
        player:players(name, surname, number, team:teams(name, color))
      `)
      .eq('player_id', playerId)
      .order('due_date', { ascending: false });
    
    if (error) {
      console.error('[finesDB] getByPlayer error:', error);
      return [];
    }
    
    return data.map((f: any) => ({
      ...f,
      player_name: f.player?.surname
        ? `${f.player.surname} ${f.player.name}`
        : f.player?.name,
      player_number: f.player?.number,
      team_name: f.player?.team?.name,
      team_color: f.player?.team?.color,
    })) as Fine[];
  },

  async getByTeam(teamId: number): Promise<Fine[]> {
    const { data: players } = await supabase
      .from('players')
      .select('id')
      .eq('team_id', teamId);
    
    if (!players || players.length === 0) return [];
    
    const playerIds = players.map((p) => p.id);
    
    const { data, error } = await supabase
      .from('fines')
      .select(`
        *,
        player:players(name, surname, number, team:teams(name, color))
      `)
      .in('player_id', playerIds)
      .order('due_date', { ascending: false });
    
    if (error) {
      console.error('[finesDB] getByTeam error:', error);
      return [];
    }
    
    return data.map((f: any) => ({
      ...f,
      player_name: f.player?.surname
        ? `${f.player.surname} ${f.player.name}`
        : f.player?.name,
      player_number: f.player?.number,
      team_name: f.player?.team?.name,
      team_color: f.player?.team?.color,
    })) as Fine[];
  },

  async getByTeamPublic(teamId: number): Promise<Fine[]> {
    return this.getByTeam(teamId);
  },

  async updatePaymentStatus(fineId: number, isPaid: boolean): Promise<boolean> {
    return this.update(fineId, { is_paid: isPaid, paid_at: isPaid ? new Date().toISOString() : null });
  },

  async getNotificationId(_ownerId: string, _fineId: number): Promise<string | null> {
    return null;
  },

  async setNotificationId(_ownerId: string, _fineId: number, _notificationId: string | null): Promise<boolean> {
    return true;
  },

  async create(fine: Omit<Fine, 'id' | 'created_at'>): Promise<number | null> {
    const { data, error } = await supabase
      .from('fines')
      .insert({
        player_id: fine.player_id,
        type: fine.type,
        amount: fine.amount,
        description: fine.description,
        due_date: fine.due_date,
        is_paid: fine.is_paid || false,
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('[finesDB] create error:', error);
      return null;
    }
    
    return data.id;
  },

  async update(fineId: number, updates: Partial<Fine>): Promise<boolean> {
    const { error } = await supabase
      .from('fines')
      .update(updates)
      .eq('id', fineId);
    
    if (error) {
      console.error('[finesDB] update error:', error);
      return false;
    }
    
    return true;
  },

  async delete(fineId: number): Promise<boolean> {
    await cancelFineDueNotificationByFineId(fineId);
    
    const { error } = await supabase
      .from('fines')
      .delete()
      .eq('id', fineId);
    
    if (error) {
      console.error('[finesDB] delete error:', error);
      return false;
    }
    
    return true;
  },
};

/* =========================
 *    TRAINING/ATTENDANCE DB
 * ========================= */

export const trainingDB = {
  async getSessionsByTeam(teamId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('team_id', teamId)
      .order('session_date', { ascending: false });
    
    if (error) {
      console.error('[trainingDB] getSessionsByTeam error:', error);
      return [];
    }
    
    return data || [];
  },

  async getSessionsByMonth(teamId: number, yearMonth: string): Promise<any[]> {
    const [y, m] = yearMonth.split('-').map(Number);
    if (!y || !m || m < 1 || m > 12) {
      console.error('[trainingDB] getSessionsByMonth invalid yearMonth:', yearMonth);
      return [];
    }

    const monthStart = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-01`;
    const nextMonthDate = new Date(Date.UTC(y, m, 1));
    const nextYear = nextMonthDate.getUTCFullYear();
    const nextMonth = nextMonthDate.getUTCMonth() + 1;
    const nextMonthStart = `${String(nextYear).padStart(4, '0')}-${String(nextMonth).padStart(2, '0')}-01`;

    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('team_id', teamId)
      .gte('session_date', monthStart)
      .lt('session_date', nextMonthStart)
      .order('session_date', { ascending: true });
    
    if (error) {
      console.error('[trainingDB] getSessionsByMonth error:', error);
      return [];
    }
    
    return data || [];
  },

  async createSession(session: any): Promise<number | null> {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert(session)
      .select('id')
      .single();
    
    if (error) {
      console.error('[trainingDB] createSession error:', error);
      return null;
    }
    
    return data.id;
  },

  async deleteSession(sessionId: number): Promise<boolean> {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', sessionId);
    
    if (error) {
      console.error('[trainingDB] deleteSession error:', error);
      return false;
    }
    
    return true;
  },

  async getAttendanceBySession(sessionId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        player:players(id, name, surname, number, position)
      `)
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('[trainingDB] getAttendanceBySession error:', error);
      return [];
    }
    
    return data || [];
  },

  async upsertAttendance(record: any): Promise<boolean> {
    const { error } = await supabase
      .from('attendance_records')
      .upsert(record, { onConflict: 'session_id,player_id' });
    
    if (error) {
      console.error('[trainingDB] upsertAttendance error:', error);
      return false;
    }
    
    return true;
  },

  async setPlayerAttendance(params: {
    team_id: number;
    session_date: string;
    player_id: number;
    status: AttendanceStatus;
    created_by: string;
  }): Promise<boolean> {
    const { team_id, session_date, player_id, status, created_by } = params;

    const { data: existingSessions, error: existingSessionError } = await supabase
      .from('training_sessions')
      .select('id')
      .eq('team_id', team_id)
      .eq('session_date', session_date)
      .order('id', { ascending: true });

    if (existingSessionError) {
      console.error('[trainingDB] setPlayerAttendance session lookup error:', existingSessionError);
      return false;
    }

    let sessionId = (existingSessions && existingSessions.length > 0)
      ? (existingSessions[0] as any).id
      : undefined;

    if (existingSessions && existingSessions.length > 1) {
      console.warn(
        '[trainingDB] setPlayerAttendance duplicate sessions found, using first one:',
        { team_id, session_date, count: existingSessions.length, pickedSessionId: sessionId }
      );
    }

    if (!sessionId) {
      const { data: createdSession, error: createSessionError } = await supabase
        .from('training_sessions')
        .insert({
          team_id,
          session_date,
          created_by,
        })
        .select('id')
        .single();

      if (createSessionError || !createdSession) {
        console.error('[trainingDB] setPlayerAttendance create session error:', createSessionError);
        return false;
      }

      sessionId = createdSession.id;
    }

    const { error: upsertError } = await supabase
      .from('attendance_records')
      .upsert(
        {
          session_id: sessionId,
          player_id,
          status,
        },
        { onConflict: 'session_id,player_id' }
      );

    if (upsertError) {
      console.error('[trainingDB] setPlayerAttendance upsert error:', upsertError);
      return false;
    }

    return true;
  },

  async getPlayerAttendanceHistory(playerId: number): Promise<PlayerAttendanceHistory[]> {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        status,
        session:training_sessions(session_date)
      `)
      .eq('player_id', playerId);
    
    if (error) {
      console.error('[trainingDB] getPlayerAttendanceHistory error:', error);
      return [];
    }
    
    return (data || [])
      .map((r: any) => ({
        date: r.session?.session_date || '',
        status: r.status,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async getPlayerAttendanceSummary(playerId: number): Promise<PlayerAttendanceSummary> {
    const history = await this.getPlayerAttendanceHistory(playerId);
    
    const summary: PlayerAttendanceSummary = {
      present: 0,
      late: 0,
      injured: 0,
      absent_justified: 0,
      absent_unjustified: 0,
      sick: 0,
      total_sessions: history.length,
    };
    
    history.forEach((h) => {
      if (h.status === 'present') summary.present++;
      else if (h.status === 'late') summary.late++;
      else if (h.status === 'injured') summary.injured++;
      else if (h.status === 'absent_justified') summary.absent_justified++;
      else if (h.status === 'absent_unjustified') summary.absent_unjustified++;
      else if (h.status === 'sick') summary.sick++;
    });
    
    return summary;
  },

  async getMonthAttendance(teamId: number, year: number, month: number): Promise<{ players: any[]; attendances: any[] }> {
    const mm = String(month).padStart(2, '0');
    const ym = `${year}-${mm}`;
    const players = await playersDB.getByTeam(teamId);
    const sessions = await this.getSessionsByMonth(teamId, ym);

    const attendances: Array<{ player_id: number; date: string; status: AttendanceStatus }> = [];
    for (const s of sessions) {
      const attendance = await this.getAttendanceBySession(s.id);
      for (const a of attendance) {
        attendances.push({
          player_id: a.player_id,
          date: s.session_date,
          status: a.status,
        });
      }
    }
    return { players, attendances };
  },

  async getTeamAttendanceForSession(teamId: number, sessionDate: string): Promise<TeamAttendanceRow[]> {
    // Prima ottieni i giocatori del team
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, surname, number, position')
      .eq('team_id', teamId)
      .order('surname', { ascending: true });
    
    if (playersError || !players) {
      console.error('[trainingDB] getTeamAttendanceForSession - players error:', playersError);
      return [];
    }
    
    // Poi ottieni la sessione
    const { data: session } = await supabase
      .from('training_sessions')
      .select('id')
      .eq('team_id', teamId)
      .eq('session_date', sessionDate)
      .single();
    
    if (!session) {
      return players.map((p: any) => ({
        player_id: p.id,
        player_name: p.surname ? `${p.surname} ${p.name}` : p.name,
        player_first_name: p.name,
        player_surname: p.surname,
        player_number: p.number,
        player_position: p.position,
        attendance_status: null,
      }));
    }
    
    // Ottieni le presenze
    const { data: attendance } = await supabase
      .from('attendance_records')
      .select('player_id, status')
      .eq('session_id', session.id);
    
    const attendanceMap = new Map(
      (attendance || []).map((a: any) => [a.player_id, a.status])
    );
    
    return players.map((p: any) => ({
      player_id: p.id,
      player_name: p.surname ? `${p.surname} ${p.name}` : p.name,
      player_first_name: p.name,
      player_surname: p.surname,
      player_number: p.number,
      player_position: p.position,
      attendance_status: attendanceMap.get(p.id) || null,
    }));
  },
};

/* =========================
 *       STATS DB
 * ========================= */

export const statsDB = {
  async getDashboardStats(ownerId: string): Promise<any> {
    const teams = await teamsDB.getAllByOwner(ownerId);
    const teamIds = teams.map((t) => t.id);
    
    if (teamIds.length === 0) {
      return {
        total_teams: 0,
        total_players: 0,
        active_fines: 0,
        total_amount: 0,
        paid_amount: 0,
        unpaid_amount: 0,
        total_unpaid: 0,
      };
    }
    
    const { data: players } = await supabase
      .from('players')
      .select('id')
      .in('team_id', teamIds);
    
    const playerIds = (players || []).map((p) => p.id);

    if (playerIds.length === 0) {
      return {
        total_teams: teams.length,
        total_players: 0,
        active_fines: 0,
        total_amount: 0,
        paid_amount: 0,
        unpaid_amount: 0,
        total_unpaid: 0,
      };
    }
    
    const { data: fines } = await supabase
      .from('fines')
      .select('amount, is_paid')
      .in('player_id', playerIds);
    
    const allFines = fines || [];
    const unpaidFines = (fines || []).filter((f) => !f.is_paid);
    const paidFines = (fines || []).filter((f) => !!f.is_paid);

    const totalAmount = allFines.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    const paidAmount = paidFines.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    const unpaidAmount = unpaidFines.reduce((sum, f) => sum + Number(f.amount || 0), 0);
    
    return {
      total_teams: teams.length,
      total_players: players?.length || 0,
      active_fines: unpaidFines.length,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      unpaid_amount: unpaidAmount,
      total_unpaid: unpaidAmount,
    };
  },
};

/* =========================
 *   EXPORT/CLEAR FUNCTIONS (Stub)
 * ========================= */

export const buildCsvForMister = async (ownerId: string): Promise<string> => {
  console.warn('[buildCsvForMister] Not implemented for Supabase yet');
  return '';
};

export const exportAllDataForMisterToCsv = async (ownerId: string): Promise<string> => {
  console.warn('[exportAllDataForMisterToCsv] Not implemented for Supabase yet');
  return '';
};

export const clearAllDataForMister = async (ownerUserId: string): Promise<void> => {
  const teams = await teamsDB.getAllByOwner(ownerUserId);
  const teamIds = teams.map((t) => t.id).filter((id) => Number.isFinite(id) && id > 0);

  if (teamIds.length === 0) {
    return;
  }

  // 1) Elimina i giocatori delle squadre del mister (cascade elimina le multe del player)
  const { error: playersError } = await supabase
    .from('players')
    .delete()
    .in('team_id', teamIds);

  if (playersError) {
    console.error('[clearAllDataForMister] players delete error:', playersError);
    throw playersError;
  }

  // 2) Elimina le squadre del mister (cascade elimina sessioni allenamento/attendance)
  const { error: teamsError } = await supabase
    .from('teams')
    .delete()
    .eq('owner_user_id', ownerUserId);

  if (teamsError) {
    console.error('[clearAllDataForMister] teams delete error:', teamsError);
    throw teamsError;
  }
};

export const deleteMisterAccount = async (ownerId: string): Promise<boolean> => {
  return await usersDB.deleteUser(ownerId);
};
