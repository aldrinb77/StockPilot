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
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico', // Would map to manifest icon 
      badge: '/favicon.ico',
      silent: false
    });
  }
}
