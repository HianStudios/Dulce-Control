// firebase-messaging-sw.js
// Este archivo DEBE estar en la raíz del proyecto (mismo nivel que index.html)

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBib3D8Kkyr3WHdQpsGEblIxIB5Fh1wtdc",
  authDomain:        "dulce-control-v2.firebaseapp.com",
  projectId:         "dulce-control-v2",
  storageBucket:     "dulce-control-v2.firebasestorage.app",
  messagingSenderId: "205345085452",
  appId:             "1:205345085452:web:ebea4aee83abb116f37629"
});

const messaging = firebase.messaging();

// Notificaciones cuando la app está en SEGUNDO PLANO o CERRADA
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Notificación en background:', payload);

  const { title, body, icon } = payload.notification || {};

  self.registration.showNotification(title || 'DulceControl', {
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Abrir app' },
      { action: 'close', title: 'Cerrar' }
    ]
  });
});

// Al tocar la notificación, abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
