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
    origin: 'http://localhost:5173',
  }),
)

//Código de prueba para testear conexión a la BD
// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Error conectando a la base de datos: ', err)
//   } else {
//     console.log('Conexion exitosa a Supabase: ', res.rows[0])
//   }
// })

const PORT = process.env.PORT || 3000

app.use('/api/estados', estadosRoutes)
app.use('/api/tickets', ticketsRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
