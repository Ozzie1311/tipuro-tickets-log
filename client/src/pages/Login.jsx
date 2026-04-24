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
    <div>
      <h1>Tipuro Tickets Log</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type='submit'>Entrar</button>
      </form>
    </div>
  )
}

export default Login
