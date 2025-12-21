// database/database.ts
import * as SQLite from 'expo-sqlite';

/* =========================
 *        TIPI
 * ========================= */
export type User = {
  id: number;
  role: 'mister' | 'player';
  nickname: string;
  password_hash: string;
  player_id?: number | null;
  created_at: string;
};

export type Team = {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  owner_user_id: number | null; 
  created_at: string;
  password_hash?: string | null;
};

export type Player = {
  id: number;
  name: string;
  number: string;
  position: string;
  team_id?: number | null;
  team_name?: string | null;
  team_color?: string | null;
  created_at: string;
  active_fines?: number;
  total_unpaid?: number;
};

export type Fine = {
  id: number;
  player_id: number;
  type: string;
  amount: number;
  description?: string | null;
  due_date: string; // YYYY-MM-DD
  is_paid: 0 | 1;
  paid_at?: string | null;
  created_at: string;
  notification_id?: string | null;
  player_name?: string;
  player_number?: string;
  team_name?: string;
  team_color?: string;
};

/* =========================
 *     INTERFACCIA ASYNC
 * ========================= */
type RunResult = { lastInsertRowId?: number };
type AsyncDB = {
  execAsync: (sql: string, params?: any[]) => Promise<void>;
  runAsync: (sql: string, params?: any[]) => Promise<RunResult>;
  getAllAsync: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  getFirstAsync: <T = any>(sql: string, params?: any[]) => Promise<T | null>;
};

/* =========================
 *   ADAPTER LEGACY (WEBSQL)
 * ========================= */
function makeLegacyAdapter(name: string): AsyncDB {
  const websql: any = (SQLite as any).openDatabase(name);

  const execAsync: AsyncDB['execAsync'] = (sql, params = []) =>
    new Promise<void>((resolve, reject) => {
      websql.transaction(
        (tx: any) => {
          tx.executeSql(
            sql,
            params,
            () => {},
            (_tx: any, err: any) => {
              reject(err);
              return false;
            }
          );
        },
        (err: any) => reject(err),
        () => resolve()
      );
    });

  const runAsync: AsyncDB['runAsync'] = (sql, params = []) =>
    new Promise<RunResult>((resolve, reject) => {
      websql.transaction(
        (tx: any) => {
          tx.executeSql(
            sql,
            params,
            (_tx: any, res: any) => {
              resolve({ lastInsertRowId: res?.insertId ?? undefined });
            },
            (_tx: any, err: any) => {
              reject(err);
              return false;
            }
          );
        },
        (err: any) => reject(err)
      );
    });

  const getAllAsync: AsyncDB['getAllAsync'] = (sql, params = []) =>
    new Promise<any[]>((resolve, reject) => {
      websql.transaction(
        (tx: any) => {
          tx.executeSql(
            sql,
            params,
            (_tx: any, res: any) => resolve(res?.rows?._array ?? []),
            (_tx: any, err: any) => {
              reject(err);
              return false;
            }
          );
        },
        (err: any) => reject(err)
      );
    });

  const getFirstAsync: AsyncDB['getFirstAsync'] = async (sql, params = []) => {
    const rows = await getAllAsync(sql, params);
    return rows[0] ?? null;
  };

  return { execAsync, runAsync, getAllAsync, getFirstAsync };
}

/* =========================
 *      DB FACTORY
 * ========================= */
let dbPromise: Promise<AsyncDB> | null = null;

async function makeDb(): Promise<AsyncDB> {
  const openAsync = (SQLite as any).openDatabaseAsync;
  const openLegacy = (SQLite as any).openDatabase;

  if (typeof openAsync === 'function') {
    // API moderna disponibile
    const db = await openAsync('fines_management.db');
    return db as AsyncDB;
  }
  if (typeof openLegacy === 'function') {
    // Fallback WebSQL
    return makeLegacyAdapter('fines_management.db');
  }
  throw new Error('expo-sqlite non disponibile: né openDatabaseAsync né openDatabase trovati');
}

