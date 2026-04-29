import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Tickets from './pages/Tickets'
import TicketDetalle from './pages/TicketDetalle'
import TicketsResueltos from './pages/TicketsResueltos'
import PrivateRoute from './components/privateRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/tickets'
            element={
              <PrivateRoute>
                <Tickets />
              </PrivateRoute>
            }
          />
          <Route
            path='/tickets/resueltos'
            element={
              <PrivateRoute>
                <TicketsResueltos />
              </PrivateRoute>
            }
          />
          <Route
            path='/tickets/:id'
            element={
              <PrivateRoute>
                <TicketDetalle />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
