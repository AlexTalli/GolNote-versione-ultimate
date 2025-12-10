// utils/notifications.ts
import * as Notifications from 'expo-notifications';

/* =======================
 *  PERMESSI
 * ======================= */

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/* =======================
 *  PROMEMORIA SETTIMANALE
 * ======================= */

export async function scheduleWeeklyFinesReminder() {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📅 Promemoria multe',
      body: 'Ci sono ancora multe da saldare. Apri l’app per i dettagli.',
      data: { type: 'weekly_fines_reminder' },
    },
    trigger: {
      weekday: 2, // 1 = domenica, 2 = lunedì
      hour: 9,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });

  return true;
}

/* =======================
 *  MULTA REALE (giorno prima)
 * ======================= */

export async function scheduleFineDueNotification(
  dueDate: string,     // "YYYY-MM-DD"
  playerName?: string,
  teamName?: string
) {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const triggerDate = new Date(year, month - 1, day);
  triggerDate.setDate(triggerDate.getDate() - 1); // giorno prima
  triggerDate.setHours(9, 0, 0, 0);               // 09:00

  console.log('[NOTIF] Computed trigger date:', triggerDate.toISOString());

  if (triggerDate.getTime() <= Date.now()) {
    console.log('[NOTIF] Trigger date is in the past — skipping');
    return false;
  }

  let body = 'Hai una multa che scade domani.';
  if (playerName && teamName) {
    body = `${playerName} (${teamName}) ha una multa da saldare che scade domani.`;
  } else if (playerName) {
    body = `${playerName} ha una multa da saldare che scade domani.`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Multa in scadenza',
      body,
      data: {
        type: 'fine_due_reminder',
        playerName,
        teamName,
        dueDate,
      },
    },
    trigger: { date: triggerDate } as Notifications.NotificationTriggerInput,
  });

  console.log('[NOTIF] Fine due notification scheduled at', triggerDate.toISOString());
  return true;
}

/* =======================
 *  DEMO (arriva dopo 10 secondi)
 * ======================= */

export async function scheduleFineDueNotificationDemo() {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  console.log('[NOTIF-DEMO] Scheduling test notification in 10 seconds…');

  const triggerDate = new Date(Date.now() + 10_000); // adesso + 10 secondi

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Demo multa in scadenza',
      body: 'Questa è UNA NOTIFICA DI TEST che arriva dopo ~10 secondi.',
      data: { type: 'fine_due_demo' },
    },
    trigger: {
      date: triggerDate,
    } as Notifications.NotificationTriggerInput,
  });

  console.log('[NOTIF-DEMO] Scheduled with id:', id, 'at', triggerDate.toISOString());
  return true;
}