const getDb = () => (dbPromise ??= makeDb());

/* =========================
 *     INIT DATABASE
 * ========================= */
export const initDatabase = async () => {
  const db = await getDb();

  try {
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    // USERS
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL CHECK(role IN ('mister','player')),
        nickname TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        player_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE SET NULL
      );
    `);
    await db.execAsync(`CREATE UNIQUE INDEX IF NOT EXISTS ux_users_nickname ON users(nickname);`);

    // TEAMS 
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Aggiungi colonna owner_user_id se manca
    await db.execAsync(`
      ALTER TABLE teams ADD COLUMN owner_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    `).catch(() => {}); // ignora se già esiste
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_user_id);`);

    // Aggiungi colonna password_hash se manca
    await db.execAsync(`
      ALTER TABLE teams ADD COLUMN password_hash TEXT;
    `).catch(() => {}); // ignora se già esiste

    // NOME UNIVOCO
    await db.execAsync(`
      CREATE UNIQUE INDEX IF NOT EXISTS ux_teams_owner_name
      ON teams (owner_user_id, name COLLATE NOCASE);
    `);


    // PLAYERS
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        number TEXT NOT NULL,
        position TEXT NOT NULL,
        team_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE SET NULL
      );
    `);

    // FINES
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS fines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        due_date TEXT NOT NULL,            -- YYYY-MM-DD
        is_paid INTEGER DEFAULT 0,         -- 0/1
        paid_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE
      );
    `);

    // Aggiungi colonna notification_id se manca
    await db.execAsync(`
      ALTER TABLE fines ADD COLUMN notification_id TEXT;
    `).catch(() => {}); // ignora se già esiste

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_fines_notif ON fines(notification_id);`);
        
    // INDICI
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_players_team ON players (team_id);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_fines_player ON fines (player_id);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_fines_paid ON fines (is_paid, due_date);`);

    // Niente seed di team globali: ogni mister crea i propri team
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

/* =========================
 *        USERS DB
 * ========================= */
export const usersDB = {
  create: async (u: {
    role: 'mister' | 'player';
    nickname: string;
    password_hash: string;
    player_id?: number | null;
  }) => {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO users (role, nickname, password_hash, player_id)
       VALUES (?, ?, ?, ?)`,
      [u.role, u.nickname, u.password_hash, u.player_id ?? null]
    );
    return res.lastInsertRowId ?? null;
  },

  findByNickname: async (nickname: string) => {
    const db = await getDb();
    return await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE nickname = ?`,
      [nickname]
    );
  },

  linkPlayer: async (userId: number, playerId: number | null) => {
    const db = await getDb();
    await db.runAsync(
      `UPDATE users SET player_id = ? WHERE id = ?`,
      [playerId, userId]
    );
    return true;
  },

  findById: async (id: number) => {
    const db = await getDb();
    return await db.getFirstAsync<User>(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
  },
};

/* =========================
 *        TEAMS DB
 * ========================= */
