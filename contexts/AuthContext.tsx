// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { usersDB } from '@/database/database';

export type AppRole = 'mister' | 'player';
export type AppUser = { id: number; role: AppRole; nickname: string; playerId?: number | null };

type AuthCtx = {
  user: AppUser | null;
  loading: boolean;                // loading di auth (login/register/restore)
  login: (nickname: string, password: string, role: AppRole) => Promise<string | null>;
  register: (nickname: string, password: string, role: AppRole) => Promise<string | null>;
  logout: () => Promise<void>;
  setUser: (u: AppUser | null) => void;
  isMister: boolean;
  isPlayer: boolean;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

const SESSION_KEY = '@session:v1';

// Hash “demo” (in prod usa un KDF serio)
async function hashPassword(password: string) {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);   // parte true: proviamo a ripristinare sessione

  // Ripristino iniziale
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.id && parsed?.role) {
            setUser(parsed);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login: AuthCtx['login'] = async (nickname, password, role) => {
    setLoading(true);
    try {
      const row = await usersDB.findByNickname(nickname);
      if (!row) return 'Utente non trovato';
      if (row.role !== role) return 'Ruolo non corretto per questo utente';

      const hash = await hashPassword(password);
      if (row.password_hash !== hash) return 'Password errata';

      const next: AppUser = { id: row.id, role: row.role, nickname: row.nickname, playerId: row.player_id ?? null };
      setUser(next);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return null;
    } catch {
      return 'Errore durante il login';
    } finally {
      setLoading(false);
    }
  };

  const register: AuthCtx['register'] = async (nickname, password, role) => {
    setLoading(true);
    try {
      const existing = await usersDB.findByNickname(nickname);
      if (existing) return 'Nickname già in uso';

      const hash = await hashPassword(password);
      const id = await usersDB.create({ role, nickname, password_hash: hash, player_id: null });
      if (!id) return 'Registrazione fallita';

      const next: AppUser = { id, role, nickname, playerId: null };
      setUser(next);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
      return null;
    } catch {
      return 'Errore durante la registrazione';
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const isMister = user?.role === 'mister';
  const isPlayer = user?.role === 'player';

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser, isMister, isPlayer }),
    [user, loading, isMister, isPlayer]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within <AuthProvider>');
  return v;
};
