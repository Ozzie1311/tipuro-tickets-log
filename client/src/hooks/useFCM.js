import { useEffect } from 'react'
import { messaging, getToken } from '../firebase'
import api from '../api'

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY

const useFCM = () => {
  useEffect(() => {
    const registrarToken = async () => {
      try {
        const permiso = await Notification.requestPermission()
        if (permiso !== 'granted') return
        const token = await getToken(messaging, { vapidKey: VAPID_KEY })

        if (token) {
          api.post('/push/token', { token })
        }
      } catch (error) {
        console.error('Error al obtener token FCM: ', error)
      }
    }

    registrarToken()
  }, [])
}

export default useFCM
