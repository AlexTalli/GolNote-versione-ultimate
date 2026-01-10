import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { usersDB } from '@/database/database';

// Tipi per il ruolo dell'app e l'utente
export type AppRole = 'mister' | 'player';
export type AppUser = { id: number; role: AppRole; nickname: string; playerId?: number | null };

// Interfaccia del contesto di autenticazione
type AuthCtx = {
  user: AppUser | null;
  loading: boolean;               
  login: (nickname: string, password: string, role: AppRole) => Promise<string | null>;
  register: (nickname: string, password: string, role: AppRole) => Promise<string | null>;
  logout: () => Promise<void>;
  setUser: (u: AppUser | null) => void;
  isMister: boolean;
  isPlayer: boolean;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

// Chiave per salvare la sessione in AsyncStorage
const SESSION_KEY = '@session:v1';

// Funzione per hashare la password usando SHA256
async function hashPassword(password: string) {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

// Provider del contesto di autenticazione
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Stato dell'utente corrente
  const [user, setUser] = useState<AppUser | null>(null);
  // Stato di caricamento
  const [loading, setLoading] = useState(true);  

  // Effetto per ripristinare la sessione dal storage all'avvio
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

  // Funzione di login
  const login: AuthCtx['login'] = async (nickname, password, role) => {
    setLoading(true);
    try {
      // Trova l'utente per nickname
      const row = await usersDB.findByNickname(nickname);
      if (!row) return 'Utente non trovato';
      if (row.role !== role) return 'Ruolo non corretto per questo utente';

      // Verifica la password
      const hash = await hashPassword(password);
      if (row.password_hash !== hash) return 'Password errata';

      // Crea l'oggetto utente e salva la sessione
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

  // Funzione di registrazione
  const register: AuthCtx['register'] = async (nickname, password, role) => {
    setLoading(true);
    try {
      // Controlla se il nickname è già in uso
      const existing = await usersDB.findByNickname(nickname);
      if (existing) return 'Nickname già in uso';

      // Hasha la password e crea l'utente
      const hash = await hashPassword(password);
      const id = await usersDB.create({ role, nickname, password_hash: hash, player_id: null });
      if (!id) return 'Registrazione fallita';

      // Crea l'oggetto utente e salva la sessione
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

  // Funzione di logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  // Proprietà calcolate per il ruolo
  const isMister = user?.role === 'mister';
  const isPlayer = user?.role === 'player';

  // Valore del contesto memorizzato
  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser, isMister, isPlayer }),
    [user, loading, isMister, isPlayer]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Hook per utilizzare il contesto di autenticazione
export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within <AuthProvider>');
  return v;
};
