import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let Notifications: any = null;
let notificationsLoaded = false;

const loadNotifications = async (): Promise<boolean> => {
  if (notificationsLoaded) return Notifications !== null;
  
  // Skip on Android (Expo Go limitation)
  if (Platform.OS === 'android') {
    console.log('[NOTIF] Notifications disabled on Android (Expo Go limitation)');
    notificationsLoaded = true;
    return false;
  }
  
  try {
    Notifications = await import('expo-notifications').then(m => m.default || m);
    notificationsLoaded = true;
    return true;
  } catch (e) {
    console.warn('[NOTIF] expo-notifications not available (remote notifications disabled on Expo Go):', e);
    notificationsLoaded = true;
    return false;
  }
};

const isNotificationsAvailable = async (): Promise<boolean> => {
  if (notificationsLoaded) return Notifications !== null;
  return await loadNotifications();
};

const WEEKLY_ID_KEY = 'weeklyFinesReminderNotificationId';

// mapping multa -> id notifica (per cancellarla se la multa viene eliminata)
const fineDueKey = (fineId: number) => `fineDueNotif:${fineId}`;

/* ========== PERMESSI ========== */

// Richiede il permesso per le notifiche se non già concesso
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!(await isNotificationsAvailable())) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/* ========== PROMEMORIA SETTIMANALE ========== */

/* Ritorna true se risulta già attivo (abbiamo un ID salvato) */
export async function isWeeklyFinesReminderEnabled(): Promise<boolean> {
  const id = await AsyncStorage.getItem(WEEKLY_ID_KEY);
  return !!id;
}

/** Disattiva il promemoria settimanale (se attivo) */
export async function disableWeeklyFinesReminder(): Promise<boolean> {
  if (!(await isNotificationsAvailable())) return true;

  const id = await AsyncStorage.getItem(WEEKLY_ID_KEY);
  if (!id) return true;

  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.log('[NOTIF] cancel weekly failed (ignored):', e);
  } finally {
    await AsyncStorage.removeItem(WEEKLY_ID_KEY);
  }

  return true;
}

/**
 * Attiva promemoria settimanale (Lunedì 09:00).
 * Se già attivo, NON crea duplicati.
 */
