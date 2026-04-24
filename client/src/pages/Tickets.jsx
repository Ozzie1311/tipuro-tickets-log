import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NuevoTicketModal from '../components/NuevoTicketModal.jsx'
import api from '../api.js'

const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
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

  const handleTicketCreado = async () => {
    const res = await api.get('/tickets')
    setTickets(res.data)
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Header */}
      <div className='bg-gray-800 px-4 py-4 flex items-center justify-between'>
        <h1 className='text-lg font-bold'>Tipuro tickets log</h1>
        <div className='flex items-center gap-3'>
          <span className='text-gray-400 text-sm'>Hola {usuario?.nombre}</span>
          <button onClick={handleLogout} className='text-red-400 text-sm'>Cerrar sesión</button>
        </div>
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

      <button onClick={() => setMostrarModal(true)}>+ Nuevo ticket</button>
      {mostrarModal && (
        <NuevoTicketModal onClose={() => setMostrarModal(false)} onTicketCreado={handleTicketCreado}/>
      )}
    </div>
  )
}

export default Tickets
