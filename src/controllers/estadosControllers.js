const pool = require('../db.js')

const obtenerEstados = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estados')
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = { obtenerEstados }