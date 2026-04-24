import { useState } from 'react'
import api from '../api'

const NuevoTicketModal = ({onClose, onTicketCreado}) => {
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/tickets', {titulo, descripcion})
            onTicketCreado(res.data)
            onClose()
        } catch (error) {
            setError('Error al crear el ticket')
        }
    }

    return (
        <div>
            <div>
                <h2>Nuevo ticket</h2>
                <button onClick={onClose}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type='text'
                    placeholder='Título'
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea 
                    placeholder='Descripcion'
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                {error && <p>{error}</p>}
                <button type='submit'>Crear Ticket</button>
            </form>
        </div>
    )
}

export default NuevoTicketModal