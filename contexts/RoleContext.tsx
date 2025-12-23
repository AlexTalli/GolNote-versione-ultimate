// contexts/RoleContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';

export type Role = 'mister' | 'player' | null;
export type PlayerIdentity = { playerId: number | null };

type RoleCtx = {
  role: Role;
  setRole: (r: Role) => void;
  playerIdentity: PlayerIdentity;
  setPlayerIdentity: (p: PlayerIdentity) => void;
};

const defaultValue: RoleCtx = {
  role: null,
  setRole: () => {},
  playerIdentity: { playerId: null },
  setPlayerIdentity: () => {},
};

const Ctx = createContext<RoleCtx>(defaultValue);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [playerIdentity, setPlayerIdentity] = useState<PlayerIdentity>({ playerId: null });

  const value = useMemo(
    () => ({ role, setRole, playerIdentity, setPlayerIdentity }),
    [role, playerIdentity]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  return useContext(Ctx);
}
