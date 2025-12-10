// utils/notifications.ts
import * as Notifications from 'expo-notifications';

/* =======================
 *  PERMESSI NOTIFICHE
 * ======================= */

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  const granted = finalStatus === 'granted';
  console.log('[NOTIF] Permission granted?', granted);
  return granted;
}

/* =======================
 *  PROMEMORIA SETTIMANALE (LUN 09:00)
 * ======================= */

export async function scheduleWeeklyFinesReminder(): Promise<boolean> {
  const granted = await ensureNotificationPermission();
  if (!granted) {
    console.log('[NOTIF] Cannot schedule weekly reminder: no permission');
    return false;
  }

  console.log('[NOTIF] Scheduling weekly reminder: Monday 09:00');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📅 Promemoria multe',
      body: 'Ci sono ancora multe da saldare. Apri l’app per i dettagli.',
      data: { type: 'weekly_fines_reminder' },
    },
    trigger: {
      // 1 = domenica, 2 = lunedì, ...
      weekday: 2,
      hour: 9,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });

  return true;
}

/* =======================
 *  MULTA: NOTIFICA GIORNO PRIMA (09:00)
 * ======================= */

export async function scheduleFineDueNotification(
  dueDate: string,     // formato "YYYY-MM-DD"
  playerName?: string,
  teamName?: string
): Promise<boolean> {
  const granted = await ensureNotificationPermission();
  if (!granted) {
    console.log('[NOTIF] Cannot schedule fine notification: no permission');
    return false;
  }

  console.log('[NOTIF] scheduleFineDueNotification called with:', {
    dueDate,
    playerName,
    teamName,
  });

  // Parsiamo la data "2025-12-07" → year, month, day
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) {
    console.log('[NOTIF] Invalid dueDate format, expected YYYY-MM-DD');
    return false;
  }

  // Data di scadenza (mezzanotte locale)
  const due = new Date(year, month - 1, day);

  // Giorno prima alle 09:00
  const triggerDate = new Date(due);
  triggerDate.setDate(triggerDate.getDate() - 1);
  triggerDate.setHours(9, 0, 0, 0);

  const now = new Date();

  console.log('[NOTIF] Now:', now.toISOString());
  console.log('[NOTIF] Computed triggerDate:', triggerDate.toISOString());

  // Se per qualsiasi motivo il trigger è già passato → non schedulo
  if (triggerDate.getTime() <= now.getTime()) {
    console.log('[NOTIF] Trigger date is in the past — skipping schedule');
    return false;
  }

  // Testo notifica
  let body = 'Hai una multa che scade domani.';
  if (playerName && teamName) {
    body = `${playerName} (${teamName}) ha una multa da saldare che scade domani.`;
  } else if (playerName) {
    body = `${playerName} ha una multa da saldare che scade domani.`;
  }

  const id = await Notifications.scheduleNotificationAsync({
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
    
    trigger: {
      date: triggerDate,
    } as Notifications.NotificationTriggerInput,
  });

  console.log(
    '[NOTIF] Fine due notification scheduled with id:',
    id,
    'at',
    triggerDate.toISOString()
  );

  return true;
}