export function initPushNotifications() {
  if (!('Notification' in window)) return false;

  // Let the user know they can enable permissions securely. Check logic via buttons inside Settings ideally.
  if (Notification.permission === 'granted') {
    return true;
  }
  return false;
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  
  const perm = await Notification.requestPermission()
  return perm === 'granted';
}

export function sendLocalNotification(title: string, body: string, icon: string = '📈') {
  if (typeof window === 'undefined') return;
  const NotificationClass = (window as any).Notification;
  if (NotificationClass && typeof NotificationClass === 'function' && NotificationClass.permission === 'granted') {
    try {
      new NotificationClass(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        silent: false
      });
    } catch (e) {
      console.warn("Notification constructor restricted:", e);
    }
  }
}
