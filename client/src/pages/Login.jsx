import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.usuario)
      navigate('/tickets')
    } catch (error) {
      setError('Credenciales Incorrectas', error.message)
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center'>    
      <div className='bg-gray-800 rounded-2xl p-8 w-full max-w-sm'>
        <h1 className='text-white text-2xl font-bold text-center mb-8'>Tipuro Tickets Log</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-gray-700 text-white rounded-lg p-3 outline-none placeholder-gray-400'
          />
          <input
            type='password'
            placeholder='Contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-gray-700 text-white rounded-lg p-3 outline-none placeholder-gray-400'

          />
          {error && <p className='text-red-400 text-sm'>{error}</p>}
          <button type='submit' className='bg-blue-600 text-white rounded-lg p-3 font-semibold mt-2'>Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login
