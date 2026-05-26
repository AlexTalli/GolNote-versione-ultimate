export const SPORTS = [
  'calcio',
  'tennis',
  'basket',
  'pallavolo',
  'baseball',
  'rugby',
  'hockey',
  'ping pong',
] as const;

export type SportName = (typeof SPORTS)[number];

export const SPORT_POSITIONS: Record<SportName, string[]> = {
  calcio: ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'],
  tennis: ['Atleta Individuale', 'Doppista'],
  basket: ['Playmaker', 'Guardia', 'Ala piccola', 'Ala grande', 'Centro'],
  pallavolo: ['Alzatore', 'Schiacciatore', 'Centrale', 'Opposto', 'Libero'],
  baseball: ['Lanciatore', 'Ricevitore', 'Prima base', 'Seconda base', 'Terza base', 'Interbase', 'Esterno'],
  rugby: ['Avanti', 'Trequarti'],
  hockey: ['Portiere', 'Difensori', 'Attaccanti'],
  'ping pong': ['Atleta Individuale', 'Doppista'],
};

export const SPORT_LABELS: Record<SportName, string> = {
  calcio: 'Calcio',
  tennis: 'Tennis',
  basket: 'Basket',
  pallavolo: 'Pallavolo',
  baseball: 'Baseball',
  rugby: 'Rugby',
  hockey: 'Hockey',
  'ping pong': 'Ping Pong',
};

export const normalizeSport = (value?: string | null): SportName => {
  const normalized = (value || '').trim().toLowerCase();
  return (SPORTS as readonly string[]).includes(normalized) ? (normalized as SportName) : 'calcio';
};
