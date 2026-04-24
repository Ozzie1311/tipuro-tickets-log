import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

const TicketDetalle = () => {
    const {id} = useParams()
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
                    api.get('/estados')
                ])
                setTicket(ticketRes.data)
                setEstados(estadosRes.data)
            } catch (error) {
                setError('Error al cargar el ticket')
            }
        }

        fetchData()
    }, [id])

    const handleEstado = async (estado_id) => {
        try {
            await api.patch(`/tickets/${id}`, {estado_id})
            setTicket({...ticket, estado_id})
            const res = await api.get(`/tickets/${id}`)
            setTicket(res.data)
        } catch (error) {
            setError('Error al actualizar el estado')
        }
    }

    const handleComentario = async (e) => {
        e.preventDefault()
        try {
            await api.post(`/tickets/${id}/comentarios`, {contenido: comentario})
            const res = await api.get(`/tickets/${id}`)
            setTicket(res.data)
            setComentario('')
        } catch (error) {
            setError('Error al agregar el comentario')
        }
    }

    if (!ticket) return <p>Cargando...</p>

    return (
        <div>
            <button onClick={() => navigate('/tickets')}>⬅ Volver</button>
            <h2>{ticket.titulo}</h2>
            <p>{ticket.descripcion}</p>

            <span style={{backgroundColor: ticket.estado_color}}>{ticket.estado}</span>

            <p>Creado por: {ticket.creado_por}</p>
            <p>Asignado a: {ticket.asignado_a || 'Sin asignar'}</p>
            <p>Resuelto por: {ticket.resuelto_por || 'Sin resolver'}</p>

            <div>
                <h3>Cambiar estado</h3>
                {estados.map(e => (
                    <button key={e.id} style={{backgroundColor: e.color}} onClick={() => handleEstado(e.id)}>
                        {e.nombre}
                    </button>
                ))}
            </div>

            <div>
                <h3>Comentarios</h3>
                {ticket.comentarios.map(c => (
                    <div key={c.id}>
                        <p>{c.contenido}</p>
                        <small>{c.autor}-{new Date(c.creado_en).toLocaleString('es-VE')}</small>
                    </div>
                ))}
            </div>

            <form onSubmit={handleComentario}>
                <textarea 
                    placeholder='Agregar comentario'
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                />
                <button type='submit'>Comentar</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    )
}

export default TicketDetalle
