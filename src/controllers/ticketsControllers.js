const pool = require('../db.js')
require('dotenv').config()

const obtenerTickets = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT
            t.id,
            t.titulo,
            t.descripcion,
            t.creado_en,
            e.nombre AS estado,
            e.color AS estado_color,
            u.nombre AS creado_por
            FROM tickets t
            JOIN estados e ON t.estado_id = e.id
            JOIN usuarios u ON t.creado_por = u.id
            WHERE t.resuelto IS NOT TRUE
            ORDER BY t.creado_en DESC
            `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params
    const ticket = await pool.query(
      `
                SELECT
                t.id,
                t.titulo,
                t.descripcion,
                t.creado_en,
                t.actualizado_en,
                t.actualizado_por,
                e.nombre AS estado,
                e.color AS estado_color,
                u1.nombre AS creado_por,
                u2.nombre AS asignado_a,
                u3.nombre AS resuelto_por,
                u4.nombre AS actualizado_por
                FROM tickets t
                JOIN estados e ON t.estado_id = e.id
                JOIN usuarios u1 ON t.creado_por = u1.id
                LEFT JOIN usuarios u2 ON t.asignado_a = u2.id
                LEFT JOIN usuarios u3 ON t.resuelto_por = u3.id
                LEFT JOIN usuarios u4 ON t.actualizado_por = u4.id
                WHERE t.id = $1
            `,
      [id],
    )

    if (ticket.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket no encontrado' })
    }

    const comentarios = await pool.query(
      `
                SELECT c.id, c.contenido, c.creado_en, u.nombre AS autor
                FROM comentarios c
                JOIN usuarios u ON c.autor_id = u.id
                WHERE c.ticket_id = $1
                ORDER BY c.creado_en ASC
            `,
      [id],
    )

    res.json({ ...ticket.rows[0], comentarios: comentarios.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const crearTicket = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body
    const creado_por = req.usuario.id

    const result = await pool.query(
      `
                INSERT INTO tickets(titulo, descripcion, estado_id, creado_por)
                VALUES ($1, $2, 1, $3)
                RETURNING *
            `,
      [titulo, descripcion, creado_por],
    )

    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings: { en: 'Nuevo ticket' },
        contents: { en: titulo },
      }),
    })

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { estado_id, asignado_a, resuelto_por } = req.body
    const actualizado_por = req.usuario.id

    const result = await pool.query(
      `
                UPDATE tickets
                SET
                estado_id = COALESCE($1, estado_id),
                asignado_a = COALESCE($2, asignado_a),
                resuelto_por = COALESCE($3, resuelto_por),
                actualizado_por = $4,
                actualizado_en = NOW()
                WHERE id = $5
                RETURNING *
            `,
      [estado_id, asignado_a, resuelto_por, actualizado_por, id],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const añadirComentario = async (req, res) => {
  try {
    const { id } = req.params
    const { contenido } = req.body
    const autor_id = req.usuario.id
    const result = await pool.query(
      `
                INSERT INTO comentarios (ticket_id, autor_id, contenido)
                VALUES($1, $2, $3)
                RETURNING *
            `,
      [id, autor_id, contenido],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const obtenerTicketsResueltos = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
        t.id, t.titulo, t.descripcion, t.creado_en, t.actualizado_en, e.nombre AS estado, e.color AS estado_color, u.nombre AS creado_por, u2.nombre AS resuelto_por
        FROM tickets t
        JOIN estados e ON t.estado_id = e.id
        JOIN usuarios u ON t.creado_por = u.id
        LEFT JOIN usuarios u2 ON t.resuelto_por = u2.id
        WHERE resuelto = TRUE
        ORDER BY t.actualizado_en DESC
      `)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const resolverTicket = async (req, res) => {
  try {
    const { id } = req.params
    const resuelto_por = req.usuario.id

    const estadoResuelto = await pool.query(`
      SELECT id FROM estados WHERE nombre='Resuelto'
      `)

    const result = await pool.query(
      `
        UPDATE tickets
        SET
        resuelto = TRUE,
        resuelto_por = $1,
        estado_id = $2,
        actualizado_en = NOW()
        WHERE id = $3
        RETURNING *
      `,
      [resuelto_por, estadoResuelto.rows[0].id, id],
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  obtenerTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  añadirComentario,
  obtenerTicketsResueltos,
  resolverTicket,
}