export const teamsDB = {
  // tutte le squadre del mister
  getAll: async (ownerId: number): Promise<(Team & { players_count: number; active_fines: number })[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT t.*,
               t.password_hash,
               COUNT(DISTINCT p.id) AS players_count,
               COUNT(CASE WHEN f.is_paid = 0 THEN 1 END) AS active_fines
        FROM teams t
        LEFT JOIN players p ON t.id = p.team_id
        LEFT JOIN fines   f ON p.id = f.player_id
        WHERE t.owner_user_id = ?
        GROUP BY t.id
        ORDER BY t.created_at ASC;
        `,
        [ownerId]
      );
    } catch (error) {
      console.error('Error getting teams:', error);
      return [];
    }
  },

  getAllNames: async (ownerId: number): Promise<{ id: number; name: string }[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT id, name
        FROM teams
        WHERE owner_user_id = ?
        ORDER BY name ASC;
        `,
        [ownerId]
      );
    } catch (error) {
      console.error('Error getting team names:', error);
      return [];
    }
  },

  create: async (
    ownerId: number,
    team: { name: string; description: string; color: string; password_hash?: string | null }
  ) => {
    const db = await getDb();
    try {
      const trimmedName = team.name.trim();

      // 🔥 NUOVO: controllo globale, NON più per owner
      const existing = await db.getFirstAsync<{ id: number }>(
        `
        SELECT id
        FROM teams
        WHERE LOWER(name) = LOWER(?);
        `,
        [trimmedName]
      );

      if (existing) {
        console.warn('Team name already used (global):', trimmedName);
        // restituiamo null così l'hook `useTeams.addTeam` sa che non è andata
        return null;
      }

      const result = await db.runAsync(
        `INSERT INTO teams (name, description, color, owner_user_id, password_hash)
         VALUES (?, ?, ?, ?, ?)`,
        [trimmedName, team.description, team.color, ownerId, team.password_hash ?? null]
      );
      return result.lastInsertRowId ?? null;
    } catch (error) {
      console.error('Error creating team:', error);
      return null;
    }
  },

delete: async (ownerId: number, id: number) => {
  const db = await getDb();
  try {
    // 1) Elimina tutte le multe dei giocatori della squadra (solo se la squadra è del mister)
    await db.runAsync(
      `
      DELETE FROM fines
      WHERE player_id IN (
        SELECT p.id
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.id = ? AND t.owner_user_id = ?
      );
      `,
      [id, ownerId]
    );

    // 2) Elimina tutti i giocatori della squadra (sempre solo di quel mister)
    await db.runAsync(
      `
      DELETE FROM players
      WHERE team_id IN (
        SELECT t.id
        FROM teams t
        WHERE t.id = ? AND t.owner_user_id = ?
      );
      `,
      [id, ownerId]
    );

    // 3) Elimina la squadra
    await db.runAsync(
      `
      DELETE FROM teams
      WHERE id = ? AND owner_user_id = ?;
      `,
      [id, ownerId]
    );

    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    return false;
  }
},

    // cerca squadre per nome (case-insensitive)
  search: async (query: string): Promise<Team[]> => {
    const db = await getDb();
    const like = `%${query.toLowerCase()}%`;
    return await db.getAllAsync<Team>(
      `
      SELECT id, name, description, color, owner_user_id, created_at, password_hash
      FROM teams
      WHERE LOWER(name) LIKE ?
      ORDER BY name ASC
      LIMIT 30;
      `,
      [like]
    );
  },

  // dettaglio singola squadra
  getById: async (id: number): Promise<Team | null> => {
    const db = await getDb();
    return await db.getFirstAsync<Team>(
      `SELECT id, name, description, color, owner_user_id, created_at, password_hash
       FROM teams WHERE id = ?`,
      [id]
    );
  },

  // verifica lato DB: ok se nessuna password, oppure hash combacia
  checkPassword: async (teamId: number, passwordHash: string): Promise<boolean> => {
    const db = await getDb();
    const row = await db.getFirstAsync<{ id: number }>(
      `
      SELECT id
      FROM teams
      WHERE id = ?
        AND (password_hash IS NULL OR password_hash = ?)
      `,
      [teamId, passwordHash]
    );
    return !!row;
  },

};

/* =========================
 *       PLAYERS DB
 * ========================= */
