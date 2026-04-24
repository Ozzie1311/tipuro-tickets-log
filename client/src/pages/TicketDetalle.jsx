import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const TicketDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [estados, setEstados] = useState([])
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, estadosRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get('/estados'),
        ])
        setTicket(ticketRes.data)
        setEstados(estadosRes.data)
      } catch (error) {
        setError('Error al cargar el ticket', error)
      }
    }

    fetchData()
  }, [id])

  const handleEstado = async (estado_id) => {
    try {
      await api.patch(`/tickets/${id}`, { estado_id })
      setTicket({ ...ticket, estado_id })
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data)
    } catch (error) {
      setError('Error al actualizar el estado', error)
    }
  }

  const handleComentario = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/tickets/${id}/comentarios`, { contenido: comentario })
      const res = await api.get(`/tickets/${id}`)
      setTicket(res.data)
      setComentario('')
    } catch (error) {
      setError('Error al agregar el comentario', error)
    }
  }

  if (!ticket) return <p>Cargando...</p>

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Header */}
      <div className='bg-gray-800 px-4 py-4 flex items-center gap-3'>
        <button className='text-blue-400' onClick={() => navigate('/tickets')}>
          ⬅ Volver
        </button>
        <h2 className='font-bold text-lg truncate'>{ticket.titulo}</h2>
      </div>

      <div className='p-4 flex flex-col gap-4'>
        {/* Informacion del ticket */}
        <div className='bg-gray-800 rounded-xl p-4 flex flex-col gap-2'>
          <p className='text-gray-300'>{ticket.descripcion}</p>
          <div className='flex items-center gap-2 mt-1'>
            <span
              className='text-xs font-semibold px-2 py-1 rounded-full text-white'
              style={{ backgroundColor: ticket.estado_color }}
            >
              {ticket.estado}
            </span>
          </div>
          <p className='text-gray-400 text-sm'>
            Creado por: {ticket.creado_por}
          </p>
          <p className='text-gray-400 text-sm'>
            Asignado a: {ticket.asignado_a || 'Sin asignar'}
          </p>
          <p className='text-gray-400 text-sm'>
            Resuelto por: {ticket.resuelto_por || 'Sin resolver'}
          </p>
        </div>

        {/* Cambiar estado */}
        <div className='bg-gray-800 rounded-xl p-4'>
          <h3 className='font-semibold mb-3'>Cambiar estado</h3>
          <div className='flex flex-wrap gap-2'>
            {estados.map((e) => (
              <button
                key={e.id}
                style={{ backgroundColor: e.color }}
                onClick={() => handleEstado(e.id)}
                className='text-xs font-semibold px-3 py-2 rounded-full text-white'
                style={{ backgroundColor: e.color }}
              >
                {e.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Comentarios */}
        <div className='bg-gray-800 rounded-xl p-4 flex flex-col gap-3'>
          <h3 className='font-semibold'>Comentarios</h3>
          {ticket.comentarios.map((c) => (
            <div key={c.id} className='border-1-2 border-blue-500 pl-3'>
              <p className='text-sm'>{c.contenido}</p>
              <small className='text-gray-400 text-xs'>
                {c.autor}-{new Date(c.creado_en).toLocaleString('es-VE')}
              </small>
            </div>
          ))}
        </div>

        {/* Agregar comentario */}
        <form onSubmit={handleComentario} className='flex flex-col gap-2'>
          <textarea
            placeholder='Agregar comentario...'
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className='bg-gray-800 text-white rounded-xl p-3 outline-none placeholder-gray-400 resize-none'
            rows={3}
          />
          <button
            type='submit'
            className='bg-blue-600 text-white rounded-xl p-3 font-semibold'
          >
            Comentar
          </button>
        </form>

        {error && <p className='text-red-400 text-sm'>{error}</p>}
      </div>
    </div>
  )
}

export default TicketDetalle
