const pool = require('../db.js')

const obtenerTickets = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT
            t.id,
            t.titulo,
            t.descripcion,
            t.creado_en,
            e.nombre AS estado,
            u.nombre AS creado_por
            FROM tickets t
            JOIN estados e ON t.estado_id = e.id
            JOIN usuarios u ON t.creado_por = u.id
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
                e.nombre AS estado,
                e.color AS estado_color,
                u1.nombre AS creado_por,
                u2.nombre AS asignado_a,
                u3.nombre AS resuelto_por
                FROM tickets t
                JOIN estados e ON t.estado_id = e.id
                JOIN usuarios u1 ON t.creado_por = u1.id
                LEFT JOIN usuarios u2 ON t.asignado_a = u2.id
                LEFT JOIN usuarios u3 ON t.resuelto_por = u3.id
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

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { estado_id, asignado_a, resuelto_por } = req.body
    const result = await pool.query(
      `
                UPDATE tickets
                SET
                estado_id = COALESCE($1, estado_id),
                asignado_a = COALESCE($2, asignado_a),
                resuelto_por = COALESCE($3, resuelto_por),
                actualizado_en = NOW()
                WHERE id = $4
                RETURNING *
            `,
      [estado_id, asignado_a, resuelto_por, id],
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const añadirComentario = async (req, res) => {
  try {
    const { id } = req.params
    const { autor_id, contenido } = req.body
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

module.exports = {
  obtenerTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  añadirComentario,
}
