const express = require('express')
const router = express.Router()
const { obtenerEstados } = require('../controllers/estadosControllers.js')

router.get('/', obtenerEstados)

module.exports = router