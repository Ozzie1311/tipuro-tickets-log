require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./src/db.js')
const estadosRoutes = require('./src/routes/estadosRoutes.js')
const ticketsRoutes = require('./src/routes/ticketsRoutes.js')
const authRoutes = require('./src/routes/authRoutes.js')
const pushRoutes = require('./src/routes/pushRoutes.js')
const app = express()

app.use(express.json())

// Whitelist de orígenes permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ''),
  'http://localhost:5173',
].filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  }),
)

const PORT = process.env.PORT || 3000

app.use('/api/estados', estadosRoutes)
app.use('/api/tickets', ticketsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/push', pushRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
