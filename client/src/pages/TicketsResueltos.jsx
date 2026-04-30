import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
import { formatearFecha } from '../utils/formatearFecha'
import api from '../api'

const TicketsResueltos = () => {
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState(null)
  //   const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTicketsResueltos = async () => {
      try {
        const res = await api.get('/tickets/resueltos')
        setTickets(res.data)
      } catch (error) {
        setError('Error al cargar los tickets resueltos', error)
      }
    }

    fetchTicketsResueltos()
  }, [])

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <div className='px-5 pt-12 pb-4 flex items-center gap-3'>
        <button
          onClick={() => navigate('/tickets')}
          className='text-blue-400 text-sm font-medium'
        >
          ← Volver
        </button>
      </div>
      <h1 className='text-center text-2xl font-semibold tracking-tight mb-6'>
        Tickets resueltos
      </h1>

      <div className='px-4 flex flex-col gap-2 pb-10'>
        {error && <p className='text-red-400 text-sm'>{error}</p>}
        {tickets.length === 0 && (
          <div className='min-h-screen bg-black text-white pt-12 px-4'>
            <div className='animate-pulse flex flex-col gap-4'>
              <div className='h-4 w-24 bg-zinc-800 rounded-full'></div>
              <div className='h-6 w-3/4 bg-zinc-800 rounded-full mt-4'></div>
              <div className='h-4 w-1/2 bg-zinc-800 rounded-full'></div>
              <div className='h-24 bg-zinc-800 rounded-2xl mt-2'></div>
              <div className='h-4 w-1/3 bg-zinc-800 rounded-full mt-4'></div>
              <div className='h-16 bg-zinc-800 rounded-2xl'></div>
              <div className='h-16 bg-zinc-800 rounded-2xl'></div>
            </div>
          </div>
        )}
        {tickets.map((t) => {
          console.log(t)
          return (
            <div
              key={t.id}
              className='bg-zinc-900 rounded-2xl p-4 flex flex-col gap-1'
            >
              <div className='flex justify-between items-start gap-2'>
                <h3 className='font-semibold text-white text-base leading-snug flex-1'>
                  {t.titulo}
                </h3>
                <span
                  className='ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0'
                  style={{
                    backgroundColor: t.estado_color + '33',
                    color: t.estado_color,
                  }}
                >
                  {t.estado}
                </span>
              </div>
              <p className='text-zinc-500 text-sm line-clamp-1'>
                {t.descripcion}
              </p>
              <div className='flex flex-col gap-1 mt-2 pt-2 border-t border-zinc-800'>
                <span className='text-zinc-500 text-xs'>
                  Creado por: {t.creado_por}
                </span>
                <span className='text-zinc-700 text-xs'>.</span>
                <span className='text-zinc-500 text-xs'>
                  Resuelto por: {t.resuelto_por || 'N/A'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TicketsResueltos
