require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./src/db.js')
const estadosRoutes = require('./src/routes/estadosRoutes.js')
const ticketsRoutes = require('./src/routes/ticketsRoutes.js')
const authRoutes = require('./src/routes/authRoutes.js')
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  }),
)

const PORT = process.env.PORT || 3000

app.use('/api/estados', estadosRoutes)
app.use('/api/tickets', ticketsRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