export async function scheduleWeeklyFinesReminder(): Promise<boolean> {
  if (!(await isNotificationsAvailable())) {
    console.log('[NOTIF] Notifications not available, skipping weekly reminder');
    return false;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const existingId = await AsyncStorage.getItem(WEEKLY_ID_KEY);
  if (existingId) {
    console.log('[NOTIF] Weekly reminder already scheduled:', existingId);
    return true;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '📅 Promemoria multe',
      body: 'Apri l’app per controllare eventuali multe da saldare.',
      data: { type: 'weekly_fines_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // 1=Sunday, 2=Monday, ... 7=Saturday
      hour: 9,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(WEEKLY_ID_KEY, id);
  console.log('[NOTIF] Weekly reminder scheduled with id:', id);

  return true;
}

/* (Opzionale) Reset pulito: cancella e ricrea */
export async function rescheduleWeeklyFinesReminder(): Promise<boolean> {
  await disableWeeklyFinesReminder();
  return await scheduleWeeklyFinesReminder();
}

/* ========== NOTIFICA MULTA IN SCADENZA ========== */

/**
 * Pianifica notifica il giorno prima della scadenza (ore 09:00).
 * Usata sia dal mister che dal player per essere avvisati del promemoria.
 * Se passi fineId, salva anche il mapping (fineId -> notificationId) per poter cancellare in delete.
 */
export async function scheduleFineDueNotification(
  dueDate: string,     // "YYYY-MM-DD"
  playerName?: string,
  teamName?: string,
  fineId?: number
): Promise<string | false> {
  if (!(await isNotificationsAvailable())) return false;

  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  // Evita duplicati sullo stesso dispositivo per la stessa multa
  if (typeof fineId === 'number' && fineId > 0) {
    const existingId = await AsyncStorage.getItem(fineDueKey(fineId));
    if (existingId) return existingId;
  }

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const due = new Date(year, month - 1, day);

  const triggerDate = new Date(due.getTime());
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(9, 0, 0, 0);

  const now = new Date();
  if (triggerDate.getTime() <= now.getTime()) {
    console.log('[NOTIF] Trigger date is in the past - skipping reminder notification');
    console.log('[NOTIF] Due date:', dueDate, '| Trigger would be:', triggerDate.toLocaleString('it-IT'));
    return false;
  }

  let reminderBody = 'Hai una multa che scade domani, non te lo dimenticare.';
  if (playerName && teamName) {
    reminderBody = `${playerName} (${teamName}) ha una multa che scade domani.`;
  } else if (playerName) {
    reminderBody = `${playerName} ha una multa che scade domani.`;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Multa in scadenza',
      body: reminderBody,
      data: { type: 'fine_due_reminder', playerName, teamName, dueDate, fineId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });

  // Salvo mapping per poterla cancellare in seguito
  if (typeof fineId === 'number' && fineId > 0) {
    await AsyncStorage.setItem(fineDueKey(fineId), notificationId);
  }

  console.log('[NOTIF] Fine due reminder notification scheduled with id:', notificationId);
  console.log('[NOTIF] Reminder will trigger on:', triggerDate.toLocaleString('it-IT'));
  return notificationId;
}

/* ========== NOTIFICA IMMEDIATA NUOVA MULTA (PLAYER) ========== */

export async function scheduleFineAssignedNotification(): Promise<boolean> {
  if (!(await isNotificationsAvailable())) return false;

  const granted = await ensureNotificationPermission();
  if (!granted) {
    console.log('[NOTIF] Permission not granted for fine assigned notification');
    return false;
  }

  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Nuova multa',
      body: 'Ti è appena stata assegnata una multa, apri l\'app per vederne i dettagli.',
      data: { type: 'fine_assigned_player' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      repeats: false,
    },
  });

  console.log('[NOTIF] Player new fine notification scheduled with id:', notifId);
  return true;
}

/*
 * Cancella la notifica "multa in scadenza" associata a una multa (se esiste).
 */
export async function cancelFineDueNotificationByFineId(fineId: number): Promise<boolean> {
  if (!(fineId > 0)) return true;

  const storedId = await AsyncStorage.getItem(fineDueKey(fineId));
  if (!storedId) return true;

  try {
    await Notifications.cancelScheduledNotificationAsync(storedId);
  } catch (e) {
    console.log('[NOTIF] cancel fine due failed (ignored):', e);
  } finally {
    await AsyncStorage.removeItem(fineDueKey(fineId));
  }

  return true;
}

/* ========== NOTIFICA DEMO ========== */

// Pianifica una notifica di test dopo 10 secondi
export async function scheduleFineDueNotificationDemo() {
  if (!(await isNotificationsAvailable())) {
    console.log('[NOTIF] Notifications not available, skipping demo');
    return false;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Demo multa in scadenza',
      body: 'Questa è UNA NOTIFICA DI TEST che dovrebbe arrivare dopo ~10 secondi.',
      data: { type: 'fine_due_demo' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      repeats: false,
    },
  });

  console.log('[NOTIF-DEMO] Scheduled with id:', id);
  return true;
}

/* ========== NOTIFICA MESSAGGIO CHAT ========== */

/**
 * Invia notifica immediata di nuovo messaggio chat.
 * userRole: 'mister' o 'player'
 * playerName: nome del giocatore che ha mandato il messaggio
 * teamName: nome della squadra
 */
export async function sendChatMessageNotification(
  userRole: 'mister' | 'player',
  playerName: string,
  teamName: string
): Promise<boolean> {
  if (!(await isNotificationsAvailable())) return false;

  const granted = await ensureNotificationPermission();
  if (!granted) {
    console.log('[NOTIF] Permission not granted for chat message notification');
    return false;
  }

  let title = '';
  let body = '';

  if (userRole === 'mister') {
    title = '💬 Nuovo messaggio';
    body = `${playerName} (${teamName}) ti ha inviato un messaggio`;
  } else {
    title = '💬 Nuovo messaggio';
    body = `Il mister (${teamName}) ti ha inviato un messaggio`;
  }

  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: 'chat_message', playerName, teamName, userRole },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      repeats: false,
    },
  });

  console.log('[NOTIF] Chat message notification scheduled with id:', notifId);
  return true;
}