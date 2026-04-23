const express = require('express')
const router = express.Router()
const verificarToken = require('../middleware/auth.js')
const {
  obtenerTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  añadirComentario,
} = require('../controllers/ticketsControllers.js')

router.get('/', verificarToken, obtenerTickets)
router.get('/:id', verificarToken, obtenerTicketPorId)
router.post('/', verificarToken, crearTicket)
router.patch('/:id', verificarToken, actualizarTicket)
router.post('/:id/comentarios', verificarToken, añadirComentario)

module.exports = router
