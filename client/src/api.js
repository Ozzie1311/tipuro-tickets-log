import axios from 'axios'

//Agregando interceptor para no tener que enviar el token en cada petición. Con esto centralizamos el envio del token en cada petición.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  // Solo agregar token si existe (todas son peticiones a la API por el baseURL)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