export const playersDB = {
  // tutti i players delle squadre del mister
  getAll: async (ownerId: number): Promise<Player[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT p.*,
               t.name  AS team_name,
               t.color AS team_color,
               COUNT(CASE WHEN f.is_paid = 0 THEN 1 END)                   AS active_fines,
               COALESCE(SUM(CASE WHEN f.is_paid = 0 THEN f.amount END), 0) AS total_unpaid
        FROM players p
        JOIN teams t ON p.team_id = t.id
        LEFT JOIN fines f ON p.id = f.player_id
        WHERE t.owner_user_id = ?
        GROUP BY p.id
        ORDER BY p.name ASC;
      `,
        [ownerId]
      );
    } catch (error) {
      console.error('Error getting players:', error);
      return [];
    }
  },

  // players di un team del mister
  getByTeam: async (teamId: number, ownerId: number): Promise<Player[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT p.*,
               t.name  AS team_name,
               t.color AS team_color,
               COUNT(CASE WHEN f.is_paid = 0 THEN 1 END)                   AS active_fines,
               COALESCE(SUM(CASE WHEN f.is_paid = 0 THEN f.amount END), 0) AS total_unpaid
        FROM players p
        JOIN teams t ON p.team_id = t.id
        LEFT JOIN fines f ON p.id = f.player_id
        WHERE p.team_id = ? AND t.owner_user_id = ?
        GROUP BY p.id
        ORDER BY p.name ASC;
      `,
        [teamId, ownerId]
      );
    } catch (error) {
      console.error('Error getting players by team:', error);
      return [];
    }
  },

  create: async (ownerId: number, player: { name: string; number: string; position: string; team_id: number }) => {
    const db = await getDb();
    try {
      // verifica che il team appartenga al mister
      const team = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM teams WHERE id = ? AND owner_user_id = ?`,
        [player.team_id, ownerId]
      );
      if (!team) return null;

      const result = await db.runAsync(
        'INSERT INTO players (name, number, position, team_id) VALUES (?, ?, ?, ?)',
        [player.name, player.number, player.position, player.team_id]
      );
      return result.lastInsertRowId ?? null;
    } catch (error) {
      console.error('Error creating player:', error);
      return null;
    }
  },

delete: async (ownerId: number, id: number) => {
  const db = await getDb();
  try {
    // 1) Cancello tutte le multe del giocatore, MA solo se appartiene a un team del mister
    await db.runAsync(
      `
      DELETE FROM fines
      WHERE player_id IN (
        SELECT p.id
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE p.id = ? AND t.owner_user_id = ?
      );
      `,
      [id, ownerId]
    );

    // 2) Ora posso cancellare il giocatore in sicurezza
    await db.runAsync(
      `
      DELETE FROM players
      WHERE id = ?
        AND team_id IN (SELECT id FROM teams WHERE owner_user_id = ?);
      `,
      [id, ownerId]
    );

    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
},


    // lato player: solo lettura giocatori del team (no filtro owner)
  getByTeamPublic: async (teamId: number): Promise<Player[]> => {
    const db = await getDb();
    return await db.getAllAsync<Player>(
      `
      SELECT p.*,
             t.name  AS team_name,
             t.color AS team_color,
             COUNT(CASE WHEN f.is_paid = 0 THEN 1 END)                   AS active_fines,
             COALESCE(SUM(CASE WHEN f.is_paid = 0 THEN f.amount END), 0) AS total_unpaid
      FROM players p
      JOIN teams t ON p.team_id = t.id
      LEFT JOIN fines f ON p.id = f.player_id
      WHERE p.team_id = ?
      GROUP BY p.id
      ORDER BY p.name ASC;
      `,
      [teamId]
    );
  },

};

/* =========================
 *        FINES DB
 * ========================= */
export const finesDB = {
  getAll: async (ownerId: number): Promise<Fine[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT f.*,
               p.name   AS player_name,
               p.number AS player_number,
               t.name   AS team_name,
               t.color  AS team_color
        FROM fines f
        JOIN players p ON f.player_id = p.id
        JOIN teams   t ON p.team_id = t.id
        WHERE t.owner_user_id = ?
        ORDER BY f.created_at DESC;
      `,
        [ownerId]
      );
    } catch (error) {
      console.error('Error getting fines:', error);
      return [];
    }
  },

  getByPlayer: async (playerId: number): Promise<Fine[]> => {
    const db = await getDb();
    try {
      return await db.getAllAsync(
        `
        SELECT f.*,
               p.name   AS player_name,
               p.number AS player_number
        FROM fines f
        JOIN players p ON f.player_id = p.id
        WHERE f.player_id = ?
        ORDER BY f.created_at DESC;
      `,
        [playerId]
      );
    } catch (error) {
      console.error('Error getting fines by player:', error);
      return [];
    }
  },

  create: async (
    ownerId: number,
    fine: { player_id: number; type: string; amount: number; description?: string; due_date: string }
  ) => {
    const db = await getDb();
    try {
      const ok = await db.getFirstAsync<{ id: number }>(
        `
        SELECT p.id
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE p.id = ? AND t.owner_user_id = ?
      `,
        [fine.player_id, ownerId]
      );
      if (!ok) return null;

      const res = await db.runAsync(
        `INSERT INTO fines (player_id, type, amount, description, due_date)
         VALUES (?, ?, ?, ?, ?)`,
        [fine.player_id, fine.type, fine.amount, fine.description || '', fine.due_date]
      );
      return res.lastInsertRowId ?? null;
    } catch (error) {
      console.error('Error creating fine:', error);
      return null;
    }
  },

  updatePaymentStatus: async (ownerId: number, id: number, isPaid: boolean) => {
    const db = await getDb();
    try {
      const paidAt = isPaid ? new Date().toISOString() : null;
      await db.runAsync(
        `
        UPDATE fines
        SET is_paid = ?, paid_at = ?
        WHERE id = ?
          AND player_id IN (
            SELECT p.id
            FROM players p
            JOIN teams t ON p.team_id = t.id
            WHERE t.owner_user_id = ?
          );
      `,
        [isPaid ? 1 : 0, paidAt, id, ownerId]
      );
      return true;
    } catch (error) {
      console.error('Error updating fine payment status:', error);
      return false;
    }
  },

  delete: async (ownerId: number, id: number) => {
    const db = await getDb();
    try {
      await db.runAsync(
        `
        DELETE FROM fines
        WHERE id = ?
          AND player_id IN (
            SELECT p.id
            FROM players p
            JOIN teams t ON p.team_id = t.id
            WHERE t.owner_user_id = ?
          );
      `,
        [id, ownerId]
      );
      return true;
    } catch (error) {
      console.error('Error deleting fine:', error);
      return false;
    }
  },

  getByTeamPublic: async (teamId: number): Promise<Fine[]> => {
    const db = await getDb();
    return await db.getAllAsync<Fine>(
      `
      SELECT f.*,
             p.name   AS player_name,
             p.number AS player_number
      FROM fines f
      JOIN players p ON f.player_id = p.id
      WHERE p.team_id = ?
      ORDER BY f.created_at DESC;
      `,
      [teamId]
    );
  },

  // salva notificationId nella multa
  setNotificationId: async (ownerId: number, fineId: number, notificationId: string | null) => {
    const db = await getDb();
    try {
      await db.runAsync(
        `
        UPDATE fines
        SET notification_id = ?
        WHERE id = ?
          AND player_id IN (
            SELECT p.id
            FROM players p
            JOIN teams t ON p.team_id = t.id
            WHERE t.owner_user_id = ?
          );
        `,
        [notificationId, fineId, ownerId]
      );
      return true;
    } catch (e) {
      console.error('Error setting fine notification_id:', e);
      return false;
    }
  },

  // recupera notificationId 
  getNotificationId: async (ownerId: number, fineId: number): Promise<string | null> => {
    const db = await getDb();
    const row = await db.getFirstAsync<{ notification_id: string | null }>(
      `
      SELECT f.notification_id AS notification_id
      FROM fines f
      JOIN players p ON f.player_id = p.id
      JOIN teams t ON p.team_id = t.id
      WHERE f.id = ? AND t.owner_user_id = ?
      LIMIT 1;
      `,
      [fineId, ownerId]
    );
    return row?.notification_id ?? null;
  },
};

