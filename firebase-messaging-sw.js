// firebase-messaging-sw.js

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

// FETCH HANDLER — requerido para que el navegador reconozca el SW
self.addEventListener('fetch', function(event) {
  // Dejar pasar todas las peticiones normalmente
});

// INSTALL — forzar activación inmediata
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// ACTIVATE — tomar control inmediatamente
self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

// Notificaciones en BACKGROUND (app cerrada o segundo plano)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Mensaje en background:', payload);

  const title = (payload.notification && payload.notification.title) || 'DulceControl';
  const body  = (payload.notification && payload.notification.body)  || '';

  self.registration.showNotification(title, {
    body:    body,
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    vibrate: [200, 100, 200],
    tag:     'dulcecontrol-notif',
    renotify: true,
    data:    payload.data || {}
  });
});

// Al tocar la notificación — abrir la app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
