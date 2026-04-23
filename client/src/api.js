import axios from 'axios'

//Agregando interceptor para no tener que enviar el token en cada petición. Con esto centralizamos el envio del token en cada petición.
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
