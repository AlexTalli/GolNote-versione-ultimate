// contexts/RoleContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';

// Tipi per il ruolo e l'identità del giocatore
export type Role = 'mister' | 'player' | null;
export type PlayerIdentity = { playerId: number | null };

// Interfaccia del contesto del ruolo
type RoleCtx = {
  role: Role;
  setRole: (r: Role) => void;
  playerIdentity: PlayerIdentity;
  setPlayerIdentity: (p: PlayerIdentity) => void;
};

// Valore predefinito del contesto
const defaultValue: RoleCtx = {
  role: null,
  setRole: () => {},
  playerIdentity: { playerId: null },
  setPlayerIdentity: () => {},
};

const Ctx = createContext<RoleCtx>(defaultValue);

// Provider del contesto del ruolo
export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Stato del ruolo corrente
  const [role, setRole] = useState<Role>(null);
  // Stato dell'identità del giocatore
  const [playerIdentity, setPlayerIdentity] = useState<PlayerIdentity>({ playerId: null });

  // Valore del contesto memorizzato
  const value = useMemo(
    () => ({ role, setRole, playerIdentity, setPlayerIdentity }),
    [role, playerIdentity]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Hook per utilizzare il contesto del ruolo
export function useRole() {
  return useContext(Ctx);
}
