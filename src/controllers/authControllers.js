const pool = require('../db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const registroUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    const usuarioExiste = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email],
    )

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya esta registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, creado_en',
      [nombre, email, passwordHash],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [
      email,
    ])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales Incorrectas' })
    }

    const usuario = result.rows[0]
    const validacionPassword = await bcrypt.compare(password, usuario.password)

    if (!validacionPassword) {
      return res.status(401).json({ error: 'Credenciales Inconrrectas' })
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    )

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { registroUsuario, login }
