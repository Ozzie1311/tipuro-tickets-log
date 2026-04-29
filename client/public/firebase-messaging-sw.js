importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey: 'AIzaSyBq5K3fds_ZJPHIXFxQ8yneUSC7qEUgnag',
  authDomain: 'tipuro-tickets.firebaseapp.com',
  projectId: 'tipuro-tickets',
  storageBucket: 'tipuro-tickets.firebasestorage.app',
  messagingSenderId: '136371256240',
  appId: '1:136371256240:web:67bd545939cd735d8d7475',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon-192.png',
  })
})
