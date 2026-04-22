const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.omcbklswjvpgidxjukau',
    password: process.env.PASSWORD,
    ssl:{ rejectUnauthorized: false }
})

module.exports = pool