import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OneSignal from 'react-onesignal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

OneSignal.init({
  appId: 'efd951dd-54ad-4eab-aefe-bed564801cc1',
  notifyButton: { enable: false },
  allowLocalhostAsSecureOrigin: true,
  serviceWorkerParam: { scope: '/' },
  serviceWorkerPath: 'OneSignalSDKWorker.js',
}).then(() => {
  console.log('OneSignal iniciado')
})
