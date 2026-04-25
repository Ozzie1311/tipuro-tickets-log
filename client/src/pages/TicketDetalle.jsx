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
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)

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

  const handleResolver = async () => {
    try {
      await api.patch(`/tickets/${id}/resolver`)
      setMostrarConfirmacion(false)
      navigate('/tickets')
    } catch(error) {
      setError('Error al resolver el ticket')
    }
  }

  if (!ticket) return <p className='bg-black'>Cargando...</p>

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <div className='px-5 pt-12 pb-4 flex items-center gap-3'>
        <button className='text-blue-400 text-sm font-medium flex items-center gap-1' onClick={() => navigate('/tickets')}>
          ⬅ Volver a los tickets
        </button>
      </div>
        
        <div className='px-4 flex flex-col gap-3 pb-10'>
          {/* Informacion principal */}
          <div className='bg-zinc-900 rounded-2xl p-5 flex flex-col gap-3'>
            <div className='flex items-start justify-between gap-3'>
              <h2 className='font-semibold text-xl leading-snug flex-1'>
                {ticket.titulo}
              </h2>
              <span className='text-xs font-medium px-2.5 py-1 rounded-full shrink-0' style={{backgroundColor: ticket.estado_color + '33', color: ticket.estado_color}}>
                {ticket.estado}
              </span>
            </div>
            <p className='text-zinc-400 text-sm leading-relaxed'>
              {ticket.descripcion}
            </p>
            <div className='border-t border-zinc-800 pt-3 flex flex-col gap-1.5'>
              <div className='flex'>
                <span className='text-zinc-500 text-xs'>Creado por:</span>
                <span className='ml-1 text-zinc-300 text-xs font-medium'>{ticket.creado_por}</span>
              </div>
              <div className='flex'>
                <span className='text-zinc-500 text-xs'>Resuelto por:</span>
                <span className='ml-1 text-zinc-300 text-xs font-medium'>{ticket.resuelto_por || "Sin resolver"}</span>
              </div>
            </div>
          </div>

          {/* Cambiar estado */}
          {!ticket.resuelto && (
            <div className='bg-zinc-900 rounded-2xl p-5'>
            <p className='text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3'>Cambiar estado</p>
            <div className='flex flex-wrap gap-2'>
              {estados
                .filter(e => e.nombre !== 'Resuelto')
                .map(e => (
                  <button key={e.id} onClick={() => handleEstado(e.id)} className='text-xs font-medium px-3 py-1.5 rounded-full active:scale-95 transition-transform duration-150' style={{backgroundColor: e.color + '33', color: e.color}}>
                    {e.nombre}
                  </button>
                ))}
            </div>
          </div>
          )}

          {/* Boton resolver */}
          {!ticket.resuelto && (
            <button onClick={() => setMostrarConfirmacion(true)} className='bg-green-500/20 text-green-400 rounded-2xl p-4 font-semibold text-sm active:scale-95 transition-transform duration-150'>
              Resolver ticket ✔
            </button>
          )}

          {/* Modal de confirmacion */}
          {mostrarConfirmacion && (
            <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 animate-fadeIn'>
              <div className='bg-zinc-900 w-full rounded-t-3xl p-6 flex flex-col gap-4 pb-10 animate-slideUp'>
                <div className='w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-2'></div>
                <h2 className='text-white font-semibold text-lg text-center'>Resolver ticket?</h2>
                <p className='text-zinc-400 text-sm text-center'>Una vez resuelto el ticket no se podra editar, estas seguro?</p>
                <button onClick={handleResolver} className='bg-green-500/10 text-green-400 rounded-xl p-3 font-semibold active:scale-95 transition-transform duration-150'>
                  Sí, resolver ✔
                </button>
                <button onClick={() => setMostrarConfirmacion(false)} className='bg-red-500/10 text-red-400 rounded-xl p-3 font-semibold active:scale-95 transition-transform duration-150'>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Comentarios */}
          <div className='bg-zinc-900 rounded-2xl p-5 flex flex-col gap-3'>
            <p className='text-zinc-500 text-xs font-medium uppercase tracking-wider'>Comentarios</p>
            {ticket.comentarios.map(c => {
              return (
                <div key={c.id} className='flex flex-col gap-1'>
                  <p className='text-sm text-zinc-200 leading-relaxed'>{c.contenido}</p>
                  <span className='text-zinc-600 text-xs'>
                    {c.autor} {new Date(c.creado_en).toLocaleString('es-VE')}
                  </span>
                  <div className='border-b border-zinc-800 mt-2'></div>
                </div>
              )
            })}
          </div>

          {/* Agreagar un comentario */}

          <form onSubmit={handleComentario} className='flex flex-col gap-2'>
            <textarea 
              placeholder='Agregar comentario...'
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className='bg-zinc-900 text-white rounded-2xl p-4 ouline-none placeholder-zinc-600 text-sm resize-none'
              rows={3}
            />
            <button type='submit' className='bg-blue-500/20 text-blue-400 rounded-xl p-3 font-semibold active:scale-95 transition:transform duration-150'>
              Agregar comentario 
            </button>
          </form>

          {error && <p className='text-red-400'>{error}</p>}
        </div>
   </div>
  )
}

export default TicketDetalle
