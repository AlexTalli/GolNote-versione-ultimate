# Backend setup (Supabase)

## 1) Crea progetto Supabase
- Vai su Supabase e crea un nuovo progetto.
- Copia:
  - Project URL
  - anon public key

## 2) Configura variabili ambiente
1. Duplica `.env.example` in `.env`
2. Compila:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 3) Crea schema DB
- Apri SQL Editor di Supabase
- Esegui lo script: `backend/supabase-schema.sql`

## 4) Crea utenti test
- Da app: registra 1 mister + 1 player
- Dopo la registrazione, inserisci una riga in `profiles` per ogni utente (id = auth uid, role, nickname)

## 5) Test minimi consigliati
- Mister crea team/player/fine
- Mister crea allenamento e presenze
- Player vede solo i propri dati (read-only)
- Verifica RLS: un mister non deve poter modificare team di altri mister

## 6) Note integrazione app
- Client pronto in `backend/supabase.ts`
- Prossimo step: sostituire progressivamente i metodi in `database/database.ts` con query Supabase + cache SQLite locale
