const express = require('express')
const router = express.Router()
const { obtenerTickets, obtenerTicketPorId, crearTicket, actualizarTicket, añadirComentario } = require('../controllers/ticketsControllers.js') 

router.get('/', obtenerTickets)
router.get('/:id', obtenerTicketPorId)
router.post('/', crearTicket)
router.patch('/:id',actualizarTicket)
router.post('/:id/comentarios', añadirComentario)

module.exports = router