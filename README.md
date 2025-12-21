# App LAM - GolNote
Un'app Expo React Native per la gestione delle multe in team sportivi, con ruoli separati per mister e giocatori. Utilizza un database SQLite locale per la persistenza dei dati.


## Requisiti
- **Node.js**: Versione 18 o superiore
- **Expo CLI**: Installa globalmente con `npm install -g @expo/cli`
- **Dispositivo di test**:
  - Mobile: Android/iOS device con Expo Go installato


## Installazione
1. Installa le dipendenze:
   npm install

2.  Installa Expo Go sul tuo dispositivo mobile per test rapidi.


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