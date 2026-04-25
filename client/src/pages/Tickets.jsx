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
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <div className='px-5 pt-12 pb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Tipuro tickets log
        </h1>

        <div className='flex items-center gap-3'>
          <span className='text-gray-500 text-sm'>Hola, {usuario?.nombre}</span>
          <button
            onClick={handleLogout}
            className='text-red-400 text-sm font-medium'
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className='px-4 flex flex-col gap-2 pb-24'>
        {error && <p className='text-red-400 text-sm'>{error}</p>}
        {tickets.map((t) => {
          return (
            <div
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className='bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1 active:scale-95 transition-transform duration-150 cursor-pointer'
            >
              <h3 className='font-semibold text-white text-base leading-snug'>
                {t.titulo}
              </h3>
              <p className='text-zinc-500 text-sm line-clamp-1'>
                {t.descripcion}
              </p>
              <div className='flex items-center gap-2 mt-2'>
                <span className='text-zinc-500 text-xs'>
                  Creado por: {t.creado_por}
                </span>
                <span className='text-zinc-700 text-xs'>.</span>
                <span className='text-zinc-500 text-xs'>
                  Fecha de creacion:{' '}
                  {new Date(t.creado_en).toLocaleDateString('es-VE')}
                </span>
                <span className='text-gray-600 text-xs'>.</span>
                <span
                  className='ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full'
                  style={{
                    backgroundColor: t.estado_color + '33',
                    color: t.estado_color,
                  }}
                >
                  {t.estado}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Boton flotante */}
      <div className='fixed bottom-8 right-5'>
        <button
          onClick={() => setMostrarModal(true)}
          className='bg-blue-500 text-white rounded-full w-14 h-14 text-3xl shadow-2xl flex items-center justify-center active:scale-90 transition-transform duration-150'
        >
          +
        </button>
        <div className='fixed bottom-24 right-5'>
          <button
            onClick={() => navigate('/tickets/resueltos')}
            className='bg-green-500 text-white rounded-full w-14 h-14 text-3xl shadow-2xl flex items-center justify-center active:scale-90 transition-transform duration-150'
          >
            {'->'}
          </button>
        </div>
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
