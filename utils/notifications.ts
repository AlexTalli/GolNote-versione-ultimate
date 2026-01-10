// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WEEKLY_ID_KEY = 'weeklyFinesReminderNotificationId';

// mapping multa -> id notifica (per cancellarla se la multa viene eliminata)
const fineDueKey = (fineId: number) => `fineDueNotif:${fineId}`;

/* ========== PERMESSI ========== */

// Richiede il permesso per le notifiche se non già concesso
export async function ensureNotificationPermission(): Promise<boolean> {
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
 * Pianifica una notifica per il giorno prima della scadenza (ore 09:00).
 * Se passi fineId, salva anche il mapping (fineId -> notificationId) per poter cancellare in delete.
 */
export async function scheduleFineDueNotification(
  dueDate: string,     // "YYYY-MM-DD"
  playerName?: string,
  teamName?: string,
  fineId?: number
): Promise<string | false> {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const due = new Date(year, month - 1, day);

  const triggerDate = new Date(due.getTime());
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(9, 0, 0, 0);

  const now = new Date();
  if (triggerDate.getTime() <= now.getTime()) {
    console.log('[NOTIF] Trigger date is in the past — skipping');
    return false;
  }

  let body = 'Hai una multa che scade domani.';
  if (playerName && teamName) body = `${playerName} (${teamName}) ha una multa che scade domani.`;
  else if (playerName) body = `${playerName} ha una multa che scade domani.`;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Multa in scadenza',
      body,
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

  console.log('[NOTIF] Fine due notification scheduled with id:', notificationId);
  return notificationId;
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