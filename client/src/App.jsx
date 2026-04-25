import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Tickets from './pages/Tickets'
import TicketDetalle from './pages/TicketDetalle'
import TicketsResueltos from './pages/TicketsResueltos'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/tickets/resueltos' element={<TicketsResueltos />} />
          <Route path='/tickets/:id' element={<TicketDetalle />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
