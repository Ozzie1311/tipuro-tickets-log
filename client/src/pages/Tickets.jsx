import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fectchTickets = async () => {
      try {
        const res = await api.get('/tickets')
        setTickets(res.data)
      } catch (error) {
        setError('Error en la carga de los tickets', error)
      }
    }

    fectchTickets()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div>
      <div>
        <h1>Tipuro tickets log</h1>
        <span>Hola {usuario?.nombre}</span>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
      {error && <p>{error}</p>}

      <div>
        {tickets.map((t) => (
          <div key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}>
            <span style={{ backgroundColor: t.estado_color }}>{t.estado}</span>
            <h3>{t.titulo}</h3>
            <p>Creado por: {t.creado_por}</p>
            <p>{new Date(t.creado_en).toLocaleDateString('es-VE')}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/tickets/nuevo')}>+ Nuevo ticket</button>
    </div>
  )
}

export default Tickets
