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
          <button onClick={handleLogout} className='text-red-400 text-sm'>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Lista de Tickets */}
      <div className='p-4 flex flex-col gap-3'>
        {error && <p className='text-red-400'>{error}</p>}
        {tickets.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/tickets/${t.id}`)}
            className='bg-gray-800 rounded-xl p-4 flex flex-col gap-2 active:opacity-7'
          >
            <div className='flex items-center justify-between'>
              <span
                className='text-xs font-semibold px-2 py-1 rounded-full text-white'
                style={{ backgroundColor: t.estado_color }}
              >
                {t.estado}
              </span>
              <span className='text-gray-400 text-xs'>
                {new Date(t.creado_en).toLocaleDateString('es-VE')}
              </span>
            </div>
            <h3 className='font-semibold'>{t.titulo}</h3>
            <p className='text-gray-400 text-sm'>Por: {t.creado_por}</p>
          </div>
        ))}
      </div>

      {/* Boton nuevo ticket */}
      <div className='fixed bottom-6 right-6'>
        <button
          onClick={() => setMostrarModal(true)}
          className='bg-blue-600 text-white rounded-full w-14 h-14 text-2xl shadow-lg'
        >
          +
        </button>
      </div>

      {mostrarModal && (
        <NuevoTicketModal
          onClose={() => setMostrarModal(false)}
          onTicketCreado={handleTicketCreado}
        />
      )}
    </div>
  )
}

export default Tickets
