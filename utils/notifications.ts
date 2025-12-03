// utils/notifications.ts
import * as Notifications from 'expo-notifications';

export async function ensureNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// 🔔 PROMEMORIA SETTIMANALE (lunedì 9:00)
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
      weekday: 2,   // 1 = domenica, 2 = lunedì
      hour: 9,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });

  return true;
}

// 🔔 NOTIFICA GIORNO PRIMA DELLA SCADENZA
export async function scheduleFineDueNotification(
  dueDate: string,     // "YYYY-MM-DD"
  playerName?: string,
  teamName?: string
) {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  console.log('[NOTIF] scheduleFineDueNotification called:', {
    dueDate,
    playerName,
    teamName,
  });

  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return false;

  const triggerDate = new Date(year, month - 1, day);
  triggerDate.setDate(triggerDate.getDate() - 1);     // giorno prima
  triggerDate.setHours(9, 0, 0, 0);                   // 09:00

  console.log('[NOTIF] Computed trigger:', triggerDate.toISOString());

  // se per qualche motivo è già passato → non schedulo
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
    trigger: {
      date: triggerDate,
    } as Notifications.NotificationTriggerInput,
  });

  console.log('[NOTIF] Fine due notification scheduled');
  return true;
}