import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBq5K3fds_ZJPHIXFxQ8yneUSC7qEUgnag',
  authDomain: 'tipuro-tickets.firebaseapp.com',
  projectId: 'tipuro-tickets',
  storageBucket: 'tipuro-tickets.firebasestorage.app',
  messagingSenderId: '136371256240',
  appId: '1:136371256240:web:67bd545939cd735d8d7475',
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }
