const express = require('express')
const router = express.Router()
const pool = require('../db')
const verificarToken = require('../middleware/auth')

router.post('/token', verificarToken, async (req, res) => {
  const { token } = req.body
  const usuario_id = req.usuario.id

  try {
    await pool.query(
      `INSERT INTO push_tokens (usuario_id, token)
            VALUES ($1, $2)
            ON CONFLICT (token) DO NOTHING
        `,
      [usuario_id, token],
    )
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
