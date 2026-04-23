const express = require('express')
const router = express.Router()
const { registroUsuario, login } = require('../controllers/authControllers.js')

router.post('/register', registroUsuario)
router.post('/login', login)

module.exports = router