// =========================
//   EXPORT CSV PER MISTER
// =========================
export const buildCsvForMister = async (
  ownerId: number,
  teamId?: number   // 👈 opzionale: se passato, filtra per squadra
): Promise<string> => {
  const db = await getDb();

  // Costruiamo la WHERE dinamica
  const params: any[] = [ownerId];
  let extraTeamFilter = '';

  if (typeof teamId === 'number' && teamId > 0) {
    extraTeamFilter = ' AND t.id = ?';
    params.push(teamId);
  }

  // Prendiamo tutte le multe del mister (eventualmente filtrate per team)
  const rows = await db.getAllAsync<{
    id: number;
    player_id: number;
    type: string;
    amount: number;
    description?: string | null;
    due_date: string;
    is_paid: 0 | 1;
    paid_at?: string | null;
    created_at: string;
    player_name?: string | null;
    player_number?: string | null;
    team_name?: string | null;
  }>(
    `
    SELECT f.*,
           p.name   AS player_name,
           p.number AS player_number,
           t.name   AS team_name
    FROM fines f
    JOIN players p ON f.player_id = p.id
    JOIN teams   t ON p.team_id = t.id
    WHERE t.owner_user_id = ?${extraTeamFilter}
    ORDER BY f.created_at DESC;
    `,
    params
  );

  // Funzione per "sanitizzare" i campi nel CSV
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return '""';
    const s = String(v).replace(/"/g, '""');
    return `"${s}"`;
  };

  // Formattazione date in stile italiano
  const formatDate = (isoLike: string | null | undefined) => {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateTime = (isoLike: string | null | undefined) => {
    if (!isoLike) return '';
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  };

  // Intestazione colonne in italiano (senza colore team)
  const header = [
    'Squadra',
    'Giocatore',
    'Numero',
    'Tipo multa',
    'Importo (€)',
    'Data scadenza',
    'Pagata',
    'Data pagamento',
    'Creata il',
  ].join(',');

  const lines = rows.map((r) =>
    [
      esc(r.team_name ?? ''),
      esc(r.player_name ?? ''),
      esc(r.player_number ?? ''),
      esc(r.type),
      // importo in formato "12,34"
      esc(
        typeof r.amount === 'number'
          ? r.amount.toFixed(2).replace('.', ',')
          : String(r.amount)
      ),
      esc(formatDate(r.due_date)),
      esc(r.is_paid ? 'Sì' : 'No'),
      esc(r.paid_at ? formatDateTime(r.paid_at) : ''),
      esc(formatDateTime(r.created_at)),
    ].join(',')
  );


  
  return [header, ...lines].join('\n');
};

// =========================
//  EXPORT WRAPPER PER CSV
// =========================
export const exportAllDataForMisterToCsv = async (ownerId: number): Promise<string> => {
  try {
    const csv = await buildCsvForMister(ownerId);
    return csv;
  } catch (err) {
    console.error("Errore durante la creazione del CSV:", err);
    throw err;
  }
};

/* =========================
 *    WIPE DATI DEL MISTER
 * ========================= */

/**
 * Cancella TUTTE le squadre, i giocatori e le multe
 * appartenenti a un certo mister (owner_user_id).
 */
export const clearAllDataForMister = async (ownerUserId: number): Promise<void> => {
  const db = await getDb();

  try {
    // meglio in transazione
    await db.execAsync('BEGIN;');

    // 1) cancella tutte le multe dei giocatori dei team del mister
    await db.runAsync(
      `
      DELETE FROM fines
      WHERE player_id IN (
        SELECT p.id
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.owner_user_id = ?
      );
      `,
      [ownerUserId]
    );

    // 2) cancella tutti i giocatori dei team del mister
    await db.runAsync(
      `
      DELETE FROM players
      WHERE team_id IN (
        SELECT id
        FROM teams
        WHERE owner_user_id = ?
      );
      `,
      [ownerUserId]
    );

    // 3) cancella tutte le squadre del mister
    await db.runAsync(
      `
      DELETE FROM teams
      WHERE owner_user_id = ?;
      `,
      [ownerUserId]
    );

    await db.execAsync('COMMIT;');
  } catch (err) {
    console.error('Errore in clearAllDataForMister:', err);
    // se qualcosa va storto, roll back
    try {
      await db.execAsync('ROLLBACK;');
    } catch {}
    throw err;
  }
};

// Elimina TUTTI i dati + l'account del mister
export const deleteMisterAccount = async (ownerId: number): Promise<void> => {
  const db = await getDb();

  // 1) Prima ripuliamo tutte le squadre/giocatori/multe del mister
  await clearAllDataForMister(ownerId);

  // 2) Poi eliminiamo l'utente con ruolo "mister"
  await db.runAsync(
    `
    DELETE FROM users
    WHERE id = ?
      AND role = 'mister';
    `,
    [ownerId]
  );
};

/* =========================
 *          STATS
 * ========================= */
// Firma compatibile: se passi ownerId filtra, altrimenti globale (fallback)
export const statsDB = {
  getDashboardStats: async (ownerId?: number): Promise<{
    total_teams: number;
    total_players: number;
    active_fines: number;
    total_amount: number;
    paid_amount: number;
  }> => {
    const db = await getDb();
    try {
      if (ownerId && ownerId > 0) {
        // stats solo del mister
        const rows = await db.getFirstAsync<{
          total_teams: number;
          total_players: number;
          active_fines: number;
          total_amount: number;
          paid_amount: number;
        }>(
          `
          SELECT
            (SELECT COUNT(*) FROM teams WHERE owner_user_id = ?) AS total_teams,
            (SELECT COUNT(*) FROM players WHERE team_id IN (SELECT id FROM teams WHERE owner_user_id = ?)) AS total_players,
            (SELECT COUNT(*) FROM fines WHERE is_paid = 0 AND player_id IN (
              SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id WHERE t.owner_user_id = ?
            )) AS active_fines,
            (SELECT COALESCE(SUM(amount), 0) FROM fines WHERE player_id IN (
              SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id WHERE t.owner_user_id = ?
            )) AS total_amount,
            (SELECT COALESCE(SUM(amount), 0) FROM fines WHERE is_paid = 1 AND player_id IN (
              SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id WHERE t.owner_user_id = ?
            )) AS paid_amount
        `,
          [ownerId, ownerId, ownerId, ownerId, ownerId]
        );
        return (
          rows ?? {
            total_teams: 0,
            total_players: 0,
            active_fines: 0,
            total_amount: 0,
            paid_amount: 0,
          }
        );
      }

      // fallback globale
      const stats = await db.getFirstAsync<{
        total_teams: number;
        total_players: number;
        active_fines: number;
        total_amount: number;
        paid_amount: number;
      }>(`
        SELECT 
          (SELECT COUNT(*) FROM teams)                           AS total_teams,
          (SELECT COUNT(*) FROM players)                         AS total_players,
          (SELECT COUNT(*) FROM fines WHERE is_paid = 0)         AS active_fines,
          (SELECT COALESCE(SUM(amount), 0) FROM fines)           AS total_amount,
          (SELECT COALESCE(SUM(amount), 0) FROM fines WHERE is_paid = 1) AS paid_amount
      `);

      return (
        stats ?? {
          total_teams: 0,
          total_players: 0,
          active_fines: 0,
          total_amount: 0,
          paid_amount: 0,
        }
      );
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        total_teams: 0,
        total_players: 0,
        active_fines: 0,
        total_amount: 0,
        paid_amount: 0,
      };
    }
  },
};

/* =========================
 *       EXPORT UTILI
 * ========================= */
export const getDatabaseInstance = async () => getDb();
export default getDb;
