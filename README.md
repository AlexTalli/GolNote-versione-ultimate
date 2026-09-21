# SportNote
Un'app Expo React Native per la gestione delle multe in team sportivi, con ruoli separati per mister e giocatori. Utilizza un database SQLite locale per la persistenza dei dati.

## Estensione backend (Supabase)
È stato aggiunto il primo step per passare a database condiviso multi-dispositivo.

- Client Supabase: [backend/supabase.ts](backend/supabase.ts)
- Schema SQL + RLS: [backend/supabase-schema.sql](backend/supabase-schema.sql)
- Setup guidato: [backend/README.md](backend/README.md)
- Variabili ambiente esempio: [.env.example](.env.example)

### Setup rapido
1. Crea progetto Supabase
2. Copia `.env.example` in `.env` e imposta URL + ANON KEY
3. Esegui `backend/supabase-schema.sql` nel SQL Editor
4. Crea 2 account test (`mister`, `player`) e relative righe in `profiles`

### Cosa testare subito
- Mister: crea team / player / multa / sessione allenamento
- Mister: imposta presenze (`present`, `late`, `absent_justified`, `absent_unjustified`, `injured`)
- Player: sola lettura dei propri dati
- Sicurezza: un mister non deve modificare team/presenze di un altro mister

## Requisiti
- **Node.js**: Versione 18 o superiore
- **Expo CLI**: Installa globalmente con `npm install -g @expo/cli`
- **Dispositivo di test**:
  - Mobile: Android/iOS device con Expo Go installato

## Installazione
1. Installa le dipendenze:
   npm install

2.  Installa Expo Go sul dispositivo mobile per test rapidi.


## Avvio in Sviluppo
1. Avvia il progetto:
   npx expo start

2. Scansiona il QR Code con Expo Go per eseguire l’app sul dispositivo. Se serve premere 's' per switchare Ambiente (Dev build, Expo Go)

*Si consiglia l’uso di Expo Go per test rapidi e del Dev Build per test più avanzati*


## Troubleshooting
- **DB non inizializza**: Verifica permessi file system su mobile

- **Notifiche non ricevute**: Verificare i permessi di notifica nelle impostazioni del sistema.


## Note
- Disinstallando l'app, i dati locali vengono persi.