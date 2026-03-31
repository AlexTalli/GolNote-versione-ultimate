import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export type AppRole = 'mister' | 'player';
export type AppUser = {
  id: string;
  role: AppRole;
  nickname: string;
  displayNickname?: string;
  playerId?: number | null;
};

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
const SESSION_KEY = '@session:v2';

const buildAuthEmail = (nickname: string) => {
  const encodedNickname = Array.from(nickname.trim().toLowerCase())
    .map((char) => char.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('');

  return `user-${encodedNickname}@golnote.app`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const userId = data.session.user.id;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !profile) {
          console.error('[AuthContext] Profile not found:', error);
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUser({
            id: profile.id,
            role: profile.role,
            nickname: profile.nickname,
            displayNickname: profile.display_nickname,
            playerId: profile.player_id,
          });
          setLoading(false);
        }
      } catch (e) {
        console.error('[AuthContext] Init error:', e);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (nickname: string, password: string, role: AppRole): Promise<string | null> => {
    try {
      const cleanNickname = nickname.trim().toLowerCase();
      const email = buildAuthEmail(cleanNickname);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = (error.message || '').toLowerCase();
        const isInvalidCredentials =
          msg.includes('invalid login credentials') ||
          msg.includes('invalid credentials');

        if (!isInvalidCredentials) {
          console.error('[AuthContext] Login error:', error);
        }
        return 'Credenziali non valide';
      }

      if (!data.user) {
        return 'Errore durante il login';
      }

      const userId = data.user.id;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error('[AuthContext] Profile not found on login:', profileError);
        await supabase.auth.signOut();
        return 'Profilo non trovato. Se hai eliminato l’account, registrati di nuovo.';
      }

      // Controlla che il ruolo dell'utente corrisponda al ruolo richiesto
      if (profile.role !== role) {
        await supabase.auth.signOut();
        return `Ruolo errato. Questo account è registrato come ${profile.role === 'mister' ? 'Mister' : 'Giocatore'}`;
      }

      setUser({
        id: profile.id,
        role: profile.role,
        nickname: profile.nickname,
        displayNickname: profile.display_nickname,
        playerId: profile.player_id,
      });

      return null;
    } catch (e) {
      console.error('[AuthContext] Login exception:', e);
      return 'Errore di rete';
    }
  };

  const register = async (nickname: string, password: string, role: AppRole): Promise<string | null> => {
    try {
      const cleanNickname = nickname.trim().toLowerCase();

      const { data: existing } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', cleanNickname)
        .single();

      if (existing) {
        return 'Nickname già in uso';
      }

      const email = buildAuthEmail(cleanNickname);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: cleanNickname,
            role,
          },
        },
      });

      if (signUpError) {
        console.error('[AuthContext] SignUp error:', signUpError);
        if (signUpError.message.includes('already registered')) {
          return 'Utente già registrato';
        }
        return 'Errore durante la registrazione';
      }

      if (!signUpData.user) {
        return 'Errore durante la registrazione';
      }

      const userId = signUpData.user.id;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role,
          nickname: cleanNickname,
          display_nickname: nickname,
        });

      if (profileError) {
        console.error('[AuthContext] Profile creation error:', profileError);
        return 'Errore durante la creazione del profilo';
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.user) {
        console.error('[AuthContext] Post-registration sign-in failed:', signInError);
        return 'Registrazione completata. Effettua il login.';
      }

      setUser({
        id: userId,
        role,
        nickname: cleanNickname,
        displayNickname: nickname,
        playerId: null,
      });

      return null;
    } catch (e) {
      console.error('[AuthContext] Register exception:', e);
      return 'Errore di rete';
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const isMister = useMemo(() => user?.role === 'mister', [user]);
  const isPlayer = useMemo(() => user?.role === 'player', [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      setUser,
      isMister,
      isPlayer,
    }),
    [user, loading, isMister, isPlayer]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
