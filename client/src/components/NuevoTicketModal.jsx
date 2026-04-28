import { useState } from 'react'
import api from '../api'

const NuevoTicketModal = ({ onClose, onTicketCreado }) => {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/tickets', { titulo, descripcion })
      onTicketCreado(res.data)
      onClose()
    } catch (error) {
      setError('Error al crear el ticket', error)
    }
  }

  return (
    <div
      className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 animate-fadeIn'
      onClick={onClose}
    >
      <div
        className='bg-zinc-900 w-full rounded-t-3xl p-6 flex flex-col gap-4 pb-10 animate-slideUp'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className='w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-2'></div>
        <div className='flex items-center justify-between'>
          <h2 className='text-white font-semibold text-lg'>Nuevo ticket</h2>
          <button
            onClick={onClose}
            className='text-red-400 text-sm font-medium'
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input
            type='text'
            placeholder='Título'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className='bg-zinc-800 text-white rounded-xl p-3 outline-none placeholder-zinc-500 text-sm'
          />
          <textarea
            placeholder='Descripción...'
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className='bg-zinc-800 text-white rounded-xl p-3 outline-none placeholder-zinc-500 text-sm resize-none'
            rows={4}
          />
          <button
            type='submit'
            className='bg-blue-500 text-white rounded-xl p-3 font-semibold mt-1 active:scale-95 transition-transform duration-150'
          >
            Crear ticket
          </button>
        </form>
      </div>
    </div>
  )
}

export default NuevoTicketModal
