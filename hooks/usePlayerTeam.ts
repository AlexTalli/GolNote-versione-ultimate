import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { teamsDB, playersDB, finesDB, Team, Player, Fine } from '@/database/database.supabase';

/** --------- Ricerca squadre (con debounce, guard e race-prevention) --------- */
export const useTeamSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Team & { hasPassword: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<unknown>(null);

  // per ignorare risposte vecchie
  const lastReqId = useRef(0);
  const lastNormQ = useRef<string>('');

  const search = useCallback(async (raw: string) => {
    const norm = raw.trim().toLowerCase();
    if (norm.length < 2) { // evita ricerche inutili su 0/1 char
      setResults([]);
      setError(null);
      return;
    }

    // evita doppie chiamate se la query normalizzata non è cambiata
    if (norm === lastNormQ.current) return;
    lastNormQ.current = norm;

    const reqId = ++lastReqId.current;
    setLoading(true);
    setError(null);
    try {
      const rows = await teamsDB.search(norm);
      // Se nel frattempo è partita un’altra richiesta, ignora questa risposta
      if (reqId !== lastReqId.current) return;

      const mapped = (rows ?? []).map((t) => ({
        ...t,
        hasPassword: !!t.password_hash,
      }));
      setResults(mapped);
    } catch (e) {
      if (reqId !== lastReqId.current) return;
      setError(e);
      setResults([]);
    } finally {
      if (reqId === lastReqId.current) setLoading(false);
    }
  }, []);

  // debounce semplice
  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  // possibilità di forzare la ricerca (es. submit)
  const manualSearch = useCallback(() => search(query), [query, search]);

  return { query, setQuery, results, loading, error, manualSearch };
};

/** --------- Check password lato player --------- */
export const useCheckTeamPassword = () => {
  const verify = useCallback(async (teamId: number, plainPassword: string, hasPassword: boolean) => {
    if (!hasPassword) return true;
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, plainPassword);
    return await teamsDB.checkPassword(teamId, hash);
  }, []);
  return { verify };
};

/** --------- Dati pubblici team (read-only per player) --------- */
export const usePublicTeam = (teamId?: number) => {
  const enabled = useMemo(() => typeof teamId === 'number' && teamId! > 0, [teamId]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [fines, setFines]     = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!enabled) { setLoading(false); setPlayers([]); setFines([]); return; }
    setLoading(true);
    setError(null);
    try {
      const [ps, fs] = await Promise.all([
        playersDB.getByTeamPublic(teamId!),
        finesDB.getByTeamPublic(teamId!)
      ]);
      setPlayers(ps);
      setFines(fs);
    } catch (e) {
      setError(e);
      setPlayers([]);
      setFines([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, teamId]);

  useEffect(() => { load(); }, [load]);

  return { players, fines, loading, error, refresh: load };
};